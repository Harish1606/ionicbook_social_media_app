import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  busy:boolean=false;
  userData;
  feedback:string="";
  constructor(private location:Location,
    private afs:AngularFirestore,
    private userService:UserService,
    private router:Router,
    private toastController:ToastController) {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.userData=data;
    })
   }
  ngOnInit() {
  }

  submit(){
    this.busy=true;
    this.afs.collection('feedback').add({
      name:this.userData.username,
      msg:this.feedback
    }).then(()=>{
      this.feedback="";
      this.showToast("Thanks for your feedback");
      this.router.navigate(['/tabs/profile']);
      this.busy=false;
    })
  }

  async showToast(message:string){
    const toast=await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      color:'primary'
    })
    toast.present();
  }

  goBack(){
    this.location.back();
  }

}
