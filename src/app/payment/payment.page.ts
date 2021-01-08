import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  total:number=0;
  cart=[];
  name:string="";
  email:string="";
  address:string="";
  number:string="";
  constructor(private router:Router,private afs:AngularFirestore,private userService:UserService,private toastController:ToastController) { }

  ngOnInit() {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.cart=data['cart'];
      this.name=data['cartName'];
      this.email=data['cartEmail'];
      this.address=data['cartAddress'];
      this.number=data['cartNumber'];
      this.total=0;
      this.cart.forEach(res=>{
        this.afs.doc(`products/${res}`).valueChanges().subscribe(data=>{
          this.total+=data['price'];
        })
      })
    })
  }

  finishOrder(){
    this.cart.forEach(res=>{
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        cart:firestore.FieldValue.arrayRemove(res)
      })
    })
    this.showToast('Your order confirmed successfully');
    this.router.navigate(['/tabs/thankyou']);
  }

  async showToast(message:string){
    const toast=await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      animated:true,
      color:'success'
    })
    toast.present();
  }

}
