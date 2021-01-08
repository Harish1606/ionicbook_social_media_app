import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  noti=[];
  count=0;
  constructor(public router:Router,private user:UserService,private afs:AngularFirestore) {
    this.afs.doc(`notifications/${this.user.getUID()}`).collection(this.user.getUID()).valueChanges().subscribe(data=>{
      this.noti=data;
      this.count=0;
      this.noti.forEach(res=>{
        if(res.visible==false){
          this.count+=1;
        }
      })
    })
  }

  ngOnInit() {
  }

  trigger(){
    this.count=0;
  }
  
}
