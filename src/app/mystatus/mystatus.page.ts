import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-mystatus',
  templateUrl: './mystatus.page.html',
  styleUrls: ['./mystatus.page.scss'],
})
export class MystatusPage implements OnInit {

  busy:boolean=false;
  v:number=0;
  j:number=1000;
  status;
  constructor(private router:Router,private afs:AngularFirestore,private userService:UserService) { }

  ngOnInit() {
    this.busy=true;
    this.afs.doc(`status/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.status=data;
      this.busy=false;
    },
    error=>{
      this.busy=false;
    }) 
  }

  ionViewWillEnter() {
    this.v=0;
    if(this.v<1){
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
    }
  }

  delay(){
    setTimeout(() => {
      this.v+=0.1;
      if(this.v>0.9){
        this.router.navigate(['/message/status']);
        this.v=0;
      }
    }, this.j);
  }

  goToView(){
    this.v=0;
    this.router.navigate(['/view']);
  }

  goBack(){
    this.v=0;
    this.router.navigate(['/message/status']);
  }
}
