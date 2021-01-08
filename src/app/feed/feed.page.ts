import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  imgUrl;
  shareeffect:string="";
  shareuid:string="";
  shareList=[];
  busy:boolean=false;
  profile=[];
  feed=[];
  count:number=0;
  list=[];
  time;
  currentuid;
  userData=[];
  highlight:string="";
  visibility:boolean=true;
  heartType=[];
  name;
  pic;
  saveType=[];
  saveList=[];
  flag=0;
  check=[];

  @ViewChild('userList') selectRef: IonSelect;

  constructor(public router:Router,private afs:AngularFirestore,private userService:UserService) {
  }

  ngOnInit() {
    this.busy=true;
    this.currentuid=this.userService.getUID(); 
    this.afs.doc(`users/${this.currentuid}`).valueChanges().subscribe(data=>{
      this.name=data['username'];
      this.pic=data['profilePic'];
      this.saveList=data['saved'];
    })
    //Users post
    this.afs.collection('posts').valueChanges().subscribe(data=>{
      this.feed=data;
      this.feed.sort((a,b)=>{
        return b.date-a.date;
      });
      this.profile=[];
      this.feed.forEach(res=>{
        this.afs.doc(`users/${res.uid}`).valueChanges().subscribe(r=>{
          this.profile.push({
            username:r['username'],
            profilePic:r['profilePic']
          })
        }
      )
      })

      this.heartType=[];
      this.feed.forEach(res=>{
        const h=res.likes.includes(this.userService.getUID())?'heart':'heart-outline';
        const c=h=='heart'?'danger':'dark';
        this.heartType.push({
          type:h,
          color:c
        })
      })

      this.saveType=[];
      this.feed.forEach(re=>{
        const t=this.saveList.includes(`${re.postid}/${re.effect}`)?'bookmark':'bookmark-outline';
        this.saveType.push({
          type:t
        })
      })
      this.busy=false;
    },
    error=>{
      this.busy=false; 
    })
    //Unread mesaages count
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.userData=[];
      this.shareList=[];
      data.forEach(res=>{
        if(res['uid']!=this.currentuid){
          this.shareList.push(res);
          this.afs.doc(`chats/${this.currentuid}`).collection(res['uid']).valueChanges().subscribe(r=>{
            let list=[];
            list=r;
            let f=0;
            this.count=0;
            list.sort(function(a,b){
              return a.time-b.time;
            })
            this.highlight=list[list.length-1]?.msg;
            this.visibility=list[list.length-1]?.visible;
            this.time=list[list.length-1]?.time;
            const j=this.userData.find(verify => verify.uid === res['uid']);
            if(j){
              j.highlight=this.highlight;
              j.visible=this.visibility;
              j.time=this.time;
              f=1;
            }
            if(f==0){
              this.userData.push({
                uid:res['uid'],
                profilePic:res['profilePic'],
                username:res['username'],
                highlight:this.highlight,
                visible:this.visibility,
                time:this.time
              });
            }
            this.highlight="";
            this.visibility=true;     
            this.userData.sort(function(a,b){
              return b.time-a.time;
            }) 
            this.userData.forEach(verify=>{
              if(verify.visible==false){
                this.count+=1;
              }
            })
          })
        }
      });
    },
    error=>{
      console.log(error);
      this.busy=false;
    })
    this.busy=false;
  }

  ionViewWillEnter(){
    this.check=[];
  }

  ionViewDidLeave(){
    this.check.forEach(data=>{
      if(data.c==1)
      {
        this.afs.doc(`posts/${data.postid}`).update({
          likes:firestore.FieldValue.arrayUnion(this.userService.getUID())
        })
      }
      else
      {
        this.afs.doc(`posts/${data.postid}`).update({
          likes:firestore.FieldValue.arrayRemove(this.userService.getUID())
        })
      }
    })
  }	

  savePost(id:string,effect:string,i:number){ 
    if(!this.saveList.includes(`${id}/${effect}`)){
      this.afs.doc(`users/${this.currentuid}`).update({
        saved:firestore.FieldValue.arrayUnion(`${id}/${effect}`)
      })
      this.saveType[i].type='Bookmark';
    }
    else{
      this.afs.doc(`users/${this.currentuid}`).update({
        saved:firestore.FieldValue.arrayRemove(`${id}/${effect}`)
      })  
      this.saveType[i].type='Bookmark-outline';
    }
    this.afs.doc(`users/${this.currentuid}`).valueChanges().subscribe(data=>{
      this.saveList=data['saved'];
    })
  }

  toggleHeart(i:number){
    if(this.heartType[i].type=='heart-outline'){
      this.check.push({
        c:1,
        postid:this.feed[i].postid
      })
      this.heartType[i].type='heart'
      this.heartType[i].color='danger'
      if(this.feed[i].uid!=this.currentuid){
        this.afs.doc(`notifications/${this.feed[i].uid}`).collection(this.feed[i].uid).add({
          name:this.name,
          profilePic:this.pic,
          msg:" liked your photo.",
          postid:this.feed[i].postid,
          time:Date.now(),
          visible:false
        });
      }
    }
    else{
      this.heartType[i].type='heart-outline'
      this.heartType[i].color='dark'
      this.check.push({
        c:0,
        postid:this.feed[i].postid
      })
    }
  }

  share(id:string,effect:string){
    this.shareuid=id;
    this.shareeffect=effect;
    setTimeout(()=>{
      this.selectRef.open();
    }, 2);
  }

  setUser(event){
    const o_uid=event.detail.value;
    this.afs.doc(`chats/${this.currentuid}`).collection(o_uid).add({
      time:Date.now(),
      uid:this.currentuid,
      msg:' ',
      name:this.name,
      visible:true,
      postid:this.shareuid,
      effect:this.shareeffect
    });
    
    this.afs.doc(`chats/${o_uid}`).collection(this.currentuid).add({
      time:Date.now(),
      uid:this.currentuid,
      msg:' ',
      name:this.name,
      visible:false,
      postid:this.shareuid,
      effect:this.shareeffect
    });

    this.afs.doc(`chats/${this.currentuid}`).collection(o_uid).valueChanges().subscribe(data=>{
      if(data.length==1){
        this.afs.doc(`${this.currentuid}/${o_uid}`).set({
          color:'primary'
        })
        this.afs.doc(`${o_uid}/${this.currentuid}`).set({
          color:'primary'
        })
      }
    })
  }

  message(){
    this.router.navigate(['/message']);
    this.check.forEach(data=>{
      if(data.c==1)
      {
        this.afs.doc(`posts/${data.postid}`).update({
          likes:firestore.FieldValue.arrayUnion(this.userService.getUID())
        })
      }
      else
      {
        this.afs.doc(`posts/${data.postid}`).update({
          likes:firestore.FieldValue.arrayRemove(this.userService.getUID())
        })
      }
    })
  }

  search(){
    this.router.navigate(['/tabs/search']);
  }

  goToLike(id:string){
    this.router.navigate(['/tabs/like/'+id]); 
  }

  goToComment(id:string){
    this.router.navigate(['/tabs/comment/'+id]);
  }

  goToProfile(id:string){
    if(id==this.currentuid){
      this.router.navigate(['/tabs/profile']);
    }
    else{
      this.router.navigate(['/tabs/people/'+id]);
    }
  }

}
