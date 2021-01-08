import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  busy:boolean=true;
  follow='Follow'
  iter=[];
  peoples=[];
  public searchedItem:any;
  
  @ViewChild('search',{static:false}) search:IonSearchbar;
  
  constructor(private location:Location,private afs:AngularFirestore,private userService:UserService,private router:Router) { }

  ngOnInit() {
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.iter=data;
      this.peoples=[];
      this.iter.forEach(res=>{
        if(res.uid!=this.userService.getUID()){
          this.peoples.push({
            name:res.username,
            profilePic:res.profilePic,
            bio:res.bio,
            follow:this.follow=res.followers.includes(this.userService.getUID())?'Unfollow':'Follow',
            uid:res.uid
          })
        }
      })
      this.peoples.sort((a,b)=>{
        const x:string=a.name.toLowerCase();
        const y:string=b.name.toLowerCase();
        if(x<y){
          return -1;
        }
        if(x>y){
          return 1;
        }
      });
      this.searchedItem=this.peoples;
    })
  }

  toggle(id:string,i:number){
    if(this.peoples[i].follow=='Follow'){
      this.afs.doc(`users/${id}`).update({
        followers:firestore.FieldValue.arrayUnion(this.userService.getUID())
      });
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        following:firestore.FieldValue.arrayUnion(id)
      });
    }
    else{
      this.afs.doc(`users/${id}`).update({
        followers:firestore.FieldValue.arrayRemove(this.userService.getUID())
      });
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        following:firestore.FieldValue.arrayRemove(id)
      });
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

  searchUsers(event){
    const val=event.target.value;
    this.searchedItem=this.peoples;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goToProfile(id:string){
    this.router.navigate(['/tabs/people/'+id]);
  }

  goBack(){
    this.location.back();
  }

}
