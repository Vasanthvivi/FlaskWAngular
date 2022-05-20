import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { RestService } from '../services/rest-service.service';
import { Todo } from "../classes/todos"
import {MessageService} from 'primeng/api';
import {ConfirmationService} from 'primeng/api';
import { Router } from '@angular/router';

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
  constructor(private router:Router, private restService:RestService, public global:GlobalService, private messageService:MessageService, private confirmationService:ConfirmationService) { }

  ngOnInit() {
   this.initialize()
  }

  initialize(){
    this.selectedTodos = []
    if(this.currentUser == "admin" || this.currentUser == "Admin"){
      //get the whole data 
    }else{
      this.restService.getTodos().subscribe({
        next: ((response) => {
          this.todosTemp = []
          this.todos = []
          this.todosTemp = JSON.parse(JSON.stringify(response))["todos"]
          this.currentUserTodosCount = this.global.currentUserTodosCount = this.todosTemp.length
          this.makeTodos()
        }),
        error: ((error) => {
          console.log(error)
        })
      })
    }
  }

  makeTodos(){
    for(let i=0; i<this.todosTemp.length; i++){
      let todo:Todo = { todoId: this.todosTemp[i][0], userId: this.todosTemp[i][1], todo: this.todosTemp[i][2], todoDescription: this.todosTemp[i][3] }
      this.todos[i] = todo
    }
    console.log("todos done")
    console.log(this.todos)
    if(this.todos.length == 0){
      this.messageService.add({ severity:'success', detail: `Todos are empty! Lets make some todos!`});
    }else{
      this.messageService.add({ severity:'info', detail: `Got ${this.todos.length} todos!`});
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
    this.restService.deleteTodos(this.selectedTodos).subscribe({
      next: ((response) => {
        let numberOfDeletedTodos = JSON.parse(JSON.stringify(response))["numberOfDeletedData"] 
        console.log(numberOfDeletedTodos + "has been deleted!")
        this.messageService.add({ severity:'success', detail: `${numberOfDeletedTodos} deleted!`, sticky:true});
        this.initialize()
      }),
      error: ((error) => {
         alert(error.error.message)
      })
    })
  }

  showAddTodo(){
    this.showTodoDialog = true;
  }

  createTodo(){
    if(this.todoTitle.length <= 0 || this.todoDescription.length <= 0){
      this.messageService.add({ severity:'info', detail: `Data Required!`});
    }else{
      let payload = { "title" : this.todoTitle, "description" : this.todoDescription, "userId" : this.global.userId }
      this.restService.buildTodo(payload).subscribe({
        next: ((response) => {
          let result = JSON.parse(JSON.stringify(response))["message"]
          this.messageService.add({ severity:'success', detail: `${result}`});
          this.initialize()
          this.showTodoDialog=false
        }),
        error:((error) => {
          this.messageService.add({ severity:'success', detail: `${error.error.message}`});
          this.showTodoDialog=false
        })
      })
    }
  }

  confirmToDelete(todoId:number) {
    this.confirmationService.confirm({
        message: 'Remove ToDo?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.restService.deleteTodos([todoId]).subscribe({
            next: ((response) => {
              let numberOfDeletedTodos = JSON.parse(JSON.stringify(response))["numberOfDeletedData"] 
              console.log(numberOfDeletedTodos + "has been deleted!")
              this.messageService.add({ severity:'success', detail: `${numberOfDeletedTodos} deleted!`, sticky:true});
              this.initialize()
            }),
            error: ((error) => {
               alert(error.error.message)
            })
          })
        },
        reject: () => {
            
        }
    });
  }
   
  signOut(){
    this.currentUser = "Guest"
    this.todos = []
    this.todosTemp = []
    this.currentUserTodosCount = 0
    this.global.currentUser = "Guest"
    this.global.token = ""
    this.global.userId = -1
    this.global.currentUserTodosCount = 0
    this.global.isLoggedIn = false
    this.router.navigate(["/login"])
  }
}
