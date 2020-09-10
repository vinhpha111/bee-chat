var jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET || 'secret'
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    // join to room
    socket.on('join', async (req) => {
      req = await require('./auth/getUserByToken')(req)
      if (req.user) {
        socket.join(req.user._id)
        req.status = 200
        delete req.token
        io.in(req.user._id).emit('updateSocketBeingEmit', req);
      }
    })
  });
}