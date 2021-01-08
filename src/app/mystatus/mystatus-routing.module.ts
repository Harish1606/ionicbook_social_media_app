import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MystatusPage } from './mystatus.page';

const routes: Routes = [
  {
    path: '',
    component: MystatusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MystatusPageRoutingModule {}
