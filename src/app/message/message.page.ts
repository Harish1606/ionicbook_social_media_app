import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  constructor(private router:Router) {}

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/tabs/feed']);
  }

  goToChats(){
    this.router.navigate(['/message/chats']);
  }
  
  goToStatus(){
    this.router.navigate(['/message/status']);
  }

  goToGroup(){
    this.router.navigate(['/message/group']);
  }

}
