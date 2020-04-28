import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as $ from "jquery";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { FieldsService } from '../fields.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelService } from '../excel.service';
//import { DataTablesModule } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AngularMaterialModule } from '../angular-material.module';
import swal from 'sweetalert';
import * as XLSX from 'xlsx';
import { BnNgIdleService } from 'bn-ng-idle';



@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.css']
})
export class IndexPageComponent implements OnInit {


  constructor(private FieldsList: FieldsService, private router: Router, private excelService: ExcelService
    , private http: HttpClient, private modalService: BsModalService, private bnIdle: BnNgIdleService) {



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
  exportEmpAssetData = [];
  employeeList = [];
  SearilaNUm_selected = "";
  current_assiged_emp = null;
  customer_dept = "";
  type_sel = "";
  OEM = "";
  model = "";
  procure_date = "";
  warranty_start_date = "";
  warranty_end_date = "";
  amc_startdate = "";
  amc_endate = "";
  os_image = "";
  is_customer_compliant = "";
  dataString = null;
  import_error = null;
  import_errorMsg = "";

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

  openAddEmployee(template: TemplateRef<any>) {

    this.import_error = null;
    this.import_errorMsg = "";
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
    //this.isLoggedIn();
    this.setSessionTimeout();
    this.GetGrid();
    this.GetEmployeeList();
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
    //console.log("rorval--->" + JSON.stringify(rowval));
  }
  eleClicked(eleval) {
    //console.log("element val--->"+JSON.stringify(eleval));
  }

  onFileChange(ev) {

    this.import_error = null;
    this.import_errorMsg = "";
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();


    const file = ev.target.files[0];
    let fileObj = ev.target.files[0];
    let fileName = fileObj.name;
    //check file is valid
    if (!this.validateFile(fileName)) {
      this.import_error = true;
      //console.log('Selected file format is not supported');
      this.import_errorMsg = "Please select .xlsx file format."
      return false;
    }

    this.import_error = null;
    this.import_errorMsg = "";


    $(".custom-file-label").addClass("selected").html(fileName);
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      //this.dataString = JSON.stringify(jsonData);
      this.dataString = jsonData;
      console.log("xlfile--->" + JSON.stringify(this.dataString));
      //document.getElementById('output').innerHTML = dataString.slice(0, 300).concat("...");
      //this.setDownload(dataString);
    }
    reader.readAsBinaryString(file);
  }

  // isLoggedIn(): boolean {
  //  // const userDetails = JSON.parse(localStorage.getItem('token'));
  //  const userDetails = localStorage.getItem('token');
  //   if (userDetails) {
  //     this.GetGrid();
  //     this.GetEmployeeList();
  //     return true;
  //   } else {
  //     this.router.navigateByUrl('/login');
  //     //return false;
  //   }
  // }

  GetGrid(): any {

    //console.log("ngOnInit");
    this.FieldsList.getAllAsset().subscribe((result) => {
      //console.log("result--->" + JSON.stringify(result));
      this.dataSource = new MatTableDataSource(result);
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

  setSessionTimeout(): any {
    this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        //console.log('session expired');
        this.removeLocalStorage();
      }
    });
  }

  removeLocalStorage(): any {
    localStorage.removeItem('token');
    //console.log('token removed');
    this.bnIdle.stopTimer();
    swal("You have been inactive for 15minutes(s).You will be logged off automatically")
      .then((value) => {
        //swal(`The returned value is: ${value}`);
        this.router.navigateByUrl('/login');
      });
  }

  GetEmployeeList(): any {

    //console.log("GetEmployeeList");
    this.FieldsList.GetEmployeeList().subscribe((result) => {
      this.employeeList = result;
    }, err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }
        if (err.status === 500) {
          this.router.navigateByUrl('/login');
        }
      }
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

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'xlsx') {
      return true;
    }
    else {
      return false;
    }
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

  addEmpFormFunc(adEmpform: NgForm) {

    this.FieldsList.AddEmployee(this.dataString).subscribe((result) => {
      //console.log("assign success");
      this.GetGrid();
      this.reload_home();
      this.modalRef.hide();
      swal("Success", "Employee details successfully imported!!!", "success");
    }, err => {
      //console.log(err);
      this.GetGrid();
      this.reload_home();
      this.modalRef.hide();
      swal("Error", err.error.message, "error");

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
    localStorage.removeItem('token');
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

    this.FieldsList.exportAssetList().subscribe((result) => {
      //console.log("assign success");
      this.exportData = result;
      this.excelService.exportAsExcelFile(this.exportData, 'Asset-Details');
      this.GetGrid();
      this.reload_home();
      swal("Success", "Asset details exported !!!", "success");
    }, err => {
      swal("Error", "Error while exporting asset details!!!", "error");
      //console.log(err);
    });
  }

  exportEmpAsset(): void {

    this.FieldsList.exportEmpAssetList().subscribe((result) => {
      //console.log("assign success");
      this.exportEmpAssetData = result;
      this.excelService.exportAsExcelFile(this.exportEmpAssetData, 'EmployeeAsset-Details');
      this.GetGrid();
      this.reload_home();
      swal("Success", "Employee-Asset details exported !!!", "success");
    }, err => {
      swal("Error", "Error while exporting asset details!!!", "error");
      //console.log(err);
    });
  }

  exportSampleFile(): void {
    this.excelService.exportAsExcelFile(this.SampleJson, 'EmployeeDetails');
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
    id: 'Y'
  },
  {
    desc: 'No',
    id: 'N'
  }
  ];

  GIS_GDC_values = [{
    name: 'GIS',
  },
  {
    name: 'GDC',
  }
  ];

  SampleJson = [
    {
      "firstname": "abc",
      "lastname": "last abc",
      "emailId": "abc@gmail.com",
      "contactNumber": 7411110023,
      "AdminId": "SG001122",
      "password": "abc@123",
      "LoginAccess": 1,
      "AdminAccess": 1
    },
    {
      "firstname": "xyz",
      "lastname": "last xyz",
      "emailId": "xyz@gmail.com",
      "contactNumber": 99002332232,
      "AdminId": "SG001123",
      "password": "xyz@123",
      "LoginAccess": 1,
      "AdminAccess": 0
    }
  ];




}