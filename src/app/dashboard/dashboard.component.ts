import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { RestService } from '../services/rest-service.service';
import { Todo } from "../classes/todos"
import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { Table } from 'primeng/table';
// import * as FileSaver from 'file-saver';
// import jsPDF from 'jspdf'
// import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers:[MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {
  public currentUser:string = "";
  public currentUserTodosCount:number = 0;
  public userId:number = -1;
  public selectedTodos: number[] = [];
  public todosTemp:any[] = [];
  public todos:Todo[] = [];
  public numberOfDeletedTodos:string = "";
  public showTodoDialog:boolean = false;
  public todoDescription:string = "";
  public todoTitle:string = "";
  public blockedDocument: boolean = false;
  public editUserName:string = "";
  public editUserPassword:string = "";
  public userEditDialog:boolean = false;
  public currentUsers:User[] = [];
  public adminSelectedUserId:number = -1;
  public addUserDialog:boolean = false;
  public modifyTodoDialog:boolean = false;
  public currentTodoTitle:string = "";
  public currentTodoDescription:string = "";
  public currentTodoId:number = -1;
  public searchText:string = "";
  public filters: boolean = false;
  constructor(private router:Router, private restService:RestService, public global:GlobalService, private messageService:MessageService, private confirmationService:ConfirmationService) { }

  ngOnInit() {
   this.initialize()
  }

  initialize(){
    this.selectedTodos = []
    if(this.global.currentUser == "admin" || this.global.currentUser == "Admin"){
      this.currentUsers = this.global.globalUsers;
      this.global.isAdmin = true
      console.log(this.currentUsers)
    }else{
      this.blockDoc()
      this.restService.getTodos().subscribe({
        next: ((response) => {
          this.todosTemp = []
          this.todos = []
          this.todosTemp = JSON.parse(JSON.stringify(response))["todos"]
          this.currentUserTodosCount = this.global.currentUserTodosCount = this.todosTemp.length
          this.makeTodos()
          this.unblockDoc()
        }),
        error: ((error) => {
          this.unblockDoc()
          console.log(error)
        })
      })
    }
  }

  makeTodos(){
    for(let i=0; i<this.todosTemp.length; i++){
      let todo:Todo = { todoId: this.todosTemp[i][0], userId: this.todosTemp[i][1], todo: this.todosTemp[i][2], todoDescription: this.todosTemp[i][3], status: this.todosTemp[i][4] }
      this.todos[i] = todo
    }
    console.log("todos done")
    console.log(this.todos)
    if(this.todos.length == 0){
      this.messageService.add({ severity:'success', detail: `Todos are empty! Lets make some todos!`, life:2500});
    }else{
      this.messageService.add({ severity:'info', detail: `Got ${this.todos.length} todos!`, life:2500});
    }
  }

  selectAll(){
    this.selectedTodos = [];
    for(let i=0; i<this.todos.length; i++){
      this.selectedTodos.push(this.todos[i].todoId)
    }
  }

  deselectAll(){
    this.selectedTodos = []
  }

  deleteSelected(){
    this.blockDoc()
    this.restService.deleteTodos(this.selectedTodos).subscribe({
      next: ((response) => {
        let numberOfDeletedTodos = JSON.parse(JSON.stringify(response))["numberOfDeletedData"] 
        console.log(numberOfDeletedTodos + "has been deleted!")
        this.messageService.add({ severity:'success', detail: `${numberOfDeletedTodos} deleted!`, life:2500});
        this.initialize()
      }),
      error: ((error) => {
        this.unblockDoc()
        alert(error.error.message)
      })
    })
  }

  showAddTodo(){
    this.showTodoDialog = true;
  }

  createTodo(){
    if(this.todoTitle.length <= 0 || this.todoDescription.length <= 0){
      this.messageService.add({ severity:'info', detail: `Data Required!`, life:1500});
    }else{
      let payload = {  }
      if(this.global.isAdmin){
        payload = { "title" : this.todoTitle, "description" : this.todoDescription, "userId" : this.adminSelectedUserId, "status" : "pending" }
      }else{
        payload = { "title" : this.todoTitle, "description" : this.todoDescription, "userId" : this.global.userId }
      }
      this.blockDoc()
      this.restService.buildTodo(payload).subscribe({
        next: ((response) => {
          if(this.global.isAdmin){
            let result = JSON.parse(JSON.stringify(response))["message"]
            let t = JSON.parse(JSON.stringify(response))["createdTodo"]
            this.global.globalTodosCount = JSON.parse(JSON.stringify(response))["totalTodos"]
            let todo:Todo = { todoId: t[0][0], userId: t[0][1], todo: t[0][2], todoDescription : t[0][3], status: t[0][4] }
            this.updateTodo(todo)
            this.showTodoDialog=false
            this.unblockDoc()
            this.messageService.add({ severity:'success', detail: `${result}`, life:1500});
          }else{
            let result = JSON.parse(JSON.stringify(response))["message"]
            this.messageService.add({ severity:'success', detail: `${result}`, life:1500});
            this.initialize()
            this.showTodoDialog=false
          }
        }),
        error:((error) => {
          this.blockDoc()
          this.messageService.add({ severity:'success', detail: `${error.error.message}`, life:2500});
          this.showTodoDialog=false
        })
      })
    }
  }

  updateTodo(todo:Todo){
    for(let i = 0; i < this.currentUsers.length; i++){
      if(this.currentUsers[i].userId == todo.userId){
        this.currentUsers[i].todos.push(todo)
        this.currentUsers[i].numberOfTodos = this.currentUsers[i].todos.length;
        this.global.usersCount = this.currentUsers.length;
        return;
      }
    }
    
  }

  confirmToModify(todoId:number, status:string) {
    let msg = "";
    if(status.toLowerCase() == "pending"){
      msg = "Mark as completed?"
    }else{
      msg = "Mark as pending?"
    }
    this.confirmationService.confirm({
        message: msg,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.blockDoc();
          if(status.toLowerCase() == "pending"){
            this.restService.markAsComplete([todoId]).subscribe({
              next: ((response) => {
                this.messageService.add({ severity:'success', detail: `Modified!!`, life:2000});
                this.initialize()
              }),
              error: ((error) => {
                this.messageService.add({ severity:'success', detail: `${error.error.message}`, life:2000});
                this.unblockDoc()
              })
            })
          }else{
            this.restService.markAsPending([todoId]).subscribe({
              next: ((response) => {
                this.messageService.add({ severity:'success', detail: `Modified!!`, life:2000});
                this.initialize()
              }),
              error: ((error) => {
                this.messageService.add({ severity:'success', detail: `${error.error.message}`, life:2000});
                this.unblockDoc()
              })
            })
          }
          
        },
        reject: () => {
            
        }
    });
  }
   
  signOut(){
    this.blockDoc()
    this.currentUser = "Guest"
    this.todos = []
    this.todosTemp = []
    this.currentUserTodosCount = 0
    this.global.currentUser = "Guest"
    this.global.token = ""
    this.global.userId = -1
    this.global.currentUserTodosCount = 0
    this.global.isLoggedIn = false
    this.unblockDoc()
    this.router.navigate(["/login"])
  }

  blockDoc(){
    this.blockedDocument = true
  }
  
  unblockDoc(){
    this.blockedDocument = false
  }

  editUser(adminUserName?:string, adminUserPassword?:string){
    if(this.editUserName.length <= 0 || this.editUserPassword.length <= 0){
      this.messageService.add({ severity:'info', detail: `Enter Valid Data!`, life:2000});
      return;
    }
    this.blockDoc()
    let payload = {}
    if(this.global.isAdmin){
      payload = { "userId" : this.adminSelectedUserId, "username" : this.editUserName, "password" : this.editUserPassword }
    }else{
      payload = { "userId" : this.global.userId, "username" : this.editUserName, "password" : this.editUserPassword }
    }
    this.restService.editUser(payload).subscribe({
      next: ((response) => {
        if(!this.global.isAdmin){
          let message = JSON.parse(JSON.stringify(response))["message"]
          this.global.currentUser = JSON.parse(JSON.stringify(response))["username"]
          this.unblockDoc()
          this.userEditDialog = false
          this.messageService.add({ severity:'info', detail: `${message}`, life:2000});
        }else{
          let message = JSON.parse(JSON.stringify(response))["message"]
          let uname = JSON.parse(JSON.stringify(response))["username"]
          let userid = JSON.parse(JSON.stringify(response))["userId"]
          this.modifyUserName(uname, userid)
          this.unblockDoc()
          this.userEditDialog = false
          this.messageService.add({ severity:'info', detail: `${message}`, life:2000});
        }
      }),
      error: ((err) => {
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${err.error.message}`, life:2000});
      })
    })
  }

  modifyUserName(username:string, userId:number){
    for(let i = 0; i < this.currentUsers.length; i++){
      if(this.currentUsers[i].userId == userId){
        this.currentUsers[i].userName = username;
        this.global.globalUsers = []
        this.global.globalUsers = this.currentUsers
        return;
      }
    } 
  }

  getUserCredentialsToEdit(userId:number){
    console.log(userId);
    this.adminSelectedUserId = userId
    this.editUserName = ""
    this.editUserPassword = ""
    this.userEditDialog = true
  }

  removeUser(userId:number){
    this.blockDoc()
    let payload = { "userId" : userId }
    this.restService.removeUser(payload).subscribe({
      next:((response) => {
        let userid = JSON.parse(JSON.stringify(response))["userId"]
        let message = JSON.parse(JSON.stringify(response))["message"]
        this.removeUserCredentials(userid)
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${message}`, life:2000});
      }),
      error: ((err) => {
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${err.error.message}`, life:2000});
      })
    })
  }

  removeUserCredentials(userid:number){
    let items:User[] = this.currentUsers
    this.currentUsers = []
    for(let i = 0; i<items.length; i++){
      this.currentUsers.push(items[i])
    }
    for(let i = 0; i < this.currentUsers.length; i++){
      if(this.currentUsers[i].userId == userid){
        this.global.globalTodosCount -=  this.currentUsers[i].numberOfTodos
        this.currentUsers.splice(i,1)    
        this.global.globalUsers = []
        this.global.globalUsers = this.currentUsers   
        this.global.usersCount = this.currentUsers.length 
        return;
      }
    } 
  }

  addNewUser(){
    if(this.editUserName.length <= 0 || this.editUserPassword.length <= 0){
      this.messageService.add({ severity:'info', detail: `Enter Valid Data!`, life:2000});
      return;
    }
    this.blockDoc()
    let payload = { "username" : this.editUserName, "password" : this.editUserPassword }
    this.restService.addUser(payload).subscribe({
      next: ((response) => {
        let message = JSON.parse(JSON.stringify(response))["message"]
        let uname = JSON.parse(JSON.stringify(response))["username"]
        let uid = JSON.parse(JSON.stringify(response))["userId"]
        this.addToGlobalUser(uname, uid)
        this.addUserDialog = false
        this.unblockDoc()
        this.userEditDialog = false
        this.messageService.add({ severity:'info', detail: `${message}`, life:2000});
      }),
      error: ((err) => {
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${err.error.message}`, life:2000});
      })
    })
  }

  addToGlobalUser(name:string, id:number){
    let items:User[] = this.currentUsers
    this.currentUsers = []
    let user:User = { userId: id, userName:name,todos:[], numberOfTodos:0 }
    for(let i = 0; i<items.length; i++){
       this.currentUsers.push(items[i])
    }
    this.currentUsers.push(user)
    this.global.globalUsers = []
    this.global.globalUsers = this.currentUsers
    this.global.usersCount = this.currentUsers.length
  }

  addToDoForUser(userId: number){
    this.adminSelectedUserId = userId
    this.showTodoDialog = true
  }

  adminSignOut(){
    this.blockDoc()
    this.global.isAdmin = false
    this.global.currentUser = "Guest"
    this.global.currentUserTodosCount = 0
    this.global.globalTodos = []
    this.global.globalTodosCount = 0
    this.global.isLoggedIn = false
    this.global.token = ""
    this.global.usersCount = 0
    this.global.globalUsers = []
    this.global.globalTodosCount = 0
    this.global.usersCount = 0
    this.unblockDoc()
    this.router.navigate(["/login"])
  }
  
  getUserCredentialsToEditTodo(userId:number, todoId:number, todoTitle:string, todoDescription:string){
    this.currentTodoTitle = todoTitle;
    this.currentTodoDescription = todoDescription;
    this.adminSelectedUserId = userId;
    this.currentTodoId = todoId;
    this.modifyTodoDialog = true
  }

  editTodo(){
    if(this.currentTodoTitle.length == 0 || this.currentTodoDescription.length == 0){
        this.messageService.add({ severity:'info', detail: `Valid data required!`,life:2000});
        return;
    }
    this.blockDoc()
    this.restService.editTodo({"todoId" : this.currentTodoId, "todo" : this.currentTodoTitle, "todoDescription" : this.currentTodoDescription})
    .subscribe({
      next: ((response) => {
        let message = JSON.parse(JSON.stringify(response))["message"]
        this.updateToDoLocally()
        this.modifyTodoDialog = false
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${message}`,life:2000});
      }),
      error: ((err) => {
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${err.error.message}`, life:2000});
      })
    })
  }

  updateToDoLocally(){
    for(let i = 0; i < this.currentUsers.length; i++){
      if(this.currentUsers[i].userId == this.adminSelectedUserId){
        let data = this.currentUsers[i].todos;
        for(let a = 0; a < data.length; a++ ){
          if(data[a].todoId == this.currentTodoId){
            this.currentUsers[i].todos[a].todo = this.currentTodoTitle;
            this.currentUsers[i].todos[a].todoDescription = this.currentTodoDescription;
            return;
          }
        }
      }
    }
  }

  getUserCredentialsToRemoveTodo(userId:number, todoId:number){
    this.adminSelectedUserId = userId;
    this.currentTodoId = todoId;
    this.removeToDo()
  }

  removeToDo(){
    this.blockDoc()
    this.restService.deleteTodos([this.currentTodoId])
    .subscribe({
      next: ((response) => {
        let message = JSON.parse(JSON.stringify(response))["message"]
        this.removeToDoLocally();
        this.unblockDoc();
        this.messageService.add({ severity:'info', detail: `${message}`, life:2000});
      }),
      error: ((err) => {
        this.unblockDoc()
        this.messageService.add({ severity:'info', detail: `${err.error.message}`, life:2000});
      })
    })
  }

  removeToDoLocally(){
    let items:User[] = this.currentUsers
    this.currentUsers = []
    for(let i = 0; i<items.length; i++){
      this.currentUsers.push(items[i])
    }
    for(let i = 0; i < this.currentUsers.length; i++){
      if(this.currentUsers[i].userId == this.adminSelectedUserId){
        let data = this.currentUsers[i].todos;
        for(let a = 0; a < data.length; a++){
          if(data[a].todoId == this.currentTodoId){
            this.currentUsers[i].todos.splice(a,1);
            this.currentUsers[i].numberOfTodos = this.currentUsers[i].todos.length;
            this.global.globalTodosCount--;
          }
        }
        return;
      }
    } 
  }

  // utilities

  globalSearch(table: Table, $event:any){
    table.filterGlobal($event.target.value, 'contains')
  }

  public selectedColumns: any[] = [];

  getColumnsFilter():any[]{
    let cols = [{ field: 'userName', header: 'Name' },
    { field: 'numberOfTodos', header: 'Number Of Todos' },
    { field: 'userId', header: 'UserId' }]
    return cols
  }

  markAsCompleted(){
    
  }

//   exportPdf() {
//     const doc = new jsPDF()
//     autoTable(doc, { html: '#my-table' })
//     doc.save('table.pdf')
// }

// exportExcel() {
//     // import("xlsx").then(xlsx => {
//     //     const worksheet = xlsx.utils.json_to_sheet(this.products);
//     //     const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//     //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
//     //     this.saveAsExcelFile(excelBuffer, "products");
//     // });
// }

// saveAsExcelFile(buffer: any, fileName: string): void {
//     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
//     let EXCEL_EXTENSION = '.xlsx';
//     const data: Blob = new Blob([buffer], {
//         type: EXCEL_TYPE
//     });
//     FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
// }
}
