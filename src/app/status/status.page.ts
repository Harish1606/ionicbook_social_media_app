import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { firestore } from 'firebase/app';
import { UserService } from '../user.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

  time:string="";
  profilePic:string="";
  otherStatus=[];

  @ViewChild('fileBtn') fileBtn:{
    nativeElement:HTMLInputElement
  }
  constructor(private router:Router,
    private afs:AngularFirestore,
    private http:HttpClient,
    private userService:UserService,
    private actionSheetController:ActionSheetController,
    private alertController:AlertController,
    private toastController:ToastController) { }

  ngOnInit() {
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.profilePic=data['status'];
    })
    this.afs.collection('status').valueChanges().subscribe(data=>{
      this.otherStatus=[];
      data.forEach(res=>{
        if(res['uid']==this.userService.getUID()){
          this.time=res['date']
        }
        else{
          this.afs.doc(`users/${res['uid']}`).valueChanges().subscribe(r=>{
            this.otherStatus.push({
              uid:res['uid'],
              name:r['username'],
              date:res['date'],
              postid:res['postid']
            })
            this.otherStatus.sort((a,b)=>{
              return b.date-a.date;
            })
          })
        }
        if(Date.now()-res['date']>86400000){
          this.afs.doc(`users/${res['uid']}`).update({
            status:''
          })
          this.afs.doc(`status/${res['uid']}`).delete();
        }
      })
    })
    
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
      this.afs.doc(`users/${this.userService.getUID()}`).update({
        status:uuid
      })
      this.afs.doc(`status/${this.userService.getUID()}`).set({
        uid:this.userService.getUID(),
        postid:uuid,
        date:Date.now(),
        view:[]
      })
      this.showToast('Status uploaded successfully');
    })
  }

  async showToast(message:string){
    const toast=await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      animated:true
    })
    await toast.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header:'Events',
      buttons: [
      {
        text: 'View status',
        icon: 'eye',
        handler: () => {
          this.goToMystatus();
        }
      },
      {
        text:'Delete status',
        icon:'trash',
        handler:()=>{
          this.presentAlertPrompt();
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Delete status',
      message:'Are you sure you want to delete your status?',
      buttons:[
        {
          text:'No',
          role:'cancel'
        },
        {
          text:'Yes',
          role:'Ok',
          handler:()=>{
            this.afs.doc(`users/${this.userService.getUID()}`).update({
              status:''
            })
            this.afs.doc(`status/${this.userService.getUID()}`).delete();
          }
        }
      ]
    });
    await alert.present();
  }

  goToMystatus(){
    this.router.navigate(['/mystatus']);
  }

  goToOtherStatus(id:string){
    let c:boolean=false;
    this.afs.doc(`status/${id}`).valueChanges().subscribe(data=>{
      if(!data['view'].includes(this.userService.getUID())){
        this.afs.doc(`status/${id}`).update({
          view:firestore.FieldValue.arrayUnion(this.userService.getUID())
        })
      }
    })
    this.router.navigate(['/tabs/other-status/'+id]);
  }

}
