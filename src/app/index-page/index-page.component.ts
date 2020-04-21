import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as $ from "jquery";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FieldsService } from '../fields.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from '../excel.service';
//import { DataTablesModule } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularMaterialModule } from '../angular-material.module';
import swal from 'sweetalert';



@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {


  constructor(private FieldsList: FieldsService, private router: Router, private excelService: ExcelService
    , private http: HttpClient, private modalService: BsModalService) {



  }


  displayedColumns: string[] = ['serial_number', 'type', 'OEM', 'model', 'procure_date', 'warranty_start_date', 'warranty_end_date', 'amc_startdate', 'amc_endate', 'os_image', 'is_customer_compliant', 'customer_dept', 'id'];
  dataSource: MatTableDataSource<any>;


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
  exportData = [];
  employeeList = [];
  SearilaNUm_selected = "";
  current_assiged_emp = null;
  customer_dept = "";
  type_sel = "";
  OEM = "";
  model = "";
  procure_date ="";
  warranty_start_date = "";
  warranty_end_date = "";
  amc_startdate = "";
  amc_endate = "";
  os_image = "";
  is_customer_compliant = "";

  title = '';

  closeResult: string;

  openModal(template: TemplateRef<any>) {

    if ((this.selectedRowIndex < 1) || (this.selectedRowIndex === undefined)) {
      swal("Information", "Please select a asset !!!", "info");
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

    if ((this.selectedRowIndex < 1) || (this.selectedRowIndex === undefined)) {
      swal("Information", "Please select a asset !!!", "info");
      return false;
    }

    this.grid_tag = null;
    this.editAssetForm_tag = true;
    this.assignAssetForm_tag = null;
    this.addAssetForm_tag = null;
  }

  open_assignAssetDiv() {



    if ((this.selectedRowIndex < 1) || (this.selectedRowIndex === undefined)) {
      swal("Information", "Please select a asset !!!", "info");
      return false;
    }

    this.GetUniqEmployee();
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
    this.SearilaNUm_selected = rowval.serial_number;
    this.customer_dept = rowval.customer_dept;
    this.type_sel = rowval.type;
    this.OEM = rowval.OEM;
    this.model = rowval.model;
    this.procure_date = rowval.procure_date;
    this.warranty_start_date = rowval.warranty_start_date;
    this.warranty_end_date = rowval.warranty_end_date;
    this.amc_startdate = rowval.amc_startdate;
    this.amc_endate = rowval.amc_endate;
    this.os_image = rowval.os_image;
    this.is_customer_compliant = rowval.is_customer_compliant;
    console.log("rorval--->" + JSON.stringify(rowval));
  }
  eleClicked(eleval) {
    //console.log("element val--->"+JSON.stringify(eleval));
  }

  isLoggedIn(): boolean {
    const userDetails = JSON.parse(localStorage.getItem('admiinDetails'));
    if (userDetails) {
      this.GetGrid();
      this.GetEmployeeList();
      return true;
    } else {
      this.router.navigateByUrl('/login');
      //return false;
    }
  }

  GetGrid(): any {

    //console.log("ngOnInit");
    this.FieldsList.getAllAsset().subscribe((result) => {
      //console.log("result--->" + JSON.stringify(result));
      this.dataSource = new MatTableDataSource(result);
      this.exportData = result;
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

  GetEmployeeList(): any {

    //console.log("GetEmployeeList");
    this.FieldsList.GetEmployeeList().subscribe((result) => {
      this.employeeList = result;
    });
  }

  GetUniqEmployee(): any {
    this.FieldsList.GetUniqEmployee(this.selectedRowIndex).subscribe((result) => {
      if (result[0].firstname) {
        this.current_assiged_emp = result[0].firstname + " " + result[0].lastname;
      } else {

        this.current_assiged_emp = "IT Dept";
      }

    });
  }




  AddAsset(Addform: NgForm) {
    //console.log(Addform.value);
    this.FieldsList.addAssetFunc(Addform.value).subscribe((result) => {
      //console.log("assign success");
      swal("Success", "New Asset Details added successfully!!!", "success");
      this.GetGrid();
      this.reload_home();
    }, err => {
      swal("Error", "Error while adding asset !!!", "error");
      //console.log(err);
    });
  }

  EditAsset(Editform: NgForm) {
    console.log(Editform.value);
    this.FieldsList.editAssetFunc(Editform.value).subscribe((result) => {
      //console.log("assign success");
      swal("Success", "Asset Details successfully modified!!!", "success");
      this.GetGrid();
      this.reload_home();
    }, err => {
      swal("Error", "Error while updating asset !!!", "error");
      //console.log(err);
    });
  }

  RemoveAsset(Removeform: NgForm) {
    //const params = new HttpParams().set('id', "'" + this.selectedRowIndex + "'");

    // console.log(Removeform.value);
    // return false;

    this.FieldsList.RemoveAssetFunc(this.selectedRowIndex).subscribe((result) => {
      //console.log("assign success");
      this.GetGrid();
      this.reload_home();
      this.modalRef.hide();
      swal("Success", "Asset deleted successfully!!!", "success");
    }, err => {
      swal("Error", "Please try later.!!!", "error");
      //console.log(err);
    });
  }

  AssignAsset(Assignform: NgForm) {
    //console.log(Assignform.value);
    this.FieldsList.AssignReassignFunct(Assignform.value).subscribe((result) => {
      //console.log("assign success");
      swal("Success", "Asset Assigned successfully!!!", "success");
      this.GetGrid();
      this.reload_home();
    }, err => {
      swal("Error", "Please try later.!!!", "error");
      //console.log(err);
    });
  }


  logout() {
    localStorage.removeItem('admiinDetails');
    this.router.navigateByUrl('/login');
  }
  reload_home() {
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
    id:'Y'
  },
  {
    desc: 'No',
    id:'N'
  }
  ];

  GIS_GDC_values = [{
    name: 'GIS',
  },
  {
    name: 'GDC',
  }
  ];




}