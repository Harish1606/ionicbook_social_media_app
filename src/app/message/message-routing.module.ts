import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagePage } from './message.page';

const routes: Routes = [
  {
    path: '',
    component: MessagePage,
    children:[
      {
        path:'',
        redirectTo:'chats',
        pathMatch:'full'
      },
      {
        path: 'chats',
        loadChildren: () => import('../chats/chats.module').then( m => m.ChatsPageModule)
      },
      {
        path: 'group',
        loadChildren: () => import('../group/group.module').then( m => m.GroupPageModule)
      },
      {
        path: 'status',
        loadChildren: () => import('../status/status.module').then( m => m.StatusPageModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessagePageRoutingModule {}
