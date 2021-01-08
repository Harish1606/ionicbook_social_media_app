import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

interface User{
  username:string,
  uid:string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  username:string="";
  private user:User;

  constructor(private afauth:AngularFireAuth,private afs:AngularFirestore,private http:HttpClient) { }

  setUser(user:User){
    this.user=user;
  }

  getUID():string{
    return this.user.uid;
  }

  getUsername():string{
    return this.user.username;
  }

  async isAuthenticated(){
    if(this.user){
      return true;
    }
    const user=await this.afauth.authState.pipe(first()).toPromise();
    if(user.uid==null){
      return false;
    }
    this.afs.doc(`users/${user.uid}`).valueChanges().subscribe(data=>{
      this.username=data['username'];
    },
    error=>{
      console.log(error);
      return false;
    })
    if(user){
      this.setUser({
        username:this.username,
        uid:user.uid
      })
      return true;
    }
    return false;
  }

  reAuth(email:string,password:string){
    return this.afauth.currentUser.then((event)=>{
      event.reauthenticateWithCredential(auth.EmailAuthProvider.credential(email,password));
    })
  }

  updatePassword(newpassword:string){
    return this.afauth.currentUser.then((event)=>{
      event.updatePassword(newpassword);
    })
  }

  signOut(){
    return this.afauth.signOut();
  }

  getWeather(city:string){
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=6a6ff0d9bbd4eb475023a4d5bc3f76b1`);
  }
}

