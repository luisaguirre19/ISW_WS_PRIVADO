var config = require('../Configuracion_DB/dbconfig');
const sql = require('mssql');
//exports.handler = async (data) => {
async function getData(data){
    try {
        let pool = await sql.connect(config);
        let ejecucion = await pool.request()  
        let retorno
      for (var item in data) {            
            for (var parametro in data[item])  {  
              if(parametro !== 'sp'){
                await ejecucion.input(parametro,data[item][parametro])
              }else{
                await ejecucion.execute(data[item][parametro]).then(result=>{
                            retorno = result
                        })
              }
            }
          }
      return retorno.recordset;
    } catch (error) {
      console.log(error)
        return 1
    }
}

 module.exports = {
    getData : getData
 }
//}

