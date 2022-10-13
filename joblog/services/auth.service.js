"use strict";

const ApiGateway = require("moleculer-web");
const DatabaseModule = require('../modules/DatabaseModule')

module.exports = {
	name: "auth",
	mixins: [ApiGateway],
    actions: {
		login:{
			rest: {
				method:'POST',
				path:'/login'
			},
			async handler (ctx){
				DatabaseModule.checkUser(ctx.email, ctx.password);
			}
		}
    }
}

// function dummy(){
// 	DatabaseModule.checkUser('dani', 'dani');
// }
//  dummy();