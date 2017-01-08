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
var limite=0.2;//carga cpu.
var limiteRam=1073741824;//1 Gb memoria libre
var dateAlarm=new Date().toTimeString();
var tiempo=10000;//cada minuto lanza el evento.
var WebSocket= require('ws');
var url='ws://localhost:3001/';
var ws = new WebSocket(url);
var user='equipo1';//nombre de usuario
var alarma='';
var AlarmStatus=false;
var myjson='';

 
 function Vigilante(limite){
if(limite!==0.01 && limiteRam!==0.01){

if(os.loadavg()[1]>limite){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 AlarmStatus=true// se produce alarma.
 alarma={"name":user,"alarma":1, "date":new Date().toTimeString()};

 if(i!==10){
 	var data=alarma;
 	 fs.appendFile('Alarma.log',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }else{
  //borramos fichero y luego lo creamos con el registro 
   fs.unlink('Alarma.log', (err) => {
  if (err) throw err;
  console.log('successfully deleted Alarma.log');
   });

   //luego lo creamos con el registro 1
   i=1;
 	 fs.appendFile('Alarma.log',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }

  console.log('Sobrecarga cpu hace 5 minutos'+' Registro: '+i);
 }



if(os.freemem()>limiteRam){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
AlarmStatus=true// se produce alarma.
alarma={"name":user,"alarma":2, "date":new Date().toTimeString()};

if(i!==10){
 	var data=alarma;
 	 fs.appendFile('Alarma.log',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }else{
  //borramos fichero y luego lo creamos con el registro 
   fs.unlink('Alarma.log', (err) => {
  if (err) throw err;
  console.log('successfully deleted Alarma.log');
   });

   //luego lo creamos con el registro 1
   i=1;
 	 fs.appendFile('Alarma.log',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }
 console.log('Memoria Ram Libre  hace 5 minutos'+' Registro: '+i);
   }
 }
} 


//Se resetea AlarmStatus

if(AlarmStatus && os.freemem()<limiteRam && os.loadavg()[1]<limite){

    AlarmStatus=false;//Se vuelve a restablecer el sistema sin alarmas
   alarma={"name":user,"alarma":0, "date":new Date().toTimeString()}//valores iniciales
}

 //si no hay alarma
 ee.on('datos', function Vigilante(limite){
 console.log('Alarma testeando' + AlarmStatus);
  });

  if(!AlarmStatus){
alarma={"name":user,"alarma":0, "date":new Date().toTimeString()};
ws.on('message', function(message) {
myjson=JSON.stringify(alarma);
  ws.send(myjson);
   console.log('cliente: %s', message); 
    });
  }
  if(AlarmStatus && os.loadavg()[1]>limite ){
  console.log('Alarma 1'); 	
 alarma={"name":user,"alarma":1, "date":new Date().toTimeString()};
ws.on('message', function(message) {
  myjson=JSON.stringify(alarma);
  ws.send(myjson);
  console.log('cliente: %s', message); 
    });
  }
   if(AlarmStatus && os.freemem()>limiteRam ){
   	console.log('Alarma 2'); 	
 alarma={"name":user,"alarma":2, "date":new Date().toTimeString()};
ws.on('message', function(message) {
 myjson=JSON.stringify(alarma);
  ws.send(myjson);
   console.log('cliente: %s', message);
    });
  }
 

   
     
 

 //Lanzamos el emisor de eventos
setInterval(function(){
 ee.emit('datos',Vigilante(limite));
  }, tiempo);

