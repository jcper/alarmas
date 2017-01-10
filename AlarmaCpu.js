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
var limite=0.70;//carga cpu.
var limiteRam=1073741824;//1 Gb memoria libre
var dateAlarm=new Date().toTimeString();
var tiempo=10000;//cada minuto lanza el evento.
var WebSocket= require('ws');
var url='wss://agile-citadel-80189.herokuapp.com/';
var ws = new WebSocket(url);
//var myip = require('quick-local-ip');
var publicIp = require('public-ip');
var alarma='';
var AlarmStatus=false;
var myjson='';
var user=os.hostname();//nombre de usuario
var ip_publica=publicIp.v4().then(ip => {
    console.log(ip);
    ip_publica=ip;
    console.log(ip_publica);
    alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica};
  
});
 
 
 function Vigilante(limite){

if(limite!==0.01 && limiteRam!==0.01){

if(os.loadavg()[1]>limite){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 AlarmStatus=true// se produce alarma.
 alarma={"name":user,"alarma":1, "date":new Date().toTimeString(),"ip":ip_publica,};

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
alarma={"name":user,"alarma":2, "date":new Date().toTimeString(),"ip":ip_publica};

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
   alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica}//valores iniciales
}

 //si no hay alarma
 ee.on('datos', function Vigilante(limite){
 console.log('Alarma testeando' + AlarmStatus);
 });

  if(!AlarmStatus){
alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica};
console.log('ip'+ip_publica);
ws.on('message', function(message) {
myjson=JSON.stringify(alarma);
  ws.send(myjson);
   myjson='';
   console.log('cliente1: %s', message); 
    });
  }
 

  //Lanzamos el emisor de eventos
setInterval(function(){
 ee.emit('datos',Vigilante(limite));
  }, tiempo);

