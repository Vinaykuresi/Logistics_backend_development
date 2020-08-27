const db_uri = require('../db')

function getDevices() {

    const data = new Promise((resolve, reject) => {
        db_uri.connect().then((client)=>{
            try{
                client.db("__CONCOX__").collection("devices").find({},{projection:{_id:0}}).toArray(function (err, result) {
                    if (err) reject()
                    resolve(result)
                    });
                }catch(err){
                    reject()
                }
        })
        .catch(err => reject())
    })
    return data
}

module.exports.getDevices = getDevices;