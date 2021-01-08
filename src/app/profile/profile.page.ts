import { Component, OnInit } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  sub;
  userPosts;

  constructor(private afstore:AngularFirestore,
    public userService:UserService,
    public router:Router,
    public menuController:MenuController,
    private alertController:AlertController) { 
    const post=afstore.doc(`users/${userService.getUID()}`)
    this.sub=post.valueChanges().subscribe(data=>{
      this.userPosts=data
    },
    error=>{
      console.log(error);
    })
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  goTo(postId:string){
    this.router.navigate(['/tabs/post/'+postId.split('/')[0]])
  }

  goToDiscover(){
    this.router.navigate(['/tabs/discover']);
  }

  goToSaved(){
    this.router.navigate(['/tabs/saved']);
  }

  goToAbout(){
    this.router.navigate(['/tabs/about']);
  }

  goToFeedback(){
    this.router.navigate(['/tabs/feedback']);
  }

  goToWeather(){
    this.router.navigate(['/tabs/weather']);
  }

  goToFollowers(){
    this.router.navigate(['/tabs/followers']);
  }

  goToFollowing(){
    this.router.navigate(['/tabs/following']);
  }

  logout(){
    this.confirmLogout();
  }

  async confirmLogout(){
    const alert=await this.alertController.create({
      header:'Logout',
      message:'Are you sure you want to logout?',
      buttons:[
        {
          text:'No',
          role:'cancel'
        },
        {
          text:'Yes',
          role:'Ok',
          handler:()=>{
            this.userService.signOut().then(()=>{
              this.router.navigateByUrl('/login',{replaceUrl:true});
            });
          }
        }
      ]
    })
    await alert.present();
  }

  async showAlert(){
    const alert=await this.alertController.create({
      header:'Whatsapp number',
      message:'9514109259',
      buttons:["Ok"]
    })
    await alert.present();
  }

  toggleTheme(event){
    if(event.detail.checked){
      document.body.setAttribute('color-theme','dark');
    }
    else{
      document.body.setAttribute('color-theme','light');
    }
  }
}
