import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonSelect, LoadingController, ToastController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  sortTechniques=['Product name ascending','Product name descending','Price low to high','Price high to low'];
  filterTechniques=['Default','Shirt','Pant','Top','Shoes','Hoodie','Watch'];
  cart=[];
  currentPage=1;
  products=[];
  temp=[];
  sliderImages:string[]=['/assets/slide1','/assets/slide2','/assets/slide3','/assets/slide4','/assets/slide5']
  sliderOptions:{}={
    autoplay:{
      delay:2000
    },
    loop:true
  }

  @ViewChild('userList') selectRef: IonSelect;

  @ViewChild('userlist') selectref: IonSelect;
  
  constructor(private router:Router,
              private afs:AngularFirestore,
              private loadingController:LoadingController,
              private toastController:ToastController,
              private userService:UserService) { }

  async ngOnInit() {
    const loader=await this.loadingController.create({
      message:'Getting products...',
      spinner:'crescent',
      animated:true
    });
    await loader.present();

    this.afs.collection('products').valueChanges().subscribe(data=>{
      this.products=data.slice(0,10);
      this.temp=this.products;
      loader.dismiss();
    },
    error=>{
      loader.dismiss();
    })
    
    this.afs.doc(`users/${this.userService.getUID()}`).valueChanges().subscribe(data=>{
      this.cart=data['cart'];
    })
  }

  async loadMoreData(event:any){
    const toast=await this.toastController.create({
      message:'No more products',
      animated:true,
      duration:2000
    });

    if(event==null){
      this.currentPage=1;
    }
    else{
      this.currentPage++;
      this.afs.collection('products').valueChanges().subscribe(data=>{
        this.products=this.products.concat(data.slice((this.currentPage-1)*10,this.currentPage*10));
        this.temp=this.products;
        if(event!=null){
          event.target.complete();
        }

        if(data.slice((this.currentPage-1)*10,this.currentPage*10).length==0){
          toast.present();
          event.target.disabled=true;
        }
      },
      error=>{
        console.log(error);
      })
    }
  }

  sortfunc(){
    setTimeout(()=>{
      this.selectRef.open();
    }, 2);
  }

  setSort(event){
    const sort=event.detail.value;
    if(sort==this.sortTechniques[0]){
      this.products.sort((a,b)=>{
        const x:string=a.name.toLowerCase();
        const y:string=b.name.toLowerCase();
        if(x<y){
          return -1;
        }
        if(x>y){
          return 1;
        }
      })
    }
    else if(sort==this.sortTechniques[1]){
      this.products.sort((a,b)=>{
        const x:string=a.name.toLowerCase();
        const y:string=b.name.toLowerCase();
        if(x>y){
          return -1;
        }
        if(x<y){
          return 1;
        }
      })
    }
    else if(sort==this.sortTechniques[2]){
      this.products.sort((a,b)=>{
        return a.price-b.price;
      })
    }
    else if(sort==this.sortTechniques[3]){
      this.products.sort((a,b)=>{
        return b.price-a.price;
      })
    }
  }

  filterfunc(){
    setTimeout(()=>{
      this.selectref.open();
    }, 2);
  }

  setFilter(event){
    const filter=event.detail.value.toLowerCase();
    let l=[];
    if(filter=='shirt'){
      this.temp.forEach(res=>{
        if(res.category=='shirt'){
          l.push(res);
        }
      })
      this.products=l;
    }
    else if(filter=='pant'){
      this.temp.forEach(res=>{
        if(res.category=='pant'){
          l.push(res);
        }
      })
      this.products=l;
    }
    else if(filter=='top'){
      this.temp.forEach(res=>{
        if(res.category=='top'){
          l.push(res);
        }
      })
      this.products=l;
    }
    else if(filter=='shoes'){
      this.temp.forEach(res=>{
        if(res.category=='shoes'){
          l.push(res);
        }
      })
      this.products=l;
    }
    else if(filter=='hoodie'){
      this.temp.forEach(res=>{
        if(res.category=='hoodie'){
          l.push(res);
        }
      })
      this.products=l;
    }
    else if(filter=='watch'){
      this.temp.forEach(res=>{
        if(res.category=='watch'){
          l.push(res);
        }
      })
      this.products=l;
    }
    else if(filter=='default'){
      this.temp.forEach(res=>{
        l.push(res);
      })
      this.products=l;
    }
  }

  goToCart(){
    this.router.navigate(['/tabs/cart']);
  }

  goToProduct(uid:string){
    this.router.navigate(['/tabs/prod-detail/'+uid]);
  }

  goToSearch(){
    this.router.navigate(['/tabs/prod-search']);
  }

}
