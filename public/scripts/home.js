"use strict";

$(document).ready(function () {
	obtenerListaDispositivos();
});

function EjecutarAjax(error, datos, callback){
	$.ajax({
		contentType: "application/json",
		method: "POST",
		url: "accion",
		data: JSON.stringify({ content: datos }),
		success: function(response) { callback(response); },
		error: function(response) { error(response); }
	});
}

//accion: Define el modo de apagar
function Apagar(accion){
	EjecutarAjax(ApagarError, {"accion": accion}, ApagarOk);
}

function ApagarError(response){
	alert("Se produjo un error: " + response.Mensaje);
}

function ApagarOk(response){
	alert("Exito: " + response.Mensaje);
}

//accion: Tipo de cambio de volumen
function CambiarVolumen(accion, amplio){
	EjecutarAjax(CambiarVolumenError, {"accion": accion, "amplio": amplio}, CambiarVolumenOk);
}

function CambiarVolumenError(response){
	alert("Se produjo un error: " + response.Mensaje);
}

function CambiarVolumenOk(response){
	botonObtenerVolumenActual();
}

//Ejecuta llamada Ajax para saber el valor del volumen actual
function obtenerVolumenActual(nombreDispositivo){
	var data = {"accion": "GV"};

	//Si existe el nombre pasarlo al server
	if (nombreDispositivo){
		data.nombreDispositivo = nombreDispositivo;
	}

	EjecutarAjax(obtenerVolumenActualError, data, obtenerVolumenActualOk);
}

//Colocar el valor en el control central del volumen
function obtenerVolumenActualOk(response){
	$("#loadingVolumen").hide();
	$("#valorVolumen").text(response.Mensaje);
	$("#valorVolumen").show();
}

function obtenerVolumenActualError(response){
	alert("Se produjo un error: " + response.Mensaje);
}

//Mostrar loading en el contenedor del valor de volumen
function colocarLoadingValorVolumen(){
	$("#loadingVolumen").show();
	$("#valorVolumen").hide();
}

function botonObtenerVolumenActual(){
	colocarLoadingValorVolumen();
	obtenerVolumenActual();
}

//Ejecuta llamada Ajax para saber si el dispositivo esta silenciado o no
function obtenerMuteActual(nombreDispositivo){
	var data = {"accion": "GM"};

	//Si existe el nombre pasarlo al server
	if (nombreDispositivo){
		data.nombreDispositivo = nombreDispositivo;
	}

	EjecutarAjax(obtenerMuteActualError, data, obtenerMuteActualOk);
}

function obtenerMuteActualOk(response){
	$("#loadingMute").removeClass("fa-spin").removeClass("fa-spinner").addClass("fa-volume-up");

	if (response.Mensaje.substring(0, 2) === "Si"){
		$("#loadingContorno").removeClass("fa-square-o").addClass("fa-ban").addClass("text-danger");
	}
}

function obtenerMuteActualError(response){
	alert("Se produjo un error: " + response.Mensaje);
}

function botonObtenerMuteActual(){
	$("#loadingMute").removeClass("fa-volume-up").addClass("fa-spin").addClass("fa-spinner");
	$("#loadingContorno").removeClass("fa-ban").removeClass("text-danger").addClass("fa-square-o");

	obtenerMuteActual();
}

function NoSilenciar(){
	EjecutarAjax(SilenciarError, {"accion": "NM"}, SilenciarOk(false));
}

function Silenciar(){
	EjecutarAjax(SilenciarError, {"accion": "M"}, SilenciarOk(true));
}

function SilenciarError(response){
	alert("Se produjo un error: " + response.Mensaje);
}

function SilenciarOk(mute){
		$("#loadingMute").removeClass("fa-volume-up").removeClass("fa-spin").removeClass("fa-spinner").addClass("fa-volume-up");
		$("#loadingContorno").removeClass("fa-ban").removeClass("text-danger").addClass("fa-square-o");

	if (mute){
		$("#loadingContorno").removeClass("fa-square-o").addClass("fa-ban").addClass("text-danger");
	}
}

//Añade la lista recibida como parámetros al combo de dispositivos de sonido
//Ejemplo de parámetro: lista = ["Item 1", "Item 2", "Item 3"];
function CargarDatosCombo(lista){
	//Vaciar combo
	$("#DatosComboDispositivos").empty();

	//Rellenar datos nuevos
	$.each(lista, function(index, value){
		$("#DatosComboDispositivos").append("<li><a href='#'>" + value + "</a></li>");
	});

	//Añadir evento a los items
	$("#DatosComboDispositivos a").click(function(object) {
		//Obtener el texto del item seleccionado
		var dispositivoSel = object.target.text.replace("\n","");

		//Setear al combo
		ActualizarTituloCombo(dispositivoSel);

		obtenerVolumenActual(dispositivoSel);
		obtenerMuteActual(dispositivoSel);
	});
}

//Cambia el título del combo de dispositivos
function ActualizarTituloCombo(titulo){
	$("#TituloComboDispositivos").text(titulo);
}

//Ejecuta llamada Ajax para obtener la lista de dispositivos de audio disponibles
function obtenerListaDispositivos(){
	EjecutarAjax(obtenerListaDispositivosError, {"accion": "LS"}, obtenerListaDispositivosOk);
}

function obtenerListaDispositivosError(response){
	alert("Se produjo un error: " + response.Mensaje + "\nReinicie la página, si el problema persiste contacte al desarrollador");
}

function obtenerListaDispositivosOk(response){
	var lineas = response.Mensaje.split("\n");

	if (lineas && lineas.length  && lineas.length > 2){
		lineas = lineas.slice(1, lineas.length);

		CargarDatosCombo(lineas);
	}

	//Cambiar titulo del combo
	ActualizarTituloCombo("Seleccione un dispositivo...");
}