const app=require("express")();
const server = require("http").createServer(app);

const cors=require("cors");



const io = require("socket.io")(server, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());


app.get("/", (req, res)=>{
    res.send("Server is now Active!");
})

io.on("connection", (socket)=>{
    socket.emit("me", socket.id);

    socket.on("disconnect", ()=>{
        socket.broadcast.emit("callended");
    });

    socket.on("callUser", ({userToCall, signalData, from, name})=>{
        io.to(userToCall).emit("callUser", {signal: signalData, from , name});
    });

    socket.on("answerCall", (data)=>{

        io.to(data.to).emit("callAccepted", data.signal);
    });


});


const PORT= process.env.PORT || 5000;
server.listen(PORT, ()=>{
    console.log("Server started at port:", PORT);
})