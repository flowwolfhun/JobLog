"use strict";

const ApiGateway = require("moleculer-web");
const AuthModule = require("../modules/AuthModule")

module.exports = {
	name: "auth",
	mixins: [ApiGateway],
    actions: {
		login:{
			rest: {
				origin: "*",
				method:["GET", "OPTIONS", "POST", "PUT", "DELETE"],
				path:'/login',
				allowedHeaders: "*",
				exposedHeaders: [],
				credentials: false,
				maxAge: 3600
			},
			async handler (ctx){
				return AuthModule.login(ctx.params.email, ctx.params.password)
				//return allow;
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
				return AuthModule.registration(ctx.params.email, ctx.params.password);				
			}
		}		
    }
}

// function dummy(){
// 	DatabaseModule.checkUser('dani', 'dani');
// }
//  dummy();