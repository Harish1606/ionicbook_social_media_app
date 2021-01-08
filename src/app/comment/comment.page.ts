import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  busy:boolean=false;
  postInfo:any=[];
  info:any=[];
  user;
  comments=[];
  postId:string="";
  comment:string="";
  userid;
  constructor(private location:Location,
    private afs:AngularFirestore,
    private route:ActivatedRoute,
    private userService:UserService,
    private router:Router) {}

  ngOnInit() {
    this.busy=true;
    this.postId=this.route.snapshot.paramMap.get('id');
    this.userid=this.userService.getUID();
    this.afs.doc(`posts/${this.postId}`).valueChanges().subscribe(r=>{
      this.info=r;
      this.afs.doc(`users/${this.info.uid}`).valueChanges().subscribe(re=>{
        this.postInfo=re;
      })
    })
    this.afs.doc(`users/${this.userid}`).valueChanges().subscribe(res=>{
      this.user=res;
    })
    this.afs.doc(`comment/${this.postId}`).collection(this.postId).valueChanges().subscribe(data=>{
      this.comments=data;
      this.comments.sort((a,b)=>{
        return a.time-b.time;
      })
      this.busy=false;
    },
    error=>{
      console.log(error);
      this.busy=false;
    })
  }

  goBack(){
    this.location.back();
  }

  send(){
    this.afs.doc(`comment/${this.postId}`).collection(this.postId).add({
      name:this.user.username,
      profilePic:this.user.profilePic,
      msg:this.comment,
      uid:this.user.uid,
      time:Date.now()
    }).then(()=>{
      this.comment="";
    })
    if(this.postInfo.uid!=this.userid){
      this.afs.doc(`notifications/${this.postInfo.uid}`).collection(this.postInfo.uid).add({
        name:this.user.username,
        profilePic:this.user.profilePic,
        msg:" commented on your post.",
        postid:this.postId,
        time:Date.now(),
        visible:false
      });
      }
  }

  goToProfile(uid:string){
    if(this.userid==uid){
      this.router.navigate(['/tabs/profile']);
    }
    else{
      this.router.navigate(['/tabs/people/'+uid]);
    }
  }
}
