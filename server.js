const express = require('express')
const app = express()
const http = require('http').createServer(app);
const path = require('path');
var io = require('socket.io')(http);
require('dotenv').config()
const port = process.env.PORT || 4000
if (process.env.ENV && process.env.ENV !== 'production') {
  var cors = require('cors')
  app.use(cors())
}

const apiRouter = require('./api-router')
const configDB = require('./database/config')
var mongoose = require('mongoose');
// connect mongodb
var mongoDB = configDB.url.replace('@username', configDB.username).replace('@password', configDB.password).replace('@db', configDB.db);
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.once('open', function() {
  console.info('connected db!')
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/api', apiRouter)
app.use(express.static('front-end/dist'))
app.get('/*',function(req,res) {
  res.sendFile(path.join(__dirname+'/front-end/dist/index.html'));
});

require('./socket')(io)

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});