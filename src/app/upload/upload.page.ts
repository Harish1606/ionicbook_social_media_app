import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

  d=new Date();
  scaleCrop:string='-/scale_crop/200x200';
  desc:string="";
  imageUrl:string;
  busy:boolean=false;
  effects=['','-/exposure/50/-/saturation/50/-/warmth/-30/','-/filter/carris/150','-/filter/misiara/150','-/filter/elonni/150']
  activeEffect:string=this.effects[0];

  @ViewChild('fileButton') fileButton

  constructor(private http:HttpClient,
    public afstore:AngularFirestore,
    public userService:UserService,
    private toastController:ToastController,
    private router:Router) { 
      this.d=new Date();
    }

  ngOnInit() {
  }

  fileChanged(event){
    this.busy=true;
    const files=event.target.files
    const data=new FormData();
    data.append('file',files[0]);
    data.append('UPLOADCARE_STORE','1');
    data.append('UPLOADCARE_PUB_KEY','55bf61ef6ea7e9adfec3')

    this.http.post('https://upload.uploadcare.com/base/',data).subscribe(res=>{
      this.imageUrl=res['file'];
      this.busy=false;
    },
    error=>{
      this.busy=false;
    })
  }

  uploadFile(){
    this.fileButton.nativeElement.click()
  }

  async createPost(){
    this.busy=true;
    const image=this.imageUrl; 
    const activeEffect=this.activeEffect;
    const desc=this.desc;
    this.afstore.doc(`users/${this.userService.getUID()}`).update({
      posts:firestore.FieldValue.arrayUnion(`${image}/${activeEffect}`)
    })
    
    this.afstore.doc(`posts/${image}`).set({
      desc,
      author:this.userService.getUsername(),
      likes:[],
      effect:activeEffect,
      uid:this.userService.getUID(),
      postid:image,
      date:Date.now()
    })
    this.busy=false;
    this.imageUrl="";
    this.desc="";

    const toast=await this.toastController.create({
      message:'Post uploaded successfully',
      duration:2000,
      position:'top',
      animated:true
    })
    toast.present();
    

    this.router.navigate(['/tabs/feed']);
  }

  setSelected(effect:string){
    this.activeEffect=effect;
  }
}
