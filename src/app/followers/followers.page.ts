import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {

  busy:boolean=true;
  follow='Follow';
  followers=[];
  followersList=[];
  followingList=[];
  searchedItem=[];

  @ViewChild('search',{static:false}) search:IonSearchbar;

  constructor(private location:Location,private afs:AngularFirestore,private router:Router,private userService:UserService) {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.followersList=data['followers'];
      this.followingList=data['following'];
      this.followers=[];
      this.followersList.forEach(res=>{
        this.afs.doc(`users/${res}`).valueChanges().subscribe(r=>{
          this.followers.push({
            name:r['username'],
            profilePic:r['profilePic'],
            bio:r['bio'],
            follow:this.follow=r['followers'].includes(this.userService.getUID())?'Unfollow':'Follow',
            uid:r['uid']
          })
        })
      })
      this.followers.sort((a,b)=>{
        const x:string=a.name.toLowerCase();
        const y:string=b.name.toLowerCase();
        if(x<y){
          return -1;
        }
        if(x>y){
          return 1;
        }
      })
      this.searchedItem=this.followers;
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
    this.searchedItem=this.followers;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  toggle(id:string)
  {
    if(this.followingList.includes(id)){
      this.afs.doc(`users/${id}`).update({
        followers:firestore.FieldValue.arrayRemove(this.userService.getUID())
      });
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        following:firestore.FieldValue.arrayRemove(id)
      });
    }
    else{
      this.afs.doc(`users/${id}`).update({
        followers:firestore.FieldValue.arrayUnion(this.userService.getUID())
      });
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        following:firestore.FieldValue.arrayUnion(id)
      });
    }
  }

  goToProfile(id:string){
    this.router.navigate(['/tabs/people/'+id]);
  }

  goBack(){
    this.location.back();
  }

}
