import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as $ from "jquery";
import { HttpClient } from '@angular/common/http';
import { FieldsService } from '../fields.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from '../excel.service';
//import { DataTablesModule } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularMaterialModule } from '../angular-material.module';




@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {


  constructor(private FieldsList: FieldsService, private router: Router, private excelService: ExcelService
    , private http: HttpClient, private modalService: BsModalService) {



  }

  displayedColumns: string[] = ['id', 'employee_name', 'employee_salary', 'employee_age', 'profile_image'];
  dataSource : MatTableDataSource<any>;
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  modalRef: BsModalRef;
  error = null;
  AssetSel = null;
  addAssetForm_tag = null;
  grid_tag = true;
  editAssetForm_tag = null;
  assignAssetForm_tag = null;
  selectedRowIndex: number = -1;

  title = '';

  closeResult: string;

  openModal(template: TemplateRef<any>) {

    if((this.selectedRowIndex < 1) || (this.selectedRowIndex === undefined)){
      alert("please select a asset !!!");
      return false;
    }

    this.grid_tag = true;
    this.editAssetForm_tag = null;
    this.assignAssetForm_tag = null;
    this.addAssetForm_tag = null;
    this.modalRef = this.modalService.show(template);

  }

  open_addAssetDiv() {
    this.grid_tag = null;
    this.editAssetForm_tag = null;
    this.assignAssetForm_tag = null;
    this.addAssetForm_tag = true;
  }

  open_editAssetDiv() {

    if((this.selectedRowIndex < 1) || (this.selectedRowIndex === undefined)){
      alert("please select a asset !!!");
      return false;
    }

    this.grid_tag = null;
    this.editAssetForm_tag = true;
    this.assignAssetForm_tag = null;
    this.addAssetForm_tag = null;
  }

  open_assignAssetDiv() {

    

    if((this.selectedRowIndex < 1) || (this.selectedRowIndex === undefined)){
      alert("please select a asset !!!");
      return false;
    }

    this.grid_tag = null;
    this.editAssetForm_tag = null;
    this.assignAssetForm_tag = true;
    this.addAssetForm_tag = null;
  }

  ngOnInit(): void {
    this.isLoggedIn();
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
  }

  applyFilter(event: Event) {
    console.log("event");
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  rowClicked(rowval) {
    this.selectedRowIndex = rowval.id;
    console.log("rorval--->"+JSON.stringify(rowval));
  }
  eleClicked(eleval) {
    //console.log("element val--->"+JSON.stringify(eleval));
  }

  isLoggedIn(): boolean {
    const userDetails = JSON.parse(localStorage.getItem('admiinDetails'));
    if (userDetails) {
      this.GetGrid();
      return true;
    } else {
      this.router.navigateByUrl('/login');
      //return false;
    }
  }

  GetGrid(): any {

    console.log("ngOnInit");
    this.FieldsList.getEmps().subscribe((result) => {
      //console.log("result--->" + JSON.stringify(result));
      this.dataSource = new MatTableDataSource(result.data);

      this.grid_tag = true;
      // this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      
      
      //   setTimeout(() => this.dataSource.paginator = this.paginator);
      // setTimeout(() => this.dataSource.sort = this.sort);
    });

    //let result = this.FieldsList.getEmps();
    //console.log("result--->" + JSON.stringify(result));
    //this.dataSource = new MatTableDataSource(result);
    
    

  }




  AddAsset(form: NgForm) {

  }

  EditAsset(form: NgForm) {

  }

  RemoveAsset(form: NgForm) {

  }

  AssignAsset(form: NgForm) {

  }


  logout() {
    localStorage.removeItem('admiinDetails');
    this.router.navigateByUrl('/login');
  }
  reload_home() {
    //alert("here");
    this.selectedRowIndex = -1;
    this.grid_tag = true;
    this.addAssetForm_tag = null;
    this.editAssetForm_tag = null;
    this.assignAssetForm_tag = null;
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
    //this.router.navigateByUrl('/home-page');
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
    this.reload_home();
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

  AMATCompliant = [{
    desc: 'Yes',
  },
  {
    desc: 'No',
  }
  ];

  GIS_GDC_values = [{
    name: 'GIS',
  },
  {
    name: 'GDC',
  }
  ];

  employeeList = [{
    id: 1,
    name: "Shamant Gudigenavar"
  },
  {
    id: 2,
    name: "Rohit t"
  },
  {
    id: 3,
    name: "Mahesh P"
  },
  {
    id: 4,
    name: "Sachin P"
  },
  {
    id: 5,
    name: "Shridhar K"
  }
  ]


}