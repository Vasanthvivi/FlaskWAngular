import { Todo } from "./todos";

export class User{
    public userId:number = 0;
    public userName:string = "";
    public numberOfTodos: number = 0;
    public todos:Todo[] = [];
}