"use strict";

const ApiGateway = require("moleculer-web");
const DatabaseModule = require('../modules/DatabaseModule')
var uuid = require('uuid');

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
				let allow = DatabaseModule.checkUser(ctx.params.email, ctx.params.password);
				if(allow){
					ctx.meta.cookies.usertoken = {"usertoken": uuid.v1()};
				}
				return allow;
				/*
https://github.com/moleculerjs/moleculer-web/issues/117
https://codesandbox.io/s/pn2yf?file=/services/api.service.js:736-832
				*/
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