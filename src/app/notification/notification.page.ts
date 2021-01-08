import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  busy:boolean=true;
  data=[];
  constructor(private afs:AngularFirestore,private router:Router,private user:UserService) { }

  ngOnInit() {
    this.busy=true;
    this.afs.doc(`notifications/${this.user.getUID()}`).collection(this.user.getUID()).get().subscribe(data=>{
      data.forEach(function(doc){
        doc.ref.update({
          visible:true
        })
      })
    })
    this.afs.doc(`notifications/${this.user.getUID()}`).collection(this.user.getUID()).valueChanges().subscribe(res=>{
      this.data=res;
      this.data.sort((a,b)=>{
        return b.time-a.time;
      });
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

  goTo(id:string,message:string){
    if(message==' liked your photo.'){
      this.router.navigate(['/tabs/post/'+id]);
    }
    else if(message==' commented on your post.'){
      this.router.navigate(['/tabs/comment/'+id]);
    }
    else if(message==' viewed your profile.'){
      this.router.navigate(['/tabs/people/'+id]);
    }
    else if(message==' started following you.'){
      this.router.navigate(['/tabs/people/'+id]);
    }
  }

}
