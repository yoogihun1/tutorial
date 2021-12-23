import express from "express";
import http from "http";
import io from "socket.io";
const app = express(); 
const httpServer = http.createServer(app).listen(3000, () => { 
	console.log("포트 3000에 연결되었습니다."); 
}); 
const socketServer = io(httpServer); 

socketServer.on("connection", socket => { 
	console.log("connect client by Socket.io"); 
});
