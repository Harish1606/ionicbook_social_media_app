import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path:'',
    component:TabsPage,
    children:[
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full'
      },
      {
        path: 'feed',
        loadChildren: () => import('../feed/feed.module').then( m => m.FeedPageModule)
      },
      {
        path: 'upload',
        loadChildren: () => import('../upload/upload.module').then( m => m.UploadPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'post/:id',
        loadChildren: () => import('../post/post.module').then( m => m.PostPageModule)
      },
      {
        path:'search',
        loadChildren: ()=>import('../search/search.module').then(m => m.SearchPageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('../edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
      },
      {
        path: 'people/:id',
        loadChildren: () => import('../people/people.module').then( m => m.PeoplePageModule)
      },
      {
        path: 'comment/:id',
        loadChildren: () => import('../comment/comment.module').then( m => m.CommentPageModule)
      },
      {
        path: 'notification',
        loadChildren: () => import('../notification/notification.module').then( m => m.NotificationPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then( m => m.AboutPageModule)
      },
      {
        path: 'saved',
        loadChildren: () => import('../saved/saved.module').then( m => m.SavedPageModule)
      },
      {
        path: 'feedback',
        loadChildren: () => import('../feedback/feedback.module').then( m => m.FeedbackPageModule)
      },
      {
        path: 'discover',
        loadChildren: () => import('../discover/discover.module').then( m => m.DiscoverPageModule)
      },
      {
        path: 'weather',
        loadChildren: () => import('../weather/weather.module').then( m => m.WeatherPageModule)
      },
      {
        path: 'like/:id',
        loadChildren: () => import('../like/like.module').then( m => m.LikePageModule)
      },
      {
        path: 'followers',
        loadChildren: () => import('../followers/followers.module').then( m => m.FollowersPageModule)
      },
      {
        path: 'following',
        loadChildren: () => import('../following/following.module').then( m => m.FollowingPageModule)
      },
      {
        path: 'product',
        loadChildren: () => import('../product/product.module').then( m => m.ProductPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'prod-detail/:id',
        loadChildren: () => import('../prod-detail/prod-detail.module').then( m => m.ProdDetailPageModule)
      },
      {
        path: 'prod-search',
        loadChildren: () => import('../prod-search/prod-search.module').then( m => m.ProdSearchPageModule)
      },
      {
        path: 'checkout',
        loadChildren: () => import('../checkout/checkout.module').then( m => m.CheckoutPageModule)
      },
      {
        path: 'thankyou',
        loadChildren: () => import('../thankyou/thankyou.module').then( m => m.ThankyouPageModule)
      },
      {
        path:'other-status/:id',
        loadChildren: () => import('../other-status/other-status.module').then(m => m.OtherStatusPageModule)
      },
      {
        path:'**',
        redirectTo:'feed'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
