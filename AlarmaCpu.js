//alarma de monitorizacion de procesos//

var os = require('os');
var ps = require('ps-nodejs');
// Child process is required to spawn any kind of asynchronous process
var childProcess = require("child_process");
var eventos = require('events');
var process= require('process');
var util = require('util');
var stdio = require('stdio');
var fs = require('fs');
var i=0;
var DateNot;
var EmisorEventos = eventos.EventEmitter;
var ee=new EmisorEventos();
var readline = require('readline');
var publicIp = require('public-ip');
var limite=0.70;//carga cpu.
var limiteRam=1073741824;//1 Gb memoria libre
var tiempo=30000;//cada 30 segundos lanza el evento.
var WebSocket= require('ws');
var url='wss://agile-citadel-80189.herokuapp.com/';
var ws = new WebSocket(url);

var rutaWINXP="..\\Program Files\\IGT Microelectronics\\Agora\\lic_00000-00000-00000-00000-00000.xml";
var rutaWINXPR="..\\Program Files\\IGT Microelectronics\\Agora\\li1_00000-00000-00000-00000-00000.xml";
var rutaWINXPretail="..\\Program Files\\IGT Microelectronics\\Agora retail\\lic_00000-00000-00000-00000-00000.xml";
var rutaWINXPretailR="..\\Program Files\\IGT Microelectronics\\Agora retail\\li1_00000-00000-00000-00000-00000.xml";
var rutaWIN7="..\\Program Files (x86)\\IGT Microelectronics\\Agora\\lic_00000-00000-00000-00000-00000.xml";
var rutaWIN7R="..\\Program Files (x86)\\IGT Microelectronics\\Agora\\li1_00000-00000-00000-00000-00000.xml";
var rutaWin7retail="..\\Program Files (x86)\\IGT Microelectronics\\Agora retail\\lic_00000-00000-00000-00000-00000.xml";
var rutaWin7retailR="..\\Program Files (x86)\\IGT Microelectronics\\Agora retail\\li1_00000-00000-00000-00000-00000.xml";
var rutaActual='';
var rutaActualR='';
var alarma='';
var mensaje='';
var restaurar='';
var restaurarJson='';
var notificar='';
var notificarJson='';
var buscar='';
var buscarJson='';
var AlarmStatus=false;
var comando=false;
var myjson='';
var user=os.hostname();//nombre de usuario
var plataforma=os.platform();

 var ip_publica=publicIp.v4().then(ip => {
   console.log(ip);
   ip_publica=ip;
    console.log(ip_publica);
   alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica};
  
 });

 console.log("S.0: "+plataforma);

  //Comprobamos que los ficheros existen.
  if(plataforma==='win32'){
   fs.stat(rutaWINXP, function(err, stats) {
      if (err) {
        return console.error(err);
    }
      rutaActual=rutaWINXP;
      rutaActualR=rutaWINXPR;
       console.log('Fichero existe win32'); 
    });  
  

  
     fs.stat(rutaWINXPretail, function(err, stats) {
       if (err) {
       return console.error(err);
    } 
      rutaActual=rutaWINXPretail;
      rutaActualR=rutaWINXPR;
      console.log('Fichero existe win32retail');
   });
  
   
      fs.stat(rutaWIN7, function(err, stats) {
       if (err) {
       return console.error(err);
    } 
      rutaActual=rutaWIN7;
      rutaActualR=rutaWIN7R;
      console.log('Fichero existe win7');
   });
      
    
      fs.stat(rutaWin7retail, function(err, stats) {
     if (err) {
     return console.error(err);
    } 
      rutaActual=rutaWINXPretail;
      rutaActualR=rutaWINXPretailR;
      console.log('Fichero existe rutaWin7retail');
    });

  }
 
 function Vigilante(limite,limiteRam){

if(limite!==0.01 && limiteRam!==0.01){

if(os.loadavg()[1]>limite){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 AlarmStatus=true// se produce alarma.
 alarma={"name":user,"alarma":1, "date":new Date().toTimeString(),"ip":ip_publica,};

 if(i<10){
 	var data={};
   data=alarma.name+alarma.alarma+alarma.date+alarma.ip;
 	 fs.appendFile('Alarma.txt',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }else{
  //borramos fichero y luego lo creamos con el registro 
   fs.unlink('Alarma.txt', (err) => {
  if (err) throw err;
  console.log('successfully deleted Alarma.log');
   });

   //luego lo creamos con el registro 1
   i=1;
 	 fs.appendFile('Alarma.txt',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }

  console.log('Sobrecarga cpu hace 5 minutos'+' Registro: '+i);
 }



if(os.freemem()<limiteRam){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
AlarmStatus=true// se produce alarma.
alarma={"name":user,"alarma":2, "date":new Date().toTimeString(),"ip":ip_publica};

if(i<10){
 	var data={};
  data=alarma.name+alarma.alarma+alarma.date+alarma.ip;
 	 fs.appendFile('Alarma.txt',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }else{
  //borramos fichero y luego lo creamos con el registro 
   fs.unlink('Alarma.txt', (err) => {
  if (err) throw err;
  console.log('successfully deleted Alarma.log');
   });

   //luego lo creamos con el registro 1
   i=1;
 	 fs.appendFile('Alarma.txt',data, function(err) {
    if( err ){
        console.log( err );
    }
  });
 }
 console.log('Memoria Ram Libre  hace 5 minutos'+' Registro: '+i);
   }
 }
 if(!AlarmStatus){
alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica};
  }
} 


//Se resetea AlarmStatus

if(AlarmStatus && os.freemem()>limiteRam && os.loadavg()[1]<limite){

    AlarmStatus=false;//Se vuelve a restablecer el sistema sin alarmas
   alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica}//valores iniciales
}

 //si no hay alarma
 ee.on('datos', function Vigilante(limite,limiteRam){
 console.log('Alarma testeando' + AlarmStatus);
 //Si la conexion esta cerrada se reinicia
 if(ws.readyState!==1){
    
    //Reiniciamos la conexion con un reiniciar.bat
   var script_process = childProcess.spawn('reiniciar.bat',[],{env: process.env})// si fuera en windows.
      // Echoes any command output 
       script_process.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
       });

      // Error output
       script_process.stderr.on('data', function (data) {
       console.log('stderr: ' + data);
       });
       // Process exit
       script_process.on('close', function (code) {
      console.log('child process exited with code ' + code);
       });
     console.log("reiniciamos servicio windows")
  }

 });


 if(ws.readyState===3 || ws.readyState===1 || ws.readyState===0 || ws.readyState===2){
 ws.on('open', function(){
  alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica}
  myjson=JSON.stringify(alarma);
  ws.send(myjson);
  console.log("cliente conectado");

  });
}
 ws.on('error', function (e) {
    console.log('cliente1 %d error: %s', e.message);
    fs.appendFile('Alarma.txt',e.message, function(err) {
    if( err ){
        console.log( err );
    }
     });
  });

ws.on('message', function(message) {
myjson=JSON.stringify(alarma);
    ws.send(myjson);
   console.log('cliente1: %s', message); 
    mensaje=JSON.parse(message);
   
     console.log('usuario: '+mensaje.user);
      
       if(mensaje.user===user && mensaje.comando==='restaurar'){
           comando=true;//Solo envia el mensaje una vez
           oldPath=rutaActualR
           newPath=rutaActual;
       fs.rename(oldPath, newPath, function(err){
          if(err) throw err;
         });
           console.log(mensaje.comando);
          restaurar={"name":user,"comando":'restaurar',"date":new Date().toTimeString(),"ip":ip_publica};
          restaurarJson=JSON.stringify(restaurar);
          for( i=0; i<30; i++ ){
           ws.send(restaurarJson);
           }
          comando=false;
         
       }

      if(mensaje.user===user && mensaje.comando==='notificar'  ){
        console.log(message.comando);
        comando=true;//Solo envia el mensaje una vez
       // This line initiates bash
       //var script_process = childProcess.spawn('/bin/bash',["test.sh"],{env: process.env});
      var script_process = childProcess.spawn('notificacion.bat',[],{env: process.env})// si fuera en windows.
      // Echoes any command output 
       script_process.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
       });

      // Error output
       script_process.stderr.on('data', function (data) {
       console.log('stderr: ' + data);
       });
       // Process exit
       script_process.on('close', function (code) {
      console.log('child process exited with code ' + code);
       });

           oldPath=rutaActual,
           newPath=rutaActualR;
           
       fs.rename(oldPath, newPath, function(err){
          if(err) throw err;
         });
       notificar={"name":user,"comando":'notificar',"date":new Date().toTimeString(),"ip":ip_publica};
        notificarJson=JSON.stringify(notificar);
        for( i=0; i<30; i++ ){
        ws.send(notificarJson);
         }   
        comando=false;
      }

       if(mensaje.user===user && mensaje.comando==='buscar' || mensaje.comando==='buscar' && mensaje.user==='ALL' ){
        console.log(message.comando);
         comando=true;//Solo envia el mensaje una vez
        buscar={"name":user,"comando":'buscar',"date":new Date().toTimeString(),"ip":ip_publica};
        buscarJson=JSON.stringify(buscar);

         for( i=0; i<30; i++ ){
        ws.send(buscarJson);
         }   
        
       
        comando=false;
      }
       console.log(comando);
       
    });
  
   

  //Lanzamos el emisor de eventos
setInterval(function(){
 ee.emit('datos',Vigilante(limite,limiteRam));
  }, tiempo);

