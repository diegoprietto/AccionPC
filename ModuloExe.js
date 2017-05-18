"use strict";

var exec = require('child_process').execFile;

var Qux = function () {};

var rutaAplicacion = "bin/Acciones PC.exe";

//Guarda en archivo plano
/*
	error: Función callback que se ejecuta cuando ocurre un error, se pasa por parámetro un mensaje de error para el usuario o log
	parametros: Array de strings que se pasa como parámetro a la aplicación
	callback: Función callback que se ejecuta cuando se guarda con éxito, se pasa por parámetro el log de la aplicación
*/
Qux.prototype.EjecutarApp = function(error, parametros, callback){
	console.log("Parametros:");
	/////parametros[2] = parametros[2].toString();
	console.log(parametros);
	const child = exec(rutaAplicacion, parametros, (err, stdout, stderr) => {
	    if (err) {
	      if (error) error("Se produjo un error al intentar ejecutar la aplicación.");
	    }else{
	    	//
	    	callback(stdout);
	    }
  	});
}

exports.Qux = Qux;