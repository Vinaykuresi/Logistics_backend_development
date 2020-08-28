
// MongoDb uri for db transactions
const MongoClient = require('mongodb').MongoClient;
module.exports = new MongoClient("Connect your DB URl", 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });