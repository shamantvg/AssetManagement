import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  constructor(private http: HttpClient) { }

 // private options = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
  //regerateRoport(queryElement): Observable<any> {
  //return this.http.post('http://localhost:8080/lms/registerstudent', queryElement);


  //get all asset details api call
  getAllAsset(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/assets');
  }

  //get all asset details api call
  GetEmployeeList(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/employee');
  }

  //get unique employee details
  GetUniqEmployee(id): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/employeeasset/${id}`);
  }

  //assign asset to employee
  AssignReassignFunct(empDetails): Observable<any> {
    return this.http.post<any>('http://localhost:8080/employeeasset',empDetails);
  }

   //remove asset
   RemoveAssetFunc(id): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/assets/${id}`);
  }

  //assign asset to employee
  addAssetFunc(AssetDetails): Observable<any> {
    return this.http.post<any>('http://localhost:8080/assets',AssetDetails);
  }

  //modify asset to employee
  editAssetFunc(AssetDetails): Observable<any> {
    return this.http.put<any>('http://localhost:8080/assets',AssetDetails);
  }

  

  regerateRoport (queryElement): any {
    queryElement;
    return '{"Status":200,"Message":"Report has been mailed.","Query Element":"'+queryElement+'"}';
  }

  getFields(): any {
    //return this.http.get<any>(`http://localhost:8080/lms/searchbook?bid=${user_id}`);
    return '{"field1":"field1","field2":"fields2"}';
  }

  getEmps(): Observable<any> {
    return this.http.get<any>('http://dummy.restapiexample.com/api/v1/employees');
  }

   //export asset details api call
   exportAssetList(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/assetsexport');
  }

  //export employye-asset details api call
  exportEmpAssetList(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/empyolee/assetsexport');
  }

  //assign asset to employee
  EmployeeAuth(empDetails): Observable<any> {
    return this.http.post<any>('http://localhost:8080/employeeAuth',empDetails);
  }

   //assign asset to employee
   AddEmployee(empDetails): Observable<any> {
    return this.http.post<any>('http://localhost:8080/employee',empDetails);
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }

  //check session token
  CheckSessionToken(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/CheckSessionToken');
  }
}
