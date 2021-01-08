import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LikePage } from './like.page';

const routes: Routes = [
  {
    path: '',
    component: LikePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LikePageRoutingModule {}
