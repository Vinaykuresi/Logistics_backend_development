const db_uri = require('../db')

function getLocations(deviceId,page=1) {

    const data = new Promise((resolve, reject) => {
        db_uri.connect().then((client)=>{
            try{
                var startIndex = (parseInt(page)-1)*10
                client.db("__CONCOX__").collection("status").find({"device":deviceId,"tag":"GPS Location Packet"}, {projection:{"_id":0}}).skip(startIndex).limit(10).toArray(function (err, result) {
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

module.exports.getLocations = getLocations;