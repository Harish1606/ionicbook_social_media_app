import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  busy:boolean=true;
  products=[];
  productuid=[];
  constructor(private location:Location,private afs:AngularFirestore,private userService:UserService,private router:Router) { }

  ngOnInit() {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.productuid=data['cart'];
      this.products=[];
      this.productuid.forEach(res=>{
        this.afs.doc(`products/${res}`).valueChanges().subscribe(data=>{
          this.products.push(data);
        })
      })
    })
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

  goToProduct(uid:string){
    this.router.navigate(['/tabs/prod-detail/'+uid]);
  }

  goToCheckout(){
    this.router.navigate(['/tabs/checkout']);
  }

  remove(uid:string){
    this.afs.doc(`users/${this.userService.getUID()}`).update({
      cart:firestore.FieldValue.arrayRemove(uid)
    });
  }

  search(){
    this.router.navigate(['/tabs/product']);
  }

  goBack(){
    this.location.back();
  }

}
