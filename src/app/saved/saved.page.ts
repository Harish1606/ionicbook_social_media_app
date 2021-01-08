import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {

  busy:boolean=false;
  save;
  constructor(private location:Location,private afs:AngularFirestore,private userService:UserService,private router:Router) { 
    this.busy=true;
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.save=data;
      this.busy=false;
    },
    error=>{
      this.busy=false;
    })
  }

  ngOnInit() {
  }

  goTo(p:string){
    this.router.navigate(['/tabs/post/'+p.split('/')[0]])
  }

  goBack(){
    this.location.back();
  }

}
