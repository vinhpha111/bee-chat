var jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'secret'
module.exports = (io) => {
  global.io = io
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    // join to room
    socket.on('join', async (req) => {
      const room = req.room
      req = await require('./auth/getUserByToken')(req)
      if (req.user) {
        if (room) {
          socket.join(room)
          req.room = room
        } else {
          socket.join(req.user._id)
        }
        req.status = 200
        delete req.token
        io.in(req.user._id).emit('updateSocketBeingEmit', req);
      }
    })

    // leave room
    socket.on('leave', async (req) => {
      const room = req.room
      req = await require('./auth/getUserByToken')(req)
      if (req.user) {
        if (room) {
          socket.leave(room)
          req.room = room
        } else {
          socket.leave(req.user._id)
        }
        req.status = 200
        delete req.token
        io.in(req.user._id).emit('updateSocketBeingEmit', req);
      }
    })
  });
}