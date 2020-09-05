const path = require('path')
const glob = require("glob")
require('dotenv').config()
const configDB = require('../config')
const mongoose = require('mongoose');
async function seed() {
    // connect mongodb
    var mongoDB = configDB.url.replace('@username', configDB.username).replace('@password', configDB.password).replace('@db', configDB.db);
    await mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    glob("database/seed/data/*.js", {}, async function (er, files) {
        let arrInputFile = process.argv.slice(2)
        for(let index in files) {
            if (arrInputFile.length > 0 && (arrInputFile.indexOf(path.basename(files[index])) === -1)) {
                continue
            }
            await require('../../'+files[index])()
            console.info(`Migrate ${files[index]} done!...`)
        }
        process.exit()
    })
}

seed()