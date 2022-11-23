"use strict";
const ApiGateway = require("moleculer-web");
const CompanyModule = require("../modules/CompanyModule");

module.exports = {
	name: "company",
	//mixins: [ApiGateway],
    actions: {
		list:{
			rest: {
				origin: "*",
				method:["GET", "OPTIONS", "POST", "PUT", "DELETE"],
				path:'/list',
				allowedHeaders: "*",
				exposedHeaders: [],
				credentials: false,
				maxAge: 3600
			},
			async handler (ctx){
				return CompanyModule.getList();
				//return allow;
				/*
https://github.com/moleculerjs/moleculer-web/issues/117
https://codesandbox.io/s/pn2yf?file=/services/api.service.js:736-832
				*/
			}
		}	
    }
}

