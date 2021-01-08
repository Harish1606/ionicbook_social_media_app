import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { Location } from '@angular/common';
import { ActionSheetController, AlertController, IonSelect } from '@ionic/angular';


@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  check:boolean=false;
  shareuid:string="";
  shareeffect:string="";
  shareList=[];
  saveList=[];
  saveType:string;
  info:any=[];
  profile;
  effect:string='';
  sub;
  post;
  postId:string;
  Color:string="dark"
  heartType:string="heart-outline"
  postReference:AngularFirestoreDocument;

  
  @ViewChild('userList') selectRef: IonSelect;

  constructor(private route:ActivatedRoute,
    private afs:AngularFirestore,
    private router:Router,
    private user:UserService,
    private location:Location,
    private actionSheetController:ActionSheetController,
    private alertController:AlertController) { 
  }

  ngOnInit() {
    this.postId=this.route.snapshot.paramMap.get('id')
    this.postReference=this.afs.doc(`posts/${this.postId}`);
    this.afs.doc(`users/${this.user.getUID()}`).valueChanges().subscribe(r=>{
      this.info=r;
      this.saveList=r['saved'];
    });
    this.postReference.valueChanges().subscribe(data=>{
      this.post=data;
      this.effect=data.effect;
      this.check=this.info.posts.includes(`${this.postId}/${this.effect}`)?true:false;
      this.saveType=this.saveList.includes(`${this.postId}/${this.effect}`)?'bookmark':'bookmark-outline';
      this.afs.doc(`users/${this.post.uid}`).valueChanges().subscribe(res=>{
        this.profile=res;
      },
      error=>{
        console.log(error);
      })
      this.heartType=data.likes.includes(this.user.getUID())?'heart':'heart-outline';
      if(this.heartType=='heart'){
        this.Color='danger';
      }
      else{
        this.Color='dark';
      }
    },
    error=>{
      console.log(error);
    })
    
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.shareList=[];
      data.forEach(res=>{
        if(res['uid']!=this.user.getUID()){
          this.shareList.push(res);
        }
      })
    })
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header:'Events',
      buttons: [
      {
        text: 'Share',
        icon: 'share',
        handler: () => {
          this.share();
        }
      },
      {
        text:'Delete',
        icon:'trash',
        handler:()=>{
          this.presentAlertPrompt();
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  savePost(){ 
    if(!this.saveList.includes(`${this.postId}/${this.effect}`)){
      this.afs.doc(`users/${this.user.getUID()}`).update({
        saved:firestore.FieldValue.arrayUnion(`${this.postId}/${this.effect}`)
      })
      this.saveType='Bookmark';
    }
    else{
      this.afs.doc(`users/${this.user.getUID()}`).update({
        saved:firestore.FieldValue.arrayRemove(`${this.postId}/${this.effect}`)
      })  
      this.saveType='Bookmark-outline';
    }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Delete post',
      message:'Are you sure you want to delete this post?',
      buttons:[
        {
          text:'No',
          role:'cancel'
        },
        {
          text:'Yes',
          role:'Ok',
          handler:()=>{
            this.afs.doc(`users/${this.user.getUID()}`).update({
              posts:firestore.FieldValue.arrayRemove(`${this.postId}/${this.effect}`)
            })
            this.afs.collection(`users`).valueChanges().subscribe(data=>{
              this.afs.doc(`users/${data}`).update({
                saved:firestore.FieldValue.arrayRemove(`${this.postId}/${this.effect}`)
              })
            })
            this.postReference.delete();
            this.router.navigate(['/tabs/profile']);
          }
        }
      ]
    });
    await alert.present();
  }

  toggleHeart(){
    if(this.heartType=='heart-outline'){
      this.postReference.update({
        likes:firestore.FieldValue.arrayUnion(this.user.getUID())
      })
      if(this.profile.uid!=this.info.uid){
      this.afs.doc(`notifications/${this.profile.uid}`).collection(this.profile.uid).add({
        name:this.info.username,
        profilePic:this.info.profilePic,
        msg:" liked your photo.",
        postid:this.postId,
        time:Date.now(),
        visible:false
      });
      }
    }
    else{
      this.postReference.update({
        likes:firestore.FieldValue.arrayRemove(this.user.getUID())
      })
    }
  }

  share(){
    this.shareuid=this.postId;
    this.shareeffect=this.effect;
    setTimeout(()=>{
      this.selectRef.open();
    }, 2);
  }

  setUser(event){
    const o_uid=event.detail.value;
    this.afs.doc(`chats/${this.user.getUID()}`).collection(o_uid).add({
      time:Date.now(),
      uid:this.user.getUID(),
      msg:' ',
      name:this.info.username,
      visible:true,
      postid:this.shareuid,
      effect:this.shareeffect
    });
    
    this.afs.doc(`chats/${o_uid}`).collection(this.user.getUID()).add({
      time:Date.now(),
      uid:this.user.getUID(),
      msg:' ',
      name:this.info.username,
      visible:false,
      postid:this.shareuid,
      effect:this.shareeffect
    });
  }

  goBack(){
    this.location.back();
  }

  goToLike(){
    this.router.navigate(['/tabs/like/'+this.postId]);
  }

  goToComment(){
    this.router.navigate(['/tabs/comment/'+this.postId]);
  }

  goToProfile(id:string){
    if(this.user.getUID()==id){
      this.router.navigate(['/tabs/profile']);
    }
    else{
      this.router.navigate(['/tabs/people/'+id]);
    }
  }

}
