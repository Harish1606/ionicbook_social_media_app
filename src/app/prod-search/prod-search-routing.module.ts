import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdSearchPage } from './prod-search.page';

const routes: Routes = [
  {
    path: '',
    component: ProdSearchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdSearchPageRoutingModule {}
