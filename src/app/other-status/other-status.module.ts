import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherStatusPageRoutingModule } from './other-status-routing.module';

import { OtherStatusPage } from './other-status.page';
import { ShareModule } from '../share.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherStatusPageRoutingModule,
    ShareModule
  ],
  declarations: [OtherStatusPage]
})
export class OtherStatusPageModule {}
