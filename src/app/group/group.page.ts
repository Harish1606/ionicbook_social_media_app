import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, IonSearchbar, IonSelect } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {

  name:string;
  group=[];
  highlight:string="";
  username:string="";
  time:string="";
  busy:boolean=true;
  groups=[];
  groupName:string="";
  selectedUsers=[];
  groupList=[];
  searchedItem=[];
  gname:string="";
  profilePic:string="";

  @ViewChild('userList') selectRef: IonSelect;

  @ViewChild('search',{static:false}) search:IonSearchbar;

  constructor(private afs:AngularFirestore,private userService:UserService,private alertController:AlertController,private router:Router) { }

  ngOnInit() {
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.groupList=[];
      data.forEach(res=>{
        if(res['uid']!=this.userService.getUID()){
          this.groupList.push(res);
        }
      })
    })
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.groups=data['group'];
      this.name=data['username'];
      this.group=[];
      this.groups.forEach(res=>{
        this.afs.doc(`group/${res}`).collection(res).valueChanges().subscribe(r=>{
          let list=[];
          list=r;
          let f=0;
          list.sort((a,b)=>{
            return a.time-b.time;
          })
          this.highlight=list[list.length-1]?.msg;
          this.username=list[list.length-1]?.name;
          this.time=list[list.length-1]?.time; 
          this.gname=list[list.length-1]?.gname;
          this.profilePic=list[list.length-1]?.profilePic;
          const j=this.group.find(verify => verify.uid === res);
          if(j){
            j.highlight=this.highlight;
            j.time=this.time;
            j.username=this.username; 
            j.name=this.gname,
            j.profilePic=this.profilePic
            f=1;
          }
          if(f==0)
          {
            this.group.push({
              name:this.gname,
              uid:res,
              profilePic:this.profilePic,
              highlight:this.highlight,
              time:this.time,
              username:this.username
            })
          }
          this.highlight="";
          this.time="";
          this.group.sort(function(a,b){
            return b.time-a.time;
          })
          this.searchedItem=this.group;
        })
      })
    },
    error=>{
      console.log(error);
    })
  }

  searchUsers(event){
    const val=event.target.value;
    this.searchedItem=this.group;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 1000);
  }

  selectUsers(){
    setTimeout(()=>{
      this.selectRef.open();
    }, 2);
  }

  createGroup(event){
    this.selectedUsers=event.detail.value;
    if(this.selectedUsers.length>0)
    {
      this.presentAlertPrompt();
    }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Group name',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Enter name to create group'
        }
      ],
      buttons:[
        {
          text:'cancel',
          role:'cancel'
        },
        {
          text:'Ok',
          handler:(data)=>{
            this.groupName=data.name1;
            const id=this.afs.createId();
            if(this.groupName.trim().length>0)
            {
              this.selectedUsers.forEach(res=>{
                this.afs.doc(`users/${res}`).update({
                  group:firestore.FieldValue.arrayUnion(id)
                })
              })
              this.afs.doc(`users/${this.userService.getUID()}`).update({
                group:firestore.FieldValue.arrayUnion(id)
              })
              this.afs.doc(`group/${id}`).collection(id).add({
                time:Date.now(),
                uid:this.userService.getUID(),
                msg:' created group ',
                name:this.name,
                visible:false,
                gname:this.groupName,
                profilePic:'a21d5e34-b8c6-425a-8be3-47c76bfa9ac9'
              })
              this.afs.doc(`${id}/${id}`).set({
                color:'primary'
              })
            }
          }
        }
      ]
    });
    await alert.present();
  }

  goTo(uid:string){
    this.router.navigate(['/member/'+uid]);
  }
}
