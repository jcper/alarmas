//alarma de monitorizacion de procesos//

var os = require('os');
var ps = require('ps-nodejs');
// Child process is required to spawn any kind of asynchronous process
var childProcess = require("child_process");
var forever = require('forever-monitor');//utilizar forever-monitor
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

var rutaWINXP="..\\Program Files\\IGT Microelectronics\\Agora";
var rutaWINXPR=[];
var rutaWINXPretail="..\\Program Files\\IGT Microelectronics\\Agora retail";
var rutaWINXPretailR=[];
var rutaWIN7="..\\Program Files (x86)\\IGT Microelectronics\\Agora";
var rutaWIN7R=[];
var rutaWin7retail="..\\Program Files (x86)\\IGT Microelectronics\\Agora retail";
var rutaWin7retailR=[];
var rutaActual='';
var rutaActualR=[];
var alarma='';
var mensaje='';
var restaurar='';
var restaurarJson='';
var notificar='';
var notificarJson='';
var buscar='';
var buscarJson='';
var AlarmStatus1=false;//Flag de estado de cada alarma1 CPU
var AlarmStatus2=false;//Flag de estado de cada alarma2 RAM
var AlarmStatus4=false;//Flag de estado de la ruta de los ficheros.
var comando=false;
var conexion=false;
var myjson='';
var user=os.hostname();//nombre de usuario
var plataforma=os.platform();
var path=require("path");
 var child = new (forever.Monitor)('AlarmaCpu.js', {
    max: 3,
    silent: true,
    args: []
  });

 var ip_publica=publicIp.v4().then(ip => {
   console.log(ip);
   ip_publica=ip;
    console.log(ip_publica);
   alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica};
  
 });

 console.log("S.0: "+plataforma);



  //Comprobamos que los ficheros existen.
  function FijarPath(){
  if(plataforma==='win32'){
   fs.stat(rutaWINXP, function(err, stats) {
      if (err) {
        return console.error(err);
    }
      rutaActual=rutaWINXP;
      Buscarlic(rutaActual);
      if(rutaActualR.length<1){
      Buscarli1(rutaActual);
      };
       AlarmStatus4=true;
       console.log('Fichero existe win32'); 
    });  
  

  
     fs.stat(rutaWINXPretail, function(err, stats) {
       if (err) {
       return console.error(err);
    } 
      rutaActual=rutaWINXPretail;
      Buscarlic(rutaActual);
      if(rutaActualR.length<1){
      Buscarli1(rutaActual);
    };
      AlarmStatus4=true;
      console.log('Fichero existe win32retail');
   });
  
   
      fs.stat(rutaWIN7, function(err, stats) {
       if (err) {
       return console.error(err);
    } 
      rutaActual=rutaWIN7;
      Buscarlic(rutaActual);
      if(rutaActualR.length<1){
      Buscarli1(rutaActual);
    };
      AlarmStatus4=true;
      console.log('Fichero existe win7');
   });
      
    
      fs.stat(rutaWin7retail, function(err, stats) {
     if (err) {
     return console.error(err);
    } 
      rutaActual=rutaWINXPretail;
      Buscarlic(rutaActual);
      if(rutaActualR.length<1){
      Buscarli1(rutaActual);
    };
      AlarmStatus4=true;
      console.log('Fichero existe rutaWin7retail');
    });

  }
 };

 function Buscarlic(rutaActual){
  var p=rutaActual
   fs.readdir(p,function(err,files){
     if(err){
      throw err;
     }
     files.map(function(file){
       return path.join(p,file);
      }).filter(function(file){
        return fs.statSync(file).isFile();
      }).forEach(function(file){
        console.log("%s (%s)",file,path.basename(file));
        var str=path.basename(file);
        if(str.startsWith("lic")){
           console.log('fichero'+file);
           rutaActualR.push(file);
        };
      });

   });
 };
function Buscarli1(rutaActual){
     var p=rutaActual
   fs.readdir(p,function(err,files){
     if(err){
      throw err;
     }
     files.map(function(file){
       return path.join(p,file);
      }).filter(function(file){
        return fs.statSync(file).isFile();
      }).forEach(function(file){
        console.log("%s (%s)",file,path.basename(file));
        var str=path.basename(file);
        if(str.startsWith("li1")){
            console.log('fichero'+file);
           rutaActualR.push(file);
        };
      });

   });
 };

 function Vigilante(limite,limiteRam){
if(AlarmStatus4){
 console.log("stattus"+AlarmaStatus4);
if(limite!==0.01 && limiteRam!==0.01){

if(os.loadavg()[1]>limite){
 i++;//indice de registros
console.log('Carga Cpu: ' +os.loadavg()[1]);
console.log('Tiempo [ms]: '+os.uptime());
console.log('Memoria Total: ' + os.totalmem());
console.log('Memoria Libre: ' + os.freemem());
 AlarmStatus1=true// se produce alarma.
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
AlarmStatu2=true// se produce alarma.
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

 if(!AlarmStatus1 && !AlarmStatus2){
alarma={"name":user,"alarma":0,"date":new Date().toTimeString(),"ip":ip_publica};
  }

  if(AlarmStatus1 && AlarmStatus2){
alarma={"name":user,"alarma":3,"date":new Date().toTimeString(),"ip":ip_publica};
  }

  if(AlarmStatus2 && os.freemem()>limiteRam ){

    AlarmStatus2=false;//Se vuelve a restablecer el sistema sin alarmas
  }

  if(AlarmStatus1 && os.loadavg()[1]<limite){

  AlarmStatus1=false;
  }
}else{
  alarma={"name":user,"alarma":4,"date":new Date().toTimeString(),"ip":ip_publica};

 } 

}

//si no hay alarma
 ee.on('datos', function Vigilante(limite,limiteRam){
 console.log('Alarma testeando' + AlarmStatus4);
 //Si la conexion esta cerrada se reinicia
  if(ws.readyState===0){
    conexion==true;
   console.log(conexion+ws.readyState);
 }
 if( ws.readyState!==1 && !conexion){
    
    //Reiniciamos la conexion con un reiniciar.bat
   //var script_process = childProcess.spawn('reiniciar.bat',[],{env: process.env})// si fuera en windows.
      // Echoes any command output 
      // script_process.stdout.on('data', function (data) {
      //console.log('stdout: ' + data);
      // });

      // Error output
       //script_process.stderr.on('data', function (data) {
      // console.log('stderr: ' + data);
       //});
       // Process exit
      // script_process.on('close', function (code) {
      //console.log('child process exited with code ' + code);
      // });
      child.restart();
     console.log("reiniciamos servicio forever")
     var d = new Date();
      fs.appendFile('cliente.log',"reinicio forever: "+d.toUTCString(), function(err){
       if( err ){
        console.log( err );
      };
     });
      conexion=true;
  };

 });



 ws.on('open', function(){
  FijarPath();
  myjson=JSON.stringify(alarma);
  ws.send(myjson);
  console.log("cliente conectado");

  });

 ws.on('error', function (e) {
    console.log('cliente1 %d error: %s', e.message);
    var d = new Date();
    fs.appendFile('cliente.log',e.message+d.toUTCString(), function(err) {
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
            
            //Sustituye todos los li1 por lic
        
          for(i=0; i<=rutaActualR.length; i++){
           console.log('licencia1'+rutaActualR[i]);
           var ruta=rutaActualR.pop(); 
           oldPath=ruta,
           newPath=ruta.replace("li1","lic");
           console.log('licencia'+rutaActualR.pop()); 
         fs.rename(oldPath, newPath, function(err){
          if(err) throw err;
        });
       var script_process = childProcess.spawn('restauracion.bat',[],{env: process.env})// si fuera en windows.
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

       };
       
           console.log(mensaje.comando);
          restaurar={"name":user,"comando":'restaurar',"date":new Date().toTimeString(),"ip":ip_publica};
          restaurarJson=JSON.stringify(restaurar);
          for( i=0; i<30; i++ ){
           ws.send(restaurarJson);
           }
          comando=false;
         
       }

      if(mensaje.user===user && mensaje.comando==='desactivar'){
        console.log(message.comando);
        comando=true;//Solo envia el mensaje una vez
       // This line initiates bash
       //var script_process = childProcess.spawn('/bin/bash',["test.sh"],{env: process.env});
      var script_process = childProcess.spawn('desactivacion.bat',[],{env: process.env})// si fuera en windows.
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
       
       //Sustituye todos los lic por li1
          for(i=0; i<=rutaActualR.length; i++){
           console.log('licencia1'+rutaActualR[i]);
           var ruta=rutaActualR.pop(); 
           oldPath=ruta,
           newPath=ruta.replace("lic","li1");
           console.log('licencia'+rutaActualR.pop()); 
         fs.rename(oldPath, newPath, function(err){
          if(err) throw err;
        });

       };
    
       desactivar={"name":user,"comando":'desactivar',"date":new Date().toTimeString(),"ip":ip_publica};
        notificarJson=JSON.stringify(desactivar);
        for( i=0; i<30; i++ ){
        ws.send(notificarJson);
         }   
        comando=false;
      };

       if(mensaje.user===user && mensaje.comando==='notificar'){
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

      
       notificar={"name":user,"comando":'notificar0',"date":new Date().toTimeString(),"ip":ip_publica};
        notificarJson=JSON.stringify(notificar);
        for( i=0; i<30; i++ ){
        ws.send(notificarJson);
         }   
        comando=false;
      };

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

