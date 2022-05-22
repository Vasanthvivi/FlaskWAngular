class Tree{
   insertData(data:number, node:DataNode){
       if(node == undefined){
           return new DataNode(data)
       }
   }
}

class DataNode{
   public data:number = 0;
   public left:DataNode | undefined = undefined;
   public right:DataNode | undefined = undefined;
   public height:number = 1;
   constructor(data:number){
     this.data = data
   }
}





// datas = [
//     [
//         51,
//         7,
//         "Friend BirthDay!",
//         "Friend BirthDay is ninth of october so where he have to be headed\n\n\n\n\n\n\n\n\n\n\n?"
//     ],
//     [
//         53,
//         7,
//         "Friend BirthDay!",
//         "Friend BirthDay is ninth of october so where he have to be headed\n\n\n\n\n\n\n\n\n\n\n?"
//     ],
//     [
//         59,
//         5,
//         "Todo",
//         "pohi"
//     ],
//     [
//         73,
//         2,
//         "Todo rwo",
//         "asdfasd sdfgsdf"
//     ],
//     [
//         74,
//         2,
//         "Todo rwo",
//         "asdfasd sdfgsdf"
//     ],
//     [
//         94,
//         1,
//         "Todo",
//         "Build at: 2022-05-21T03:11:47.400Z - Hash: 12f6a2bd0837f134 - Time: 315ms\n\n√ Compiled successfully.\n√ Browser application bundle generation complete.\n\nInitial Chunk Files | Names   | Raw Size\nmain.js             | main    | 87.64 kB |\nruntime.js          | runtime |  6.53 kB |\n\n4 unchanged chunks\n\nBuild at: 2022-05-21T03:12:03.415Z - Hash: 176fe7e9ab3a6eb1 - Time: 410ms\n\n√ Compiled successfully.\n√ Browser application bundle generation complete.\n\n6 unchanged chunks\n\nBuild at: 2022-05-21T03:13:13.017Z - Hash: 176fe7e9ab3a6eb1 - Time: 442ms"
//     ],
//     [
//         95,
//         1,
//         "Todo",
//         "Build at: 2022-05-21T03:11:47.400Z - Hash: 12f6a2bd0837f134 - Time: 315ms\n\n√ Compiled successfully.\n√ Browser application bundle generation complete.\n\nInitial Chunk Files | Names   | Raw Size\nmain.js             | main    | 87.64 kB |\nruntime.js          | runtime |  6.53 kB |\n\n4 unchanged chunks\n\nBuild at: 2022-05-21T03:12:03.415Z - Hash: 176fe7e9ab3a6eb1 - Time: 410ms\n\n√ Compiled successfully.\n√ Browser application bundle generation complete.\n\n6 unchanged chunks\n\nBuild at: 2022-05-21T03:13:13.017Z - Hash: 176fe7e9ab3a6eb1 - Time: 442ms"
//     ],
//     [
//         97,
//         1,
//         "Todo",
//         "Build at: 2022-05-21T03:11:47.400Z - Hash: 12f6a2bd0837f134 - Time: 315ms\n\n√ Compiled successfully.\n√ Browser application bundle generation complete.\n\nInitial Chunk Files | Names   | Raw Size\nmain.js             | main    | 87.64 kB |\nruntime.js          | runtime |  6.53 kB |\n\n4 unchanged chunks\n\nBuild at: 2022-05-21T03:12:03.415Z - Hash: 176fe7e9ab3a6eb1 - Time: 410ms\n\n√ Compiled successfully.\n√ Browser application bundle generation complete.\n\n6 unchanged chunks\n\nBuild at: 2022-05-21T03:13:13.017Z - Hash: 176fe7e9ab3a6eb1 - Time: 442ms"
//     ],
//     [
//         197,
//         10,
//         "username",
//         "this is a new todo making i think we got here all the stuff and we are doing this"
//     ],
//     [
//         198,
//         10,
//         "username",
//         "this is a new todo making i think we got here all the stuff and we are doing this"
//     ],
//     [
//         200,
//         10,
//         "username",
//         "this is a new todo making i think we got here all the stuff and we are doing this"
//     ],
//     [
//         201,
//         4,
//         "Todo",
//         "initializeAdmin"
//     ]
// ];
