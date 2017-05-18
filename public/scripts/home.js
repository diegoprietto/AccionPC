"use strict";

$(document).ready(function () {
	obtenerVolumenActual();
	obtenerMuteActual();
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
function obtenerVolumenActual(){
	EjecutarAjax(obtenerVolumenActualError, {"accion": "GV"}, obtenerVolumenActualOk);
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
function obtenerMuteActual(){
	EjecutarAjax(obtenerMuteActualError, {"accion": "GM"}, obtenerMuteActualOk);
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

function SilenciarError(){
	alert("Se produjo un error: " + response.Mensaje);
}

function SilenciarOk(mute){
		$("#loadingMute").removeClass("fa-volume-up").removeClass("fa-spin").removeClass("fa-spinner").addClass("fa-volume-up");
		$("#loadingContorno").removeClass("fa-ban").removeClass("text-danger").addClass("fa-square-o");

	if (mute){
		$("#loadingContorno").removeClass("fa-square-o").addClass("fa-ban").addClass("text-danger");
	}
}