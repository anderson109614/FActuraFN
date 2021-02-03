import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {con} from '../modelos/coneccion';
import {Invoices} from '../modelos/Invoice';
@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  ip = con.ipser;
  constructor(private http:HttpClient) { }
  getProductos(){
    return this.http.get(this.ip+'Productos');
  }
  getClientes(){
    return this.http.get(this.ip+'Customer');
  }
  GuardarCabecera(inv:Invoices){
    return this.http.post<number>(this.ip+'Invoices',inv);
  }
  GuardarDetalles(inv:any){
    return this.http.post<boolean>(this.ip+'InvoiceItems',inv);
  }
}
