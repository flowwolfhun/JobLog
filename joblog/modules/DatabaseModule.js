"use strict";
const {Sequelize, Model, DataTypes} = require('sequelize');
var crypto = require('crypto');
const sequelize = new Sequelize("joblog", 'simpleflow', 'simpleflow', {
    host: "localhost",
    port: 1433,
    dialect: "mssql",
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    dialectOptions: {
      options: { encrypt: true }
    }
  });

class DatabaseModule {
    User = sequelize.define('User',{
        ID:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
        Email: DataTypes.STRING,
        Password: DataTypes.STRING,
        Enabled: DataTypes.BOOLEAN
    }, 
    {
        freezeTableName: true,
        timestamps: false //Ez lehet jobb lenne ha lenne
      });

    async checkUser (email, password) {
      let passwordHash = crypto.createHash('md5').update(password).digest('hex');
        let res = await this.User.findAll({
            where:{
                Email: email,
                Password: passwordHash,
                Enabled: true
            }
        });
        return res.length>0;
    }

    async registration (email, password) {
      let isExists = (await this.User.findAll({
        where:{
            Email: email,
            Enabled:true
        }
      })).length>0;
      if(!isExists){
        let passwordHash = crypto.createHash('md5').update(password).digest('hex');
          let res = await this.User.create({
                Email: email,
                Password: passwordHash,
                Enabled:true
              
          });
          return 'ok';
      }
      else{
        return 'alreadyRegistered'
      }
    }
}

module.exports = new DatabaseModule();