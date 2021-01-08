import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {

  kelvin:number;
  weatherInfo;
  place:string='';
  constructor(private location:Location,private userService:UserService,private alertController:AlertController) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

  searchWeather(){
    this.userService.getWeather(this.place).subscribe(data=>{
      this.weatherInfo=data;
      this.kelvin=Math.round(this.weatherInfo.main.temp-273.15);
    },
    error=>{
      this.showAlert();
    })
  }

  async showAlert(){
    const alert=await this.alertController.create({
      header:'Error',
      message:'Please enter valid place',
      buttons:["Ok"]
    })
    await alert.present();
  }

}
