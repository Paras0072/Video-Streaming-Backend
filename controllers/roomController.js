const express = require("express");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid"); // For generating room IDs
const User = "../models/user";

// array for room
const rooms = {};
// Create a room
module.exports.createRoom = async (req, res) => {
  
  try {
    console.log("Create room request received:", req.headers["x-auth-token"]);
    const roomId = uuidv4(); // Generate a unique room ID
    rooms[roomId] = []; // Create an empty room

    // for saving data in database
    const room = new Room({ roomId, users: [req.user] });
    await room.save();

    console.log(`Room created with ID: ${roomId}`);
    // sending the data
    res.status(201).json(room);
   } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Join a room
module.exports.joinRoom = async (req, res) => {
  const { roomId } = req.body;

  try {
    console.log("Join room request received:", req.headers["x-auth-token"]);
   // checking if rooomId present in the array or not
    if (rooms[roomId]) {
      res.status(200).json({ roomId: roomId });
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};



// Handle WebSocket signaling messages
module.exports.handleSignalingData = (ws, message) => {
  switch (message.type) {
    case "join-room":
      joinRoom(ws, message.roomId);
      break;
    case "offer":
    case "answer":
    case "candidate":
      relayMessage(ws, message);
      break;
    default:
      break;
  }
};

// Join an existing room and associate the WebSocket client with the room
const joinRoom = (ws, roomId) => {
  if (rooms[roomId]) {
    ws.roomId = roomId;
    rooms[roomId].push(ws);
    console.log(`Client joined room ${roomId}`);
  } else {
    ws.send(JSON.stringify({ type: "error", message: "Room does not exist" }));
  }
};

// Relay signaling messages between clients in the same room
const relayMessage = (ws, message) => {
  const room = rooms[ws.roomId];
  if (room) {
    room.forEach((client) => {
      if (client !== ws) {
        client.send(JSON.stringify(message));
      }
    });
  }
};

// Remove client from the room when they disconnect
module.exports.leaveRoom = (ws) => {
  const roomId = ws.roomId;
  if (roomId && rooms[roomId]) {
    rooms[roomId] = rooms[roomId].filter((client) => client !== ws);
    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
      console.log(`Room ${roomId} deleted`);
    }
  }
};
