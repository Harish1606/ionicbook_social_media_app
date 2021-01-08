import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {

  people=[];
  view=[];
  constructor(private router:Router,private afs:AngularFirestore,private userService:UserService) { }

  ngOnInit() {
    this.afs.doc(`status/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.view=data['view'];
      this.people=[];
      this.view.forEach(res=>{
        this.afs.doc(`users/${res}`).valueChanges().subscribe(r=>{
          this.people.push({
            name:r['username'],
            profilePic:r['profilePic'],
            uid:r['uid']
          })
        })
      })
    })
  }

  goTo(id:string){
    this.router.navigate(['/tabs/people/'+id]);
  }

  goBack(){
    this.router.navigate(['/mystatus']);
  }

}
