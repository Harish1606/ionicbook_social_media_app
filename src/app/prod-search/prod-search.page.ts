import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-prod-search',
  templateUrl: './prod-search.page.html',
  styleUrls: ['./prod-search.page.scss'],
})
export class ProdSearchPage implements OnInit {

  busy:boolean=true;
  products=[];
  searchedItem=[];

  @ViewChild('search',{static:false}) search:IonSearchbar;

  constructor(private router:Router,private afs:AngularFirestore) { }

  ngOnInit() {
    this.afs.collection('products').valueChanges().subscribe(data=>{
      this.products=data;
      this.searchedItem=data;
    })
  }

  ionViewDidEnter(){
    setTimeout(()=>{
      this.search.setFocus();
    });
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.busy=false;
    }, 2000);
  }

  searchProducts(event){
    const val=event.target.value;
    this.searchedItem=this.products;
    if(val && val.trim()!=''){
      this.searchedItem=this.searchedItem.filter((item:any)=>{
        return (item.category.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goTo(uid:string){
    this.router.navigate(['/tabs/prod-detail/'+uid]);
  }

  goBack(){
    this.router.navigate(['/tabs/product']);
  }

}
