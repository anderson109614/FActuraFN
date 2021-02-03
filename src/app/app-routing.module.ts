import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FacturaComponent} from './componentes/factura/factura.component';
const routes: Routes = [{path:'',redirectTo: '/Factura' ,pathMatch: 'full' },
{ path: 'Factura', component:FacturaComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
