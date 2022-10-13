"use strict";
const {Sequelize, Model, DataTypes} = require('sequelize');
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

    CreateUser (email, password) {
        this.User.create({
            Email: email,
            Password: password
        });
    }

    async checkUser (email, password) {
        let res = await this.User.findAll({
            where:{
                Email: email,
                Password: password
            }
        });
        return res.length>0;
    }
}

module.exports = new DatabaseModule();