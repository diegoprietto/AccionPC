"use strict";

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

//Aumentar el límite máximo permitido del request en 50m
//Nota: Por defecto el límite es muy pequeño para permitir subir archivos
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

/*var AccesoArchivos = require('./AccesoArchivos.js').Qux;
var accesoArchivos = new AccesoArchivos();

var AccesoMongo = require('./AccesoMongo.js').Qux;
var accesoMongo = new AccesoMongo();

var AccesoMail = require('./AccesoMail.js').Qux;
var accesoMail = new AccesoMail();

//Guardar datos en sesiones
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(session({secret: "Datos de Sesion"}));*/

//Definición de puerto
app.set('port', (process.env.PORT || 5001));

//Archivos públicos
app.use(express.static('public'));

//Usar el paquete Pug para Templates
app.set('view engine', 'pug');

//Modulos personales
var ModuloExe = require('./ModuloExe.js').Qux;
var moduloExe = new ModuloExe();

//INICIO Funciones AJAX**************************************************************************************

/*
  Descripción: Realiza la acción solicitada.
  Datos esperados:
    Recibe un objeto dentro de datos.content
    Debe contener la propiedad 'accion' que determina la acción general a realizar
    Luego debe contener los parámetros correspondientes según la acción a realizar
  Respuesta:
    Devuelve un objeto con la propiedad Resultado:
      Resultado puede contener 2 valores: "ERROR" / "OK"
    Devuelve la propiedad Mensaje, que contiene el error en forma de texto a mostrar al usuario, caso contrario aquí devuelve la salida por consola de la app
    Según la acción a realizar devuelve otras propiedades
*/
app.post('/accion', function(req, res){
  console.log("Acceso a función Ajax accion");

  console.log(req.body.content);

  var datos = req.body.content;

  if (datos && datos && datos.accion){

    switch(datos.accion){
      case "A":
      case "S":
      case "H":
      case "R":
        //Ejecutar exe según la acción
        EjecutarExe([datos.accion], res);
        break;
      case "GV":
      case "GM":
      case "M":
      case "NM":
        //Ejecutar exe según la acción
        EjecutarExe([datos.accion, nombreSpeaker], res);
        break;
      case "BV":
      case "SV":
        //Ejecutar exe para variación de volumen
        if (datos.amplio)
          EjecutarExe([datos.accion, nombreSpeaker, volumenMaximo], res);
        else
          EjecutarExe([datos.accion, nombreSpeaker, volumenMinimo], res);
      break;
      case "LS":
        //Listar nombres de dispositivos
        EjecutarExe([], res);
      break;
      default:
        //Entrada inválida
        console.log("Entrada inválida:");
        console.log(datos.accion);

        //Enviar un flag de Error
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ Resultado: 'ERROR', Mensaje: "La acción solicitada no es válida"}));
      break;
    }

  }else{
    //Sin datos de entrada
    console.log("Sin datos");

    //Enviar un flag de Error
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ Resultado: 'ERROR', Mensaje: "No se recibió la acción solicitada"}));
  }
});

//FIN Funciones AJAX**************************************************************************************



//INICIO Definición URL**************************************************************************************

//Vista Home (Default)
app.get('/', function(req, res){
  res.render('home');
});


//Cualquier url que no existente, redirigir a Home
app.all('/*', function (req, res) {
   console.log("Acceso a url inexistente");

   res.redirect('/');
})

 //FIN Definición URL**************************************************************************************



//INICIO Server**************************************************************************************

var server = app.listen(app.get('port'), function () {

   var host = server.address().address
   var port = server.address().port

   console.log("Servidor iniciado en http://%s:%s", host, port)
})

//FIN Server**************************************************************************************



//INICIO Funciones iniciales**************************************************************************************

var nombreSpeaker = "Speakers";    //Nombre del dispositivo de audio, puede variar de una PC a otra
var volumenMinimo = 10;           //Variación de volumen chico
var volumenMaximo = 25;           //Variación de volumen grande

function EjecutarExe(parametros, res){
  moduloExe.EjecutarApp(
    function (mensaje){
      //Enviar error al cliente
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ Resultado: 'ERROR', Mensaje: mensaje}));
    },
    parametros,
    function (salidaApp){
      //Enviar datos al cliente
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ Resultado: 'OK', Mensaje: salidaApp}));
    }
  );
}

//FIN Server**************************************************************************************