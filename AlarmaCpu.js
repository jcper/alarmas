//alarma de monitorizacion de procesos//

var os = require('os');
var ps = require('ps-nodejs');
var eventos = require('events');
var process= require('process');
var util = require('util');
var stdio = require('stdio');
var fs = require('fs');
var i=0;
var EmisorEventos = eventos.EventEmitter;
var ee=new EmisorEventos();
var readline = require('readline');
var limite=0.80;//carga cpu.
var limiteRam=1073741824;//1 Gb memoria libre

var tiempo=100000;//cada minuto lanza el evento.
var WebSocket= require('ws');
var url='ws://localhost:3000/';
var ws = new WebSocket(url);
var user=os.userInfo([username]);
var alarma={"name":user,"alarma":0, "date":new date().toString()}//valores iniciales
var myJSON=JSON.stringify(alarma);//valores iniciales
var AlarmStatus=false;

 
 var options = stdio.getopt({
	'limite': {
		key: 'l',
		description: 'limite de alarma cpu[0.02...0.99]',
		args: 1
	},
	'tiempo': {
		key: 't',
		description: 'tiempo de testeo',
		args: 2
	}
	
});

//limite=options.limite;
//tiempo=options.tiempo;

function Vigilante(limite){
if(limite!==0.01 && limiteRam!==0.01){

if(os.loadavg()[1]>limite){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 AlarmStatus=true// se produce alarma.
 alarma={"name":user,"alarma":1, "date":new date().toString()};
console.log('Sobrecarga cpu hace 5 minutos'+' Registro: '+i);
}

if(os.freemem()>limiteRam){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
AlarmStatus=true// se produce alarma.
var 
alarma={"name":user,"alarma":2, "date":new date().toString()};

 console.log('Memoria Ram Libre  hace 5 minutos'+' Registro: '+i);
}
  }
}

//Se resetea AlarmStatus

if(AlarmStatus=true && os.freemem()<limiteRam && os.loadavg()[1]<limite){

    AlarmStatus=false;//Se vuelve a restablecer el sistema sin alarmas
   alarma={"name":user,"alarma":0, "date":new date().toString()}//valores iniciales
}


  if(limite!==0.01 && AlarmStatus==false){
 ee.on('datos', function Vigilante(limite){
 console.log('Alarma sobrecarga funcionando testeando');
 ws.on('message', function() {
    ws.send(myJSON);
 });

 }); 

 setInterval(function(){
 ee.emit('datos',Vigilante(limite));
  }, tiempo);
}
