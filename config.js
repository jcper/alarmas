var config = {
  db: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'codejobs',
    port: 3306,
    debug: true,
    //socket: '/var/run/mysqld/mysqld.sock', // For linux...
    socket: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock' //For mac...
  },
  site: {
    url: 'http://localhost:3000',
    title: 'Codejobs',
    language: 'en',
    html: {
      engine: 'jade',
      minify: false,
      bundle: true
    }
  },
  alarma:{
    agora:true,
    websocket:'wss://agile-citadel-80189.herokuapp.com/'
  },
  application: {
    controllers: {
      default: 'blog',
      current: ''
    },
    langs: ['en', 'es', 'fr', 'it', 'pt', 'ge', 'ch', 'jp'],
    languages: 'en|es|fr|it|pt|ge|ch|jp'
  },
  server: {
    environment: 'local',
    files: {
      filter: [
        'favicon.ico', 'img', 'js', 'images', 'stylesheets', 'css', 'themes'
      ]
    },
    debug: true
  }
};
 
module.exports = config;