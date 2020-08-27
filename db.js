
// MongoDb uri for db transactions
const MongoClient = require('mongodb').MongoClient;
module.exports = new MongoClient("mongodb+srv://backendconcoxdeveloper:V3jUV7QXqEoAtnhy@cluster0-zhjde.mongodb.net", 
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });