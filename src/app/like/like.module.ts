import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LikePageRoutingModule } from './like-routing.module';

import { LikePage } from './like.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LikePageRoutingModule
  ],
  declarations: [LikePage]
})
export class LikePageModule {}
