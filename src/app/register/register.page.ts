import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loginImage:string='bdbb98ce-b03f-443c-bae8-fff3fd23c661';
  busy:boolean=false;
  email:string="";
  username:string="";
  password:string="";
  cpassword:string="";

  constructor(private afAuth:AngularFireAuth,
    public alertController:AlertController,
    public router:Router,
    public userService:UserService,
    public afstore:AngularFirestore,
    private toastController:ToastController) { }

  ngOnInit() {
  }

  async register(){
    this.busy=true;
    const { email,username,password,cpassword } = this
    if(password!==cpassword){
      this.busy=false;
      this.showAlert("Error","Password does not match");
      return console.error("Passwords don't match");
    }
    if(username==""){
      this.busy=false;
      this.showAlert("Error","Username is required");
      return console.error("Username is required");
    }
    try{
      const res=await this.afAuth.createUserWithEmailAndPassword(email,password);
      this.afstore.doc(`users/${res.user.uid}`).set({
        email,
        username:username,
        profilePic:'bdbb98ce-b03f-443c-bae8-fff3fd23c661',
        bio:'',
        uid:res.user.uid,
        followers:[],
        following:[],
        saved:[],
        group:[],
        cart:[],
        cartName:'',
        cartEmail:'',
        cartAddress:'',
        cartNumber:'',
        status:'',
        posts:[]
      });

      this.userService.setUser({
        username,
        uid:res.user.uid
      })
      this.busy=false;
      this.showToast("Registered successfully");
      this.router.navigate(['/tabs']);
    }
    catch(error){
      console.dir(error);
      this.busy=false;
      this.showAlert("Error",error.message);
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

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
