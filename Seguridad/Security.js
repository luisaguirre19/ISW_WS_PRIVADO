const jwt = require('jsonwebtoken');

async function validaSeguridad(token){
    try {
        let retorno
        if (!token) {
            console.error("primera validacion")
            retorno =  'N'
        }else{
           await jwt.verify(token, 'secretDEV2023', function(err, decoded) {
                if (err) {
                    console.error("esto fue lo que dio " + err)
                    retorno =  'N'
                } else {
                    const now = Math.floor(Date.now() / 1000); // Timestamp UNIX actual
                    if (now - decoded.iat > decoded.expiresIn) {
                        retorno =  'T'
                      } else {
                        if(!decoded.id_login){retorno = 'N'}
                        retorno = decoded.id_login.toString()
                      }
                }
            })
            return retorno
        }
    } catch (error) {
        console.log(error)
          return 1
      }
  }

  async function creaToken(usuario, id_login){
    try {
        const payload = {
            usuario: usuario,
            id_login: id_login,
            expiresIn: 3600//00
        }
        const token = jwt.sign(payload, 'secret');
        return token
    } catch (error) {
        console.log("error en crea token")
    }
  }

  module.exports ={
    validaSeguridad : validaSeguridad,
    creaToken       :  creaToken
  }