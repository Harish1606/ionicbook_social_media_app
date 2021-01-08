import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  sub;
  userData;
  mainuser:AngularFirestoreDocument;
  busy:boolean=false;
  password:string="";
  newpassword:string="";
  bio:string="";
  username:string="";

  @ViewChild('fileBtn') fileBtn:{
    nativeElement:HTMLInputElement
  }
  constructor(private http:HttpClient,
    private afs:AngularFirestore,
    private user:UserService,
    private alertController:AlertController,
    private toastController:ToastController,
    private router:Router) {

    this.mainuser=this.afs.doc(`users/${user.getUID()}`);
    this.sub=this.mainuser.valueChanges().subscribe(data=>{
      this.userData=data;
    })
   }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.sub.unsubscribe(); 
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
      this.mainuser.update({
        profilePic:uuid
      })
    })
  }

  async presentAlert(title:string,content:string){
    const alert=await this.alertController.create({
      header:title,
      message:content,
      buttons:['Ok']
    });

    await alert.present();
  }

  async showToast(message:string){
    const toast=await this.toastController.create({
      message:message,
      duration:2000,
      position:'top',
      color:'success',
      animated:true
    })
    toast.present();
  }

  async updateDetails(){
    this.busy=true;
    
    try{
      await this.user.reAuth(this.userData.email,this.password);
    }
    catch(error){
      this.busy=false;
      this.presentAlert("Error","Wrong password");
      return console.log("error");
    }

    if(this.newpassword.trim().length>0){
      await this.user.updatePassword(this.newpassword);
    }

    if(this.username!==this.user.getUsername() && this.username.trim().length>0){
      this.mainuser.update({
        username:this.username
      });
    }

    if(this.bio.trim().length>0){
      this.mainuser.update({
        bio:this.bio
      });
    }

    this.password="";
    this.newpassword="";
    this.bio="";
    this.username="";

    await this.showToast("Your profile was updated");
    this.busy=false;
    this.router.navigate(['/tabs/profile']);
  }

  goBack(){
    this.router.navigate(['/tabs/profile']);
  }
}
