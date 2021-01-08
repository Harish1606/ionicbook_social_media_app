import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-other-status',
  templateUrl: './other-status.page.html',
  styleUrls: ['./other-status.page.scss'],
})
export class OtherStatusPage implements OnInit {

  busy:boolean=false;
  o_user;
  id:string="";
  v:number=0;
  j:number=1000;
  status;
  constructor(private router:Router,private route:ActivatedRoute,private afs:AngularFirestore) { }

  ngOnInit() {
    this.busy=true;
    this.id=this.route.snapshot.paramMap.get('id');
    this.v=0;
    this.afs.doc(`users/${this.id}`).valueChanges().subscribe(data=>{
      this.o_user=data;
    })
    this.afs.doc(`status/${this.id}`).valueChanges().subscribe(data=>{
      this.status=data;
      this.busy=false;
    },
    error=>{
      this.busy=false;
    })
  }

  ionViewWillEnter() {
    this.v=0;
    if(this.v<1){
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
      this.delay();
      this.j+=1000;
    }
  }

  delay(){
    setTimeout(() => {
      this.v+=0.1;
      if(this.v>0.9){
        this.router.navigate(['/message/status']);
        this.v=0;
      }
    }, this.j);
  }

  goBack(){
    this.v=0;
    this.router.navigate(['/message/status']);
  }

}
