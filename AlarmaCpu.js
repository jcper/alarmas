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
var limite=0.80;
var tiempo=10000;
var  WebSocket= require('ws');
var url='ws://localhost:3000/';
var ws = new WebSocket(url);
 
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
if(limite!==0.01){
if(os.loadavg()[0]>limite){
 i++;
console.log('Carga Cpu : '+os.loadavg()[0]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 ps.lookup({
    command: 'ps',
    psargs: ' -aux'
    }, function(err, resultList ) {
    if (err) {
        throw new Error( err );
    }

    resultList.forEach(function( process ){
        if( process ){
            console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
        }
    });
});

console.log('Sobrecarga cpu hace 1 minuto'+' Registro: '+i); 
 }
if(os.loadavg()[1]>limite){
 i++;
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 ps.lookup({
    command: 'ps',
    psargs: ' -aux'
    }, function(err, resultList ) {
    if (err) {
        throw new Error( err );
    }

    resultList.forEach(function( process ){
    if( process ){
  var data=' Carga Cpu:' +os.loadavg()[1]+' Tiempo [ms]:'+os.uptime()+' Memoria Total:' + os.totalmem()+' Memoria Libre: ' + os.freemem()+' PID:' + process.pid + ' COMMAND:' + process.command + ' ARGUMENTS:' +
  process.arguments+ '\n';

   fs.appendFile('Alarma.log',data, function(err) {
    if( err ){
        console.log( err );
    }
   
});
 console.log( 'PID: %s, COMMAND: %s, ARGUMENTS: %s', process.pid, process.command, process.arguments );
        }
    });
});


console.log('Sobrecarga cpu hace 5 minutos'+' Registro: '+i);
}
if(os.loadavg()[2]>limite){
 i++;
 console.log('Carga Cpu: '+os.loadavg()[2]);
 console.log('Tiempo [ms]: '+os.uptime());
 console.log('Memoria Total: ' + os.totalmem())
 console.log('Memoria Libre: ' + os.freemem());
 console.log('Sobrecarga cpu hace 15 minutos'+' Registro: '+i);
  }
 }
}
  if(limite!==0.01){
 ee.on('datos', function Vigilante(limite){
 console.log('Alarma sobrecarga funcionando testeando');
 ws.on('message', function() {
    ws.send('AlarmaPrueba funcionando');
 });

 }); 

 setInterval(function(){
 ee.emit('datos',Vigilante(limite));
  }, tiempo);
}
