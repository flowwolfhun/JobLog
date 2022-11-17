
const DatabaseModule = require('./DatabaseModule');
var uuid = require('uuid');
class AuthModule{
    
    loggedInUser = []
    
    constructor(){

    }
    async registration (email, password){
        var res = await  DatabaseModule.registration(email, password);

        if(res.result ==='ok'){
            this.AddToken(res.id);
            return res.result;
        }
        else{
            return res.result
        }
        
    }
    async login(email, password){
        let id = await DatabaseModule.checkUser(email, password);
        if(id){
            return this.AddToken(id);
            //ctx.meta.cookies.usertoken = {"usertoken": };
        }
        else{
            return 'forbidden'
        }
    }

    AddToken(userID ){
        var newuuid = uuid.v1();
        var newUser = {id : userID, token: newuuid, expiration: new Date().setFullYear(new Date().getFullYear()+1)};
        this.loggedInUser.push(newUser);
        return newuuid;
    }
}

module.exports = new AuthModule();