import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { ListPacksComponent } from './list-packs/list-packs.component';
import { TrackingComponent } from './tracking/tracking.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: '', component: ListPacksComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'tracking/:id', component: TrackingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
