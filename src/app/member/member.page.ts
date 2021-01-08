import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonSelect } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.scss'],
})
export class MemberPage implements OnInit {

  check:boolean=true;
  selectedcolor:string='primary';
  colors=['primary','secondary','tertiary','success','danger','warning','medium'];
  t1:string;
  t2:string;
  selectedUid:string;
  selectedName:string;
  currentuid:string;
  chats=[];
  name:string;
  profilepic:string;
  textMsg:string="";
  groupName:string;
  groupList=[];
  id:string;

  @ViewChild('userList') selectRef: IonSelect;
  
  @ViewChild('userlist') selectref: IonSelect;

  @ViewChild(IonContent,{read:IonContent,static:false}) content: IonContent;
  
  constructor(private location:Location,
    private route:ActivatedRoute,
    private userService:UserService,
    private afs:AngularFirestore,
    private router:Router) { 
    this.id=this.route.snapshot.paramMap.get('id');
    this.currentuid=this.userService.getUID();
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.groupList=data['group'];
      this.name=data['username'];
      this.groupList.forEach(res=>{
        if(res==this.id)
        {
          this.afs.doc(`group/${res}`).collection(res).valueChanges().subscribe(data=>{
            this.profilepic=data[data.length-1]?.profilePic;
            this.groupName=data[data.length-1]?.gname;
          })
        }
      })
    })
    this.afs.doc(`group/${this.id}`).collection(this.id).valueChanges().subscribe(data=>{
      this.chats=data;
      this.chats.sort((a,b)=>{
        return a.time-b.time;
      })
    },error=>{
      console.log(error);
    })
    this.afs.doc(`${this.id}/${this.id}`).valueChanges().subscribe(data=>{
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

  send(){
    this.afs.doc(`group/${this.id}`).collection(this.id).add({
      time:Date.now(),
      uid:this.userService.getUID(),
      msg:this.textMsg,
      name:this.name,
      visible:true,
      gname:this.groupName,
      profilePic:this.profilepic
    }).then(()=>{
      this.textMsg="";
    })
    
    setTimeout(() => {
      this.content?.scrollToBottom(100);
    }, 100)
  }

  changeTheme(){
    setTimeout(()=>{
      this.selectref.open();
    }, 2);
  }

  setTheme(event){
    const theme=event.detail.value;
    this.afs.doc(`${this.id}/${this.id}`).update({
      color:theme
    })
    setTimeout(() => {
      this.content?.scrollToBottom(100);
    }, 100)
  }

  goTo(uid:string,name:string){
    this.selectedUid=uid;
    this.t1='v'+uid;
    this.t2='m'+uid;
    this.selectedName=name;
    setTimeout(()=>{
      this.selectRef.open();
    }, 2);
  }

  setUser(event){
    const g=event.detail.value;
    if(g[0]=='v'){
      this.goToProfile();
    }
    else if(g[0]=='m'){
      this.goToMessage();
    }
  }

  goToProfile(){
    this.router.navigate(['/tabs/people/'+this.selectedUid]);
  }

  goToMessage(){
    this.router.navigate(['/chat/'+this.selectedUid]);
  }

  goToInfo(){
    this.router.navigate(['/group-info/'+this.id]);
  }

  goBack(){
    this.location.back();
  }

}
