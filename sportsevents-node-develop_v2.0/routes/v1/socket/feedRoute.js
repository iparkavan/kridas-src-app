const express = require('express');
const { createFeeds } = require('./../../../controllers/feeds.controller');


function socketRouter(io) {
    const router = express.Router();

    const socketIOMiddleware = (req, res, next) => {
        req.io = io;
        next();
    };
    router.post('/feeds',
        socketIOMiddleware,
        createFeeds
    )
    // console.log("check ioData", io.socket)
    // let onlineUsers = [];

    // const addNewUser = (username, socketId) => {
    //     !onlineUsers.some((user) => user.username === username) &&
    //         onlineUsers.push({ username, socketId });
    // };

    // const removeUser = (socketId) => {
    //     onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    // };

    // const getUser = (username) => {
    //     return onlineUsers.find((user) => user.username === username);
    // };

    // io.on("connection", (socket) => {
    //     socket.on("newUser", (username) => {
    //         console.log("check username::", username)
    //         addNewUser(username, socket.id);
    //         if (onlineUsers.length > 0 && onlineUsers) {
    //             for (let user of onlineUsers) {
    //                 if (username !== user.username) {
    //                     const receiver = getUser(user.username);
    //                     io.to(receiver?.socketId).emit("getNotification", {
    //                         username
    //                     });
    //                 }
    //             }
    //         }
    //     });

    //     socket.on("disconnect", () => {
    //         removeUser(socket.id);
    //     });

    // })

    return router;
}

module.exports = socketRouter