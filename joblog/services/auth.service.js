"use strict";

const ApiGateway = require("moleculer-web");
const DatabaseModule = require('../modules/DatabaseModule')

module.exports = {
	name: "auth",
	mixins: [ApiGateway],
    actions: {
		login:{
			rest: {
				method:["GET", "OPTIONS", "POST", "PUT", "DELETE"],
				path:'/login',
				allowedHeaders: "*"
			},
			async handler (ctx){
				return DatabaseModule.checkUser(ctx.params.email, ctx.params.password);
			}
		},

		registration: {
			rest: {
				method:["GET", "OPTIONS", "POST", "PUT", "DELETE"],
				path:'/registration',
				allowedHeaders: "*"
			},
			async handler (ctx){
			return DatabaseModule.registration(ctx.params.email, ctx.params.password);
			}
		}		
    }
}

// function dummy(){
// 	DatabaseModule.checkUser('dani', 'dani');
// }
//  dummy();