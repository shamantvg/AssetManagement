import { Component, OnInit, TemplateRef  } from '@angular/core';
import * as $ from "jquery";
import { HttpClient } from '@angular/common/http';
import { FieldsService } from '../fields.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from '../excel.service';
import { DataTablesModule } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


class Person {
  id: number;
  firstName: string;
  lastName: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {

  constructor(private FieldsList: FieldsService, private router: Router, private excelService: ExcelService
    , private DataTables: DataTablesModule, private http: HttpClient,private modalService: BsModalService) {

  }

  modalRef: BsModalRef;
  error = null;

  dtOptions: DataTables.Settings = {};
  persons: Person[];
  title = '';

  closeResult: string;

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  

  ngOnInit(): void {
    this.isLoggedIn();
    this.GetGrid();
  }

  isLoggedIn(): boolean {
    const userDetails = JSON.parse(localStorage.getItem('admiinDetails'));
    if (userDetails) {
      //this.getFieldsList();
      return true;
    } else {
      this.router.navigateByUrl('/login');
      //return false;
    }
  }

  GetGrid(): any {
    return true;
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'https://angular-datatables-demo-server.herokuapp.com/',
            dataTablesParameters, {}
          ).subscribe(resp => {
            that.persons = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'firstName' }, { data: 'lastName' }]
    };
  }

  AddAsset(form: NgForm){
    
  }


  logout() {
    localStorage.removeItem('admiinDetails');
    this.router.navigateByUrl('/login');
  }
  reload_home() {
    this.router.navigateByUrl('/home-page');
  }
  load_contact() {
    this.router.navigateByUrl('/contact');
  }
  load_faq() {
    this.router.navigateByUrl('/faq');
  }
  load_about() {
    this.router.navigateByUrl('/about');
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.exportData, 'Asset-Details');
  }

  exportData: any = [{
    sl_number: '1',
    Asset_Type: 'Desktop',
    Serial_number: 'TM001',
    Manufacter: 'HP',
    Assigned: 'Ravi'
  }, {
    sl_number: '2',
    Asset_Type: 'Laptop',
    Serial_number: 'TM002',
    Manufacter: 'DELL',
    Assigned: 'Rakesh'
  }, {
    sl_number: '3',
    Asset_Type: 'Desktop',
    Serial_number: 'TM003',
    Manufacter: 'HP',
    Assigned: 'Vinod'
  }, {
    sl_number: '4',
    Asset_Type: 'Laptop',
    Serial_number: 'TM004',
    Manufacter: 'DELL',
    Assigned: 'Rohit'
  }, {
    sl_number: '5',
    Asset_Type: 'Keyboard',
    Serial_number: 'TM005',
    Manufacter: 'Lenovo',
    Assigned: 'Manoj'
  }];

  assetType = [{
    Tname: 'Desktop',
   },
   {
    Tname: 'Laptop',
   },
   {
    Tname: 'Keyboard',
   },
   {
    Tname: 'Mouse',
   }
  ];

}


