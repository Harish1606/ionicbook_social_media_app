import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.page.html',
  styleUrls: ['./following.page.scss'],
})
export class FollowingPage implements OnInit {

  busy:boolean=true;
  follow='Follow';
  following=[];
  followingList=[];
  searchedItem=[];

  @ViewChild('search',{static:false}) search:IonSearchbar;

  constructor(private location:Location,private afs:AngularFirestore,private router:Router,private userService:UserService) {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.followingList=data['following'];
      this.following=[];
      this.followingList.forEach(res=>{
        this.afs.doc(`users/${res}`).valueChanges().subscribe(r=>{
          this.following.push({
            name:r['username'],
            profilePic:r['profilePic'],
            bio:r['bio'],
            follow:this.follow=r['followers'].includes(this.userService.getUID())?'Unfollow':'Follow',
            uid:r['uid']
          })
        })
      })
      this.following.sort((a,b)=>{
        const x:string=a.name.toLowerCase();
        const y:string=b.name.toLowerCase();
        if(x<y){
          return -1;
        }
        if(x>y){
          return 1;
        }
      })
      this.searchedItem=this.following;
    })
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

  searchUsers(event){
    const val=event.target.value;
    this.searchedItem=this.following;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  toggle(id:string)
  {
    this.afs.doc(`users/${id}`).update({
      followers:firestore.FieldValue.arrayRemove(this.userService.getUID())
    });
    this.afs.doc(`users/${this.userService.getUID()}`).update({
      following:firestore.FieldValue.arrayRemove(id)
    });
    
  }

  goToProfile(id:string){
    this.router.navigate(['/tabs/people/'+id]);
  }

  goBack(){
    this.location.back();
  }

}
