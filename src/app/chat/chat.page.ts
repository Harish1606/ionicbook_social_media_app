import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { IonContent, IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  check:boolean=true;
  selectedcolor:string='primary';
  colors=['primary','secondary','tertiary','success','danger','warning','medium'];
  o_user;
  user;
  uid:string;
  o_uid:string;

  textMsg:string="";
  o_chats=[];
  chats=[];

  @ViewChild(IonContent,{read:IonContent,static:false}) content: IonContent;

  @ViewChild('userList') selectRef: IonSelect;

  constructor(private router:Router,
    private route:ActivatedRoute,
    private afs:AngularFirestore,
    private userService:UserService,
    private location:Location) { 
    this.o_uid=this.route.snapshot.paramMap.get('id');
    this.uid=this.userService.getUID();
    this.afs.doc(`users/${this.o_uid}`).valueChanges().subscribe(data=>{
      this.o_user=data;
    })
    //My chat collection
    this.afs.doc(`chats/${this.uid}`).collection(this.o_uid).get().subscribe(data=>{
      data.forEach(function(doc){
        doc.ref.update({
          visible:true
        })
      })
    })
    this.afs.doc(`chats/${this.uid}`).collection(this.o_uid).valueChanges().subscribe(data=>{
      this.chats=[];
      data.forEach(child=>{
        this.chats.push(child);
      })
      this.chats.sort(function(a,b){
        return a.time-b.time;
      })
    })
    //Other chat collection
    this.afs.doc(`chats/${this.o_uid}`).collection(this.uid).valueChanges().subscribe(data=>{
      this.o_chats=[];
      data.forEach(child=>{
        this.o_chats.push(child);
      });
      this.o_chats.sort(function(a,b){
        return a.time-b.time;
      })
    })

    this.afs.doc(`${this.uid}/${this.o_uid}`).valueChanges().subscribe(data=>{
      if(data!=undefined){
        this.check=false;
        this.selectedcolor=data['color'];
      }
    })
    
    setTimeout(() => {
      this.content?.scrollToBottom(100);
    }, 100)
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.content?.scrollToBottom(100);
    }, 100);
  }

  changeTheme(){
    setTimeout(()=>{
      this.selectRef.open();
    }, 2);
  }

  setTheme(event){
    const theme=event.detail.value;
    this.afs.doc(`${this.uid}/${this.o_uid}`).update({
      color:theme
    })  
  }

  send(){
    //My chat collection 
    this.afs.doc(`chats/${this.uid}`).collection(this.o_uid).add({
      time:Date.now(),
      uid:this.uid,
      msg:this.textMsg,
      name:this.userService.getUsername(),
      visible:true
    });

    //Other's chat collection
    this.afs.doc(`chats/${this.o_uid}`).collection(this.uid).add({
      time:Date.now(),
      uid:this.uid,
      msg:this.textMsg,
      name:this.userService.getUsername(),
      visible:false
    }).then(()=>{
      this.textMsg="";
    })

    this.afs.doc(`chats/${this.uid}`).collection(this.o_uid).valueChanges().subscribe(data=>{
      if(data.length==1){
        this.afs.doc(`${this.uid}/${this.o_uid}`).set({
          color:'primary'
        })
        this.afs.doc(`${this.o_uid}/${this.uid}`).set({
          color:'primary'
        })
      }
    })
    
    setTimeout(() => {
      this.content?.scrollToBottom(100);
    }, 100)
  }

  goToPost(id:string){
    this.router.navigate(['/tabs/post/'+id]);
  }

  goBack(){
    this.location.back();
  }

}
