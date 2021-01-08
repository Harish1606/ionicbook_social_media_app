import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdSearchPageRoutingModule } from './prod-search-routing.module';

import { ProdSearchPage } from './prod-search.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdSearchPageRoutingModule
  ],
  declarations: [ProdSearchPage]
})
export class ProdSearchPageModule {}
