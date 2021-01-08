import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { IonSearchbar } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  busy:boolean=true;
  info:any=[];
  public userData:Array<Object>=[];
  public searchedItem:any;

  @ViewChild('search',{static:false}) search:IonSearchbar;

  constructor(public router:Router,private afs:AngularFirestore,private user:UserService) { 
    this.afs.doc(`users/${this.user.getUID()}`).valueChanges().subscribe(data=>{
      this.info=data;
    })
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.userData=data;
      this.searchedItem=data;
    },
    error=>{
      console.log(error);
    })
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    setTimeout(()=>{
      this.search.setFocus();
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

  goBack(){
    this.router.navigate(['/tabs/feed']);
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
    if(uid==this.user.getUID()){
      this.router.navigate(['/tabs/profile']);
    }
    else{
      this.router.navigate(['/tabs/people/'+uid]);
      this.afs.doc(`notifications/${uid}`).collection(uid).add({
        name:this.info.username,
        profilePic:this.info.profilePic,
        msg:" viewed your profile.",
        postid:this.user.getUID(),
        time:Date.now(),
        visible:false
      });
    }
  }

}
