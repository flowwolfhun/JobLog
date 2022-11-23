"use strict";

const {Sequelize, Model, DataTypes} = require('sequelize');
class CompanyModel {
    model = null;
    sequelize = null;
    constructor(model){
        this.sequelize = this.sequelize;
        this.model = model;
        //this.define();
    }

    async define ()  {
        this.model = this.sequelize.define('Company',{
        ID:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
        Name: DataTypes.STRING
    }, 
    {
        freezeTableName: true,
        timestamps: false //Ez lehet jobb lenne ha lenne
      });

    }

    async getList(){
        let res = await this.model.findAll(
            //{
            // where:{
            //     Email: email,
            //     Password: passwordHash,
            //     Enabled: true
            // }
            //}
        );
        return res;
    }
}


module.exports = CompanyModel;