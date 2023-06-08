//exports.handler = async (event) => {

const dbocategoria = require("./Routes/getData");
const security = require("./Seguridad/Security");
const correo = require("./Routes/envio_mail");

const jwt = require("jsonwebtoken");
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const { request, res } = require("express");

var app = express();
var router = express.Router();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", router);
app.use("*", (req, res) =>
  res.status(404).send("No existe la ruta de la petición. :d")
);

try {
  //SE COLOCA A VIGENTE LA CUENTA DEL PRODUCTOR
  router.route("/count").put((request, res) => {
    parametros = [
      {
        operacion: "C",
        sub_operacion: "A",
        id_generico: Number(request.query.id_usuario),
        tipo: request.query.estado,
        sp: "principal_beneficio"
      },
    ];
    dbocategoria.getData(parametros).then((result) => {
      console.log("venimos " + result)
      if (result == 1) {
        res
          .status(500)
          .send("Revisa la parametrización enviada a la base de datos.");
      } else {
        res.json(result);
      }
    });
  });

  //CREAMOS UNA CUENTA DEL CLIENTE
  router.route("/count").post((request, res) => {
    let parametros = request.body;

    parametros = [{
      operacion: "L",
      sub_operacion: "V",
      correo: request.body.correo,
      pass: request.body.pass,
      sp: "principal",
  }]
    try {
      dbocategoria.getData(parametros).then((result) => {
        if (result == 1) {
          res
            .status(500)
            .send("Revisa la parametrización enviada a la base de datos.");
        } else {
          res.json(result);

          // if (result[0].resp == "Si") {
          //   res.json(result);
            // security
            //   .creaToken(result[0].usuario, result[0].id_login)
            //   .then((result) => {
            //     res.json(result);
            //   });
          // } else {
          //   res.status(300).send("Verfica los datos ingresados");
          // }
        }
      });
    } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
    }
  });

  //OBTENEMOS LOS DATOS DEL USUARIO
  router.route("/count").get((request, res) => {
    try {
      security.validaSeguridad(request.headers.authorization).then((resp) => {
        if (resp == "N" || !resp) {
          return res.status(401).json({ error: "No autorizado" });
        } else if (resp == "T") {
          return res.status(403).json({ error: "No autorizado, token expiró" });
        }
        parametros = [
          {
            operacion: "L",
            sub_operacion: "B",
            id_generico: resp,
            sp: "principal_beneficio",
          },
        ];
        dbocategoria.getData(parametros).then((result) => {
          if (result == 1) {
            res
              .status(500)
              .send("Revisa la parametrización enviada a la base de datos.");
          } else {
            res.json(result);
          }
        });
      });
    } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
    }
  });

    //OBTENEMOS LOS DATOS DEL USUARIO
    router.route("/productores").get((request, res) => {
      try {
        security.validaSeguridad(request.headers.authorization).then((resp) => {
          if (resp == "N" || !resp) {
            return res.status(401).json({ error: "No autorizado" });
          } else if (resp == "T") {
            return res.status(403).json({ error: "No autorizado, token expiró" });
          }
          parametros = [
            {
              operacion: "L",
              sub_operacion: "P",
              id_generico: resp,
              sp: "principal_beneficio",
            },
          ];
          dbocategoria.getData(parametros).then((result) => {
            if (result == 1) {
              res
                .status(500)
                .send("Revisa la parametrización enviada a la base de datos.");
            } else {
              res.json(result);
            }
          });
        });
      } catch (error) {
        res.status(100).send("Revisa la estructura de la parametrización.");
      }
    });

  //VALIDAMOS LAS CREDENCIALES DE LOGIN
  router.route("/login").get((request, res) => {
    try {
      parametros = [
        {
          operacion: "L",
          sub_operacion: "V",
          correo: request.query.correo,
          pass: request.query.pass,
          sp: "principal",
        },
      ];
      dbocategoria.getData(parametros).then((result) => {
        if (result == 1) {
          res
            .status(500)
            .send("Revisa la parametrización enviada a la base de datos.");
        } else {
          if (result[0].resp == "Si") {
            security
              .creaToken(result[0].usuario, result[0].id_login)
              .then((result) => {
                res.json(result);
              });
          } else {
            res.status(300).send("Las credenciales no coinciden.");
          }
        }
      });
    } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
    }
  });


  //CREAMOS UNA CUENTA DEL CLIENTE
  router.route("/guardia").post((request, res) => {
    let parametros = request.body;

    parametros = [{
      operacion: "G",
      sub_operacion: "S",
      codigo_qr: request.body.codigo_qr,
      sp: "principal",
  }]
    try {
      dbocategoria.getData(parametros).then((result) => {
        if (result == 1) {
          res
            .status(500)
            .send("Revisa la parametrización enviada a la base de datos.");
        } else {
          res.json(result);

          // if (result[0].resp == "Si") {
          //   res.json(result);
            // security
            //   .creaToken(result[0].usuario, result[0].id_login)
            //   .then((result) => {
            //     res.json(result);
            //   });
          // } else {
          //   res.status(300).send("Verfica los datos ingresados");
          // }
        }
      });
    } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
    }
  });

  router.route('/cuenta_envio').post((request,res)=>{
    try {
      console.log("aca " + request.body.codigo_qr)
        parametros = [{
            "operacion":'E',
            "sub_operacion":'I',
            "id_envio":request.body.id_envio,
            "id_cuenta":request.body.id_cuenta,
            "peso":request.body.peso,
            "estado":request.body.estado,
            "vehiculo":request.body.vehiculo,
            "codigo_qr":request.body.codigo_qr,
            "sp":"principal"
        }]
        dbocategoria.getData(parametros).then(result => {
            if(result == 1){
                res.status(500).send("Revisa la parametrización enviada a la base de datos.");
            }else{
                res.json(result);    
            }
        })
    } catch (error) {
        res.status(100).send("Revisa la estructura de la parametrización.");
    }
})

router.route('/incripcion').post((request,res)=>{
  try {
      parametros = [{
          "operacion":'L',
          "sub_operacion":'N',
          "correo":request.body.correo,
          "pass":request.body.pass,
          "nombres":request.body.nombres,
          "apellidos":request.body.apellidos,
          "productor":request.body.productor,
          "telefono":request.body.telefonos,
          "sp":"principal_beneficio"
      }]
      dbocategoria.getData(parametros).then(result => {
          if(result == 1){
              res.status(500).send("Revisa la parametrización enviada a la base de datos.");
          }else{
              res.json(result);    
          }
      })
  } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
  }
})

router.route('/valida_peso').post((request,res)=>{
  try {
      parametros = [{
          "operacion":'P',
          "sub_operacion":'S',
          "id_envio":request.body.p_identificadorEnvio,
          "sp":"principal_beneficio"
      }]
      dbocategoria.getData(parametros).then(result => {
          if(result == 1){
              res.status(500).send("Revisa la parametrización enviada a la base de datos.");
          }else{
              res.json(result);    
          }
      })
  } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
  }
})

router.route('/inserta_peso').post((request,res)=>{
  try {
      parametros = [{
          "operacion":'P',
          "sub_operacion":'I',
          "id_envio":request.body.p_identificadorEnvio,
          "peso":request.body.p_cantPeso,
          "sp":"principal_beneficio"
      }]
      dbocategoria.getData(parametros).then(result => {
          if(result == 1){
              res.status(500).send("Revisa la parametrización enviada a la base de datos.");
          }else{
              res.json(result);    
          }
      })
  } catch (error) {
      res.status(100).send("Revisa la estructura de la parametrización.");
  }
})


router.route('/envio_correo').post((request,res)=>{
  correo.envio_mail(request.body.asunto,request.body.receptor, request.body.msg, request.body.para ).then(resp=>{
    res.status(200).send("Enviado");
  })
})



} catch (error) {
  res.status(200).send("Revisa la estructura de la parametrización.");
}

var port = process.env.PORT || 8091;
app.listen(port);
console.log("api iniciado en el puerto: " + port);
//}
