import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  constructor(private location:Location,private router:Router,private userService:UserService) { }

  ngOnInit() {
  }

  goToHome(){
    this.router.navigate(['/tabs/product']);
  }

  goToDelivery(){
    this.router.navigate(['/tabs/checkout/delivery']);
  }

  goToPayment(){
    this.router.navigate(['/tabs/checkout/payment']);
  }

  goBack(){
    this.location.back();
  }

}
