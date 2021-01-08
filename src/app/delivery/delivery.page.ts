import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.page.html',
  styleUrls: ['./delivery.page.scss'],
})
export class DeliveryPage implements OnInit {

  name:string="";
  email:string="";
  address:string="";
  number:string="";
  total=0;
  products=[];
  cart=[];
  constructor(private afs:AngularFirestore,private userService:UserService,private router:Router) { }

  ngOnInit() {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.cart=data['cart'];
      this.name=data['cartName'];
      this.email=data['cartEmail'];
      this.address=data['cartAddress'];
      this.number=data['cartNumber'];
      this.products=[];
      this.total=0;
      this.cart.forEach(res=>{
        this.afs.doc(`products/${res}`).valueChanges().subscribe(data=>{
          this.products.push(data);
          this.total+=data['price'];
        })
      })
    })
  }

  confirmOrder(){
    this.afs.doc(`users/${this.userService.getUID()}`).update({
      cartName:this.name,
      cartAddress:this.address,
      cartNumber:this.number,
      cartEmail:this.email
    });
    this.router.navigate(['/tabs/checkout/payment']);
  }

}
