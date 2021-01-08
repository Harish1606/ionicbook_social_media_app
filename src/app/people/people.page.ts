import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { Location } from '@angular/common';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  noti:any;
  follow='Follow';
  profile;
  sub;
  userId:string;
  postReference:AngularFirestoreDocument;
  currentReference:AngularFirestoreDocument;

  constructor(private router:Router,
    private route:ActivatedRoute,
    private afs:AngularFirestore,
    private userService:UserService,
    private location:Location) {
      this.afs.doc(`users/${this.userService.getUID}`).valueChanges().subscribe(data=>{
        this.noti=data;
      })
    }

  ngOnInit() {
    this.userId=this.route.snapshot.paramMap.get('id');
    this.postReference=this.afs.doc(`users/${this.userId}`);
    this.currentReference=this.afs.doc(`users/${this.userService.getUID()}`);
    this.sub=this.postReference.valueChanges().subscribe(data=>{
      this.profile=data;
      this.follow=data.followers.includes(this.userService.getUID())?'Unfollow':'Follow';
    },
    error=>{
      console.log(error);
    })
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  goBack(){
    this.location.back();
  }

  goTo(postId:string){
    this.router.navigate(['/tabs/post/'+postId.split('/')[0]])
  }

  goToChat(){
    this.router.navigate(['/chat/'+this.userId]);
  }

  toggle(){
    if(this.follow=='Follow'){
      this.postReference.update({
        followers:firestore.FieldValue.arrayUnion(this.userService.getUID())
      });
      this.currentReference.update({
        following:firestore.FieldValue.arrayUnion(this.userId)
      });
      //notifications purpose
      if(this.noti!=undefined){
      this.afs.doc(`notifications/${this.userId}`).collection(this.userId).add({
        name:this.noti.username,
        profilePic:this.noti.profilePic,
        msg:" started following you.",
        postid:this.userService.getUID(),
        time:Date.now(),
        visible:false
      });
    }
    }
    else{
      this.postReference.update({
        followers:firestore.FieldValue.arrayRemove(this.userService.getUID())
      });
      this.currentReference.update({
        following:firestore.FieldValue.arrayRemove(this.userId)
      });
    }
  }

}
