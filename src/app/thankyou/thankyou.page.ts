import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.page.html',
  styleUrls: ['./thankyou.page.scss'],
})
export class ThankyouPage implements OnInit {

  randInteger:string='0';
  constructor(private router:Router) {
    this.randInteger=(Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }

  ngOnInit() {
  }

  goToHome(){
    this.router.navigate(['/tabs/product']);
  }

}
