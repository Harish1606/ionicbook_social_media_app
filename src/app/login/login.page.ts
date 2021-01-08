import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AlertController,ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginImage:string='bdbb98ce-b03f-443c-bae8-fff3fd23c661';
  busy:boolean=false;
  username:string="";
  email:string="";
  password:string="";

  constructor(public afAuth:AngularFireAuth,
    public userService:UserService,
    public router:Router,
    private alertController:AlertController,
    private afs:AngularFirestore,
    private toastController:ToastController) { }

  ngOnInit() {
  }

  async login(){
    this.busy=true;
    const {email,password}=this;
    try{
      const res=await this.afAuth.signInWithEmailAndPassword(email,password);
      if(res.user){
        this.afs.doc(`users/${res.user.uid}`).valueChanges().subscribe(data=>{
          this.username=data['username'];
        })
        this.userService.setUser({
          username:this.username,
          uid:res.user.uid
        })
        this.busy=false;
        this.showToast('Login successfully');
        this.router.navigate(['/tabs']);
      }
      this.busy=false;
    }
    catch(err){
      console.dir(err)
      this.busy=false;
      this.showAlert("Error",err.message);
    }
  }

  async showAlert(header:string,message:string){
    const alert=await this.alertController.create({
      header:header,
      message:message,
      buttons:["Ok"]
    })
    await alert.present();
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

  goToRegister(){
    this.router.navigate(['/register']);
  }

}
