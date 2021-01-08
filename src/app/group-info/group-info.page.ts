import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonSelect, ToastController } from '@ionic/angular';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.page.html',
  styleUrls: ['./group-info.page.scss'],
})
export class GroupInfoPage implements OnInit {

  selectedUsers=[];
  currentUid:string="";
  noparticipants=[];
  participants=[];
  selectedcolor:string="primary";
  GroupName:string="";
  profilePic:string="";
  id:string;
  gname:string="";
  busy:boolean=false;

  @ViewChild('userList') selectRef: IonSelect;

  @ViewChild('fileBtn') fileBtn:{
    nativeElement:HTMLInputElement
  }
  constructor(private location:Location,
    private afs:AngularFirestore,
    private userService:UserService,
    private http:HttpClient,
    private route:ActivatedRoute,
    private toastController:ToastController,
    private router:Router,
    private alertController:AlertController) { }

  ngOnInit() {
    this.busy=true;
    this.id=this.route.snapshot.paramMap.get('id');
    this.currentUid=this.userService.getUID();
    this.afs.doc(`group/${this.id}`).collection(this.id).valueChanges().subscribe(data=>{
      this.profilePic=data[data.length-1]?.profilePic;
      this.GroupName=data[data.length-1]?.gname;
      this.busy=false;
    })
    this.afs.doc(`${this.id}/${this.id}`).valueChanges().subscribe(data=>{
      if(data!=undefined){
        this.selectedcolor=data['color'];
      }
    })
    this.afs.collection('users').valueChanges().subscribe(data=>{
      this.participants=[];
      this.noparticipants=[];
      data.forEach(res=>{
        if(res['group'].includes(this.id)){
          this.participants.push({
            name:res['username'],
            uid:res['uid'],
            bio:res['bio'],
            profilePic:res['profilePic']
          })
        }
        else{
          this.noparticipants.push({
            name:res['username'],
            uid:res['uid']
          })
        }
      })
    })
    this.busy=false;
  }

  updateProfilePic(){
    this.fileBtn.nativeElement.click();
  }

  uploadPic(event){
    const files=event.target.files
    const data=new FormData();
    data.append('file',files[0]);
    data.append('UPLOADCARE_STORE','1');
    data.append('UPLOADCARE_PUB_KEY','55bf61ef6ea7e9adfec3')

    this.http.post('https://upload.uploadcare.com/base/',data).subscribe(res=>{
      const uuid=res['file'];
      this.afs.doc(`group/${this.id}`).collection(this.id).get().subscribe(data=>{
        data.forEach(function(doc){
          doc.ref.update({
            profilePic:uuid
          })
        })
      })
      this.showToast('Profile picture updated successfully');
    })
  }

  updateDetails(){
    const Gname=this.gname;
    this.afs.doc(`group/${this.id}`).collection(this.id).get().subscribe(data=>{
      data.forEach(function(doc){
        doc.ref.update({
          gname:Gname
        })
      })
    })
    this.showToast('Group name updated successfully');
    this.gname="";
  }

  async showToast(message:string){
    const toast=await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      animated:true
    })
    toast.present();
  }

  selectUsers(){
    if(this.noparticipants.length>0){
      setTimeout(()=>{
        this.selectRef.open();
      }, 2);
    }
    else{
      this.showToast("No users to add");
    }
  }

  add(event){
    this.selectedUsers=event.detail.value;
    if(this.selectedUsers.length>0)
    {
      this.selectedUsers.forEach(res=>{
        this.afs.doc(`users/${res}`).update({
          group:firestore.FieldValue.arrayUnion(this.id)
        })
      })
    }
  }

  exit(){
    this.presentAlertPrompt();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Exit group',
      message:'Are you sure you want to leave this group?',
      buttons:[
        {
          text:'No',
          role:'cancel'
        },
        {
          text:'Yes',
          role:'Ok',
          handler:()=>{
            this.afs.doc(`users/${this.currentUid}`).update({
              group:firestore.FieldValue.arrayRemove(this.id)
            })
            this.router.navigate(['/message/group']);
          }
        }
      ]
    });
    await alert.present();
  }

  goBack(){
    this.location.back();
  }

  goTo(uid:string){
    if(uid==this.currentUid){
      this.router.navigate(['/tabs/profile']);
    }
    else{
      this.router.navigate(['/tabs/people/'+uid]);
    }
  }

}
