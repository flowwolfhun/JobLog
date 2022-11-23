
const DatabaseModule = require('./DatabaseModule');
class CompanyModule{
    async getList(){
        return await DatabaseModule.Company.getList();
    }
}


module.exports = new CompanyModule();