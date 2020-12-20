const app = require('./app');
const http = require('http');
const { join } = require('path');
const server = http.createServer(app);
const io = require('socket.io');
const socketIO = io(server);

socketIO.listen(server.listen(3000));

const unAssignedDrivers = socketIO.of('/unassigned-drivers');
unAssignedDrivers.on('connection',socket=>{
    console.log(socket.id+' joined unassigned drivers');
    socket.on('find-drivers',(body)=>{
        const {drivers, locationData, userData } = JSON.parse(body);
        let joinedRoom = false;
        socket.join(userData.key);
        console.log("FOUND THESE SOCKETS OF DRIVERS");
        console.log(drivers);

        if(drivers){
            for(let id of drivers){
                if(typeof(id)==="string"){
                    console.log('Finding Socket With Driver Id:' +id);
                    // console.log(unAssignedDrivers.connected[id]);
                    let driverSocket = unAssignedDrivers.connected[id];
                    if(driverSocket){
                        driverSocket.join(userData.key);
                        joinedRoom = true;
                    }
                    else{
                        joinedRoom = false;
                    }
                }
            }
            if(joinedRoom){
                const body = {
                    locationData,
                    userData
                }
                
                socket.to(userData.key).broadcast.emit('new-request', JSON.stringify(body));
            }
        }
    });
    socket.on('driver-accepted', (Body)=>{
        let {UserKey,DriverKey,UserSocket,DriverSocket} = JSON.parse(Body);
        console.log('Driver Has Accepted The Request!');
        DriverSocket = unAssignedDrivers.connected[DriverSocket];
        UserSocket = unAssignedDrivers.connected[UserSocket];
        console.log(UserKey, DriverKey, UserSocket, DriverSocket);
        DriverSocket.join(DriverKey);
        UserSocket.join(DriverKey);
        DriverSocket.to(DriverKey).emit('startRide',(DriverKey))
    });
    socket.on('startRide',()=>{

    });
});