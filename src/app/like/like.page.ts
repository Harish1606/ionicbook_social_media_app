import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-like',
  templateUrl: './like.page.html',
  styleUrls: ['./like.page.scss'],
})
export class LikePage implements OnInit {

  busy:boolean=true;
  like=[];
  likeList=[];
  searchedItem=[];
  id:string;

  @ViewChild('search',{static:false}) search:IonSearchbar;
  
  constructor(private route:ActivatedRoute,private location:Location,private afs:AngularFirestore,private userService:UserService,private router:Router) {
    this.id=this.route.snapshot.paramMap.get('id');
    this.afs.doc(`posts/${this.id}`).valueChanges().subscribe(data=>{
      this.likeList=data['likes'];
      this.like=[];
      this.likeList.forEach(res=>{
        this.afs.doc(`users/${res}`).valueChanges().subscribe(r=>{
          this.like.push({
            uid:r['uid'],
            profilePic:r['profilePic'],
            name:r['username'],
            bio:r['bio']
          })
        })
      })
      this.like.sort((a,b)=>{
        const x:string=a.name.toLowerCase();
        const y:string=b.name.toLowerCase();
        if(x<y){
          return -1;
        }
        if(x>y){
          return 1;
        }
      })
      this.searchedItem=this.like;
    })
   }

  ngOnInit() {
  }

  searchUsers(event){
    const val=event.target.value;
    this.searchedItem=this.like;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goBack(){
    this.location.back();
  }

  goTo(uid:string){
    if(uid==this.userService.getUID()){
      this.router.navigate(['/tabs/profile']);
    }
    else{
      this.router.navigate(['/tabs/people/'+uid]);
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

}
