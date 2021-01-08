import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { IonSearchbar } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  busy:boolean=true;
  list=[];
  time:string="";
  highlight:string="";
  visibility:boolean=true;
  count:number=0;
  currentuid;
  userData=[];
  public searchedItem:any;
  
  @ViewChild('search',{static:false}) search:IonSearchbar;
  
  constructor(private router:Router,private afs:AngularFirestore,private userService:UserService) { }

  ngOnInit() {
    this.currentuid=this.userService.getUID();
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.userData=[];
      data.forEach(res=>{
        if(res['uid']!=this.currentuid){
          this.afs.doc(`chats/${this.currentuid}`).collection(res['uid']).valueChanges().subscribe(r=>{
            let list=[];
            list=r;
            let f=0;
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
            this.userData.sort((a,b)=>{
              return b.time-a.time;
            })
            this.searchedItem=this.userData;
          })
        }
      });
    },
    error=>{
      console.log(error);
    })
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 1000);
  }

  searchUsers(event){
    const val=event.target.value;
    this.searchedItem=this.userData;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.username.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goTo(uid:string){
    this.router.navigate(['/chat/'+uid]);
  }

  goToSearch(){
    this.router.navigate(['/tabs/discover']);
  }

}
