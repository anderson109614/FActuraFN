import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../modelos/Cliente';
import { Producto } from '../../modelos/Productos';
import { ProductoSel } from '../../modelos/ProductoSel';
import { Invoices } from '../../modelos/Invoice';
import { InvoiceLineItems } from '../../modelos/InvoiceLineItems';
import { ProductosService } from '../../servicios/productos.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
declare var $: any;
@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  listaCliente: any = [];
  listaClienteAux: any = [];
  listaProductos: any = [];
  listaProductosAux: any = [];
  listaProductosSelecionados: any = [];
  SubTotal: number = 0;
  IVA: number = 0;
  Total: number = 0;
  clienteUso: Cliente = { Address: '', City: '', CustomerID: '', Name: '', State: '', ZipCode: '' };

  constructor(private proSEr: ProductosService) { }

  ngOnInit(): void {
    this.cragarClientes();
    this.cragarProductos();
  }
  cragarClientes() {
    /* let cliente1: Cliente = { Address: 'Huachi', City: 'Ambato', CustomerID: '1', Name: 'Fausto Navarete', State: '12', ZipCode: 'za-445' };
    let cliente2: Cliente = { Address: 'Huachi', City: 'Ambato', CustomerID: '1', Name: 'Diego Almache', State: '12', ZipCode: 'za-445' };
    this.listaCliente.push(cliente1);
    this.listaCliente.push(cliente2);
    this.listaClienteAux = this.listaCliente;
    */
    this.proSEr.getClientes().subscribe(res => {
      console.log('customer', res);
      this.listaCliente = res;
      this.listaClienteAux = res;
    },
      err => {

      });

  }
  cragarProductos() {
    /*
    let p1: Producto = { Description: 'Pan', OnHandQuantit: '3', ProductCode: '1', UnitPrice: '5', };
    let p2: Producto = { Description: 'Queso', OnHandQuantit: '5', ProductCode: '2', UnitPrice: '7', };
    this.listaProductos.push(p1);
    this.listaProductos.push(p2);
    this.listaProductosAux = this.listaProductos;
    */
    this.proSEr.getProductos().subscribe(res => {
      this.listaCliente = res;
      this.listaClienteAux = res;
    },
      err => {
 
      });
      
  }
  checkClientes($event: KeyboardEvent) {
    this.listaCliente = this.listaClienteAux;
    let value = (<HTMLInputElement>document.getElementById('inputBusquedaClientes')).value;
    console.log(value);
    /*
        let value = (<HTMLInputElement>event.target).value;
          */
    if (value != "") {
      const result = this.listaCliente.filter((estudianteB: Cliente) => estudianteB.Name.search(value) >= 0
        
        || estudianteB.Address.toUpperCase().search(value.toUpperCase()) >= 0
        || estudianteB.City.toUpperCase().search(value.toUpperCase()) >= 0
        || estudianteB.State.toUpperCase().search(value.toUpperCase()) >= 0);
      this.listaCliente = result;
    } else {
      this.listaCliente = this.listaClienteAux; //carga estudiantes en la tabla
    }


  }
  checkProductos($event: KeyboardEvent) {
    this.listaProductos = this.listaProductos;
    let value = (<HTMLInputElement>document.getElementById('inputBusquedaProductos')).value;
    console.log(value);
    /*
        let value = (<HTMLInputElement>event.target).value;
          */
    if (value != "") {
      const result = this.listaProductos.filter((estudianteB: Producto) => estudianteB.Description.search(value) >= 0
        || estudianteB.OnHandQuantit.search(value.toUpperCase()) >= 0
        || estudianteB.ProductCode.search(value.toUpperCase()) >= 0
        || estudianteB.UnitPrice.search(value.toUpperCase()) >= 0
      );
      this.listaProductos = result;
    } else {
      this.listaProductos = this.listaProductosAux; //carga estudiantes en la tabla
    }

  }
  selecClientes(cli: Cliente) {
    this.clienteUso = cli;
  }
  selecProducto(Pro: Producto) {
    let ca = (<HTMLInputElement>document.getElementById('inputCantidadProductos')).value;
    if (ca.length > 0) {
      var añadido: Boolean = false;
      let cantidad = Number.parseInt(ca);
      if (cantidad <= Number.parseInt(Pro.OnHandQuantit)) {
        for (let index = 0; index < this.listaProductosSelecionados.length; index++) {
          if (this.listaProductosSelecionados[index].producto.ProductCode == Pro.ProductCode) {
            this.listaProductosSelecionados[index].cantida += cantidad;
            this.listaProductosSelecionados[index].subtota = this.listaProductosSelecionados[index].cantida * Number.parseFloat(Pro.UnitPrice);
            añadido = true;
            this.disminuirCantidaRpoductos(Pro, cantidad);
          }

        }

        if (!añadido) {
          let subtota = Number.parseFloat(Pro.UnitPrice) * cantidad;
          let ps: ProductoSel = { producto: Pro, cantida: cantidad, subtota: subtota }
          this.listaProductosSelecionados.push(ps);
          this.disminuirCantidaRpoductos(Pro, cantidad);

        }

        $('#ModaProductos').modal('hide');
        this.calcularTotales();
      }

    }


  }
  disminuirCantidaRpoductos(Pro: Producto, can: number) {
    for (let index = 0; index < this.listaProductos.length; index++) {
      if (this.listaProductos[index].ProductCode == Pro.ProductCode) {
        this.listaProductos[index].OnHandQuantit -= can;
      }

    }
  }
  AumentarCantidaRpoductos(Pro: ProductoSel) {
    for (let index = 0; index < this.listaProductos.length; index++) {
      if (this.listaProductos[index].ProductCode == Pro.producto.ProductCode) {
        this.listaProductos[index].OnHandQuantit += Pro.cantida;
      }

    }
  }
  calcularTotales() {
    let sub = 0;
    for (let index = 0; index < this.listaProductosSelecionados.length; index++) {
      sub += this.listaProductosSelecionados[index].subtota;

    }
    this.SubTotal = sub;
    this.IVA = this.SubTotal * 0.12;
    this.Total = this.IVA + this.SubTotal;
    this.listaProductosAux = this.listaProductos;
  }
  eliminarProSel(Producto: ProductoSel) {
    var i = this.listaProductosSelecionados.indexOf(Producto);
    this.AumentarCantidaRpoductos(Producto);
    this.listaProductosSelecionados.splice(i, 1);

    this.calcularTotales();
  }
  Guardar() {
    let inv: Invoices = {
      CustomerID: this.clienteUso.CustomerID,
      InvoiceDate: '',
      InvoiceTotal: this.Total.toString(),
      ProductTotal: this.SubTotal.toString(),
      SalesTax: this.IVA.toString(),
      Shipping: ''
    }


    if (this.validar(inv)) {
      this.proSEr.GuardarCabecera(inv).subscribe(res => {
        if (res != -1) {
          this.guardarDetalles(res);
        } else {
          alert('Error al guardar la Factura')
        }

      },
        err => {
          console.log(err);
        });



    }

  }
  guardarDetalles(idInvoice: number) {
    var items: any = [];
    for (let index = 0; index < this.listaProductosSelecionados.length; index++) {
      console.log(this.listaProductosSelecionados[index]);
      let invIt: InvoiceLineItems = {
        InvoiceID: idInvoice.toString(),
        ProductCode: this.listaProductosSelecionados[index].producto.ProductCode,
        Quantity: this.listaProductosSelecionados[index].cantida,
        UnitPrice: this.listaProductosSelecionados[index].producto.UnitPrice,
        ItemTotal: this.listaProductosSelecionados[index].subtota
      }
      console.log(invIt);
      items.push(invIt);
      console.log(items);

    }
    this.proSEr.GuardarDetalles(items).subscribe(res => {
      console.log('items', res);
      if(res){
          alert('Guardado Exitoso');
          this.limpiar();
      }else{
        alert('Error al guardar')
      }

    },
      err => {
        console.log(err);
      });
  }
  limpiar(){
    this.listaProductosSelecionados = [];
    this. SubTotal = 0;
    this.IVA = 0;
    this.Total = 0;
    this.clienteUso = { Address: '', City: '', CustomerID: '', Name: '', State: '', ZipCode: '' };
  }
  validar(inv: Invoices) {
    if (inv.CustomerID.length == 0) {
      alert('Seleccione un Cliente');
      return false;
    }
    if (this.Total == 0) {
      alert('Seleccione mas de un Producto');
      return false;
    }
    return true;
  }

}
