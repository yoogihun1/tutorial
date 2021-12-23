const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/dataSource.js');
const connection = mysql.createConnection(dbconfig);

const server = express();

server.use('/js',express.static(__dirname + "/js"));

server.get("/", (req, res) => {
 
  res.sendFile(__dirname + "/index.html");
});

server.get("/carInfo", (req, res) => {
  res.sendFile(__dirname + "/views/carInfo.html");
});



// app.set('view engine','ejs');
// app.set('views','./views');

// // configuration =========================
// app.set('port', process.env.PORT || 3000);

// app.get('/', (req, res) => {
//   res.send('Root');
// });

var http = require("http").createServer(server);
var io = require('socket.io')(http);

var port = 3000;
http.listen(port, () => {
  console.log("listening on *:" + port);
});

let onlinePeople = Array();

io.on('connection', function (socket) {
    onlinePeople.push(socket.id);
  console.log(socket.id, 'Connected');
  io.emit('new_connect', socket.id);
  
  socket.on('msg', function (data) {
    console.log(socket.id, data);
    io.emit('msg', `${socket.id} : ${data}`);
  });

  socket.on('disconnect',function(){
      console.log(socket.id+'접속 종료');
      io.emit('new_disconnect', socket.id);
    });

    
  });



