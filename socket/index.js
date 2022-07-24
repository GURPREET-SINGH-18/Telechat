const io = require('socket.io')(8900,{
    cors:{
        origin: 'http://127.0.0.1:3000'
    },
});

let users=[]

const addUser = (userId,socketId) => {
    !users.some((user) => user.userId===userId)&&
    users.push({userId,socketId});
}
var i=0;

const removeUser = (socketId) => {
    users=users.filter((user) => user.socketId!==socketId)
}

const getUser = (userId)=>{
    return users.find((user) => user.userId===userId)
}

io.on("connection", (socket) => {
    //when connect
    console.log("a user connected "+Number(i=i+1)+" && "+socket.id)
    socket.on("addUser",(userId) => {
        addUser(userId,socket.id);
        io.emit("getUsers",users)
    })

    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text
        })
    })

    //when disconnect
    socket.on("disconnect", () =>{
        console.log("a user disconnected && "+socket.id)
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
})