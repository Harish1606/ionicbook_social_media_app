import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutPage } from './checkout.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage,
    children:[
      {
        path:'',
        redirectTo:'delivery',
        pathMatch:'full'
      },
      {
        path: 'delivery',
        loadChildren: () => import('../delivery/delivery.module').then( m => m.DeliveryPageModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('../payment/payment.module').then( m => m.PaymentPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutPageRoutingModule {}
