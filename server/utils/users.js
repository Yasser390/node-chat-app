class Users {
    constructor(){
        this.users = [];
    }
    addUser(id,name,room){
        var user = {id,name,room};
        this.users.push(user);
        return user;
    }
    removeUser (id){
        //var user =  this.users.filter((user)=> user.id ===id)[0];
        var user = this.getUser(id);
        //console.log(user);
        if(user){

            this.users = this.users.filter((user)=> user.id !==id);
        }
        return user;
    }
    getUser (id){
        //console.log(this.users.filter((user)=> user.id ===id)[0]);
        return  this.users.filter((user)=> user.id ===id)[0];
    }
    getUserList (room){
        var users = this.users.filter((user)=> user.room ===room);
        var namesArray = users.map((user)=>(user.name));
        return namesArray;
    }
}

module.exports= {Users};
// class Person {
//     constructor (name, age) {
//         this.name = name; //this refers to the instance
//         this.age = age;
//     }
//     getUserDescription(){
//         return `${this.name} is ${this.age}`;
//     }
// }

// var me = new Person('Yasser',29); 
// console.log(me.getUserDescription());
//console.log('this.age',me.age);

