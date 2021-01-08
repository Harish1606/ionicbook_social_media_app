import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-prod-detail',
  templateUrl: './prod-detail.page.html',
  styleUrls: ['./prod-detail.page.scss'],
})
export class ProdDetailPage implements OnInit {

  busy:boolean=false;
  cartList=[];
  product;
  id:string;
  constructor(private location:Location,
    private route:ActivatedRoute,
    private afs:AngularFirestore,
    private router:Router,
    private userService:UserService,
    private toastController:ToastController) { }

  ngOnInit() {
    this.busy=true;
    this.id=this.route.snapshot.paramMap.get('id');
    this.afs.doc(`products/${this.id}`).valueChanges().subscribe(data=>{
      this.product=data;
      this.busy=false;
    },
    error=>{
      this.busy=false;
    })
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.cartList=data['cart'];
    })
  }

  addToCart(){
    if(this.cartList.includes(this.id)){
      this.showToast('Product is present already in cart');
    }
    else
    {
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        cart:firestore.FieldValue.arrayUnion(this.id)
      })
      this.showToast('Product added to cart successfully');
    }
  }

  async showToast(message:string){
    const toast=await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      animated:true
    })
    toast.present();
  }

  goToCart(){
    this.router.navigate(['/tabs/cart']);
  }

  goBack(){
    this.location.back();
  }

}
