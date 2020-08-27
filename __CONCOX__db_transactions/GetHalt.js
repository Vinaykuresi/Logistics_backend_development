const db_uri = require('../db')
var calculateDistance = require('./CalculateDistance')
const deviceIds = require('../devices_list/Devices_id.json')
const haltedDevices = []

module.exports = class Gethalt {

    constructor(){
        this.distance = 0, this.totalTime = 0
        this.result = {'totalHalts':0,'haltCoOrdiantes':[]}
    }

    locationsResult = async (deviceId) => {
        return await new Promise((resolve, reject) => {
        db_uri.connect().then((client)=>{
                try{
                    client.db("__CONCOX__").collection("status").find({"device":deviceId,"tag":"GPS Location Packet"},{projection:{_id:0,time:1,gps:1}}).limit(50).toArray((err, result)=>{
                        resolve(result)
                    })
                }
                catch(err){
                    console.log(err)
                    reject()
                }
            })
        })
    }

    calculateTimeDifference = async (initialObservedtime, currentObservedtime) => {
        return (Date.parse(initialObservedtime) - Date.parse(currentObservedtime))/(1000*60)
    }

    haltStatus = async (deviceId) => {
        var halted = 1; this.result = {'totalHalts':0,'haltCoOrdiantes':[]}
        return new Promise(async (resolve, reject)=>{
            await this.locationsResult(deviceId)
            .then(async (locationAndTimeDetails)=>{
                for(var i=1;i<locationAndTimeDetails.length;i++) {
                    await calculateDistance.distanceInKmBetweenEarthCoordinates(locationAndTimeDetails[i-1].gps, locationAndTimeDetails[i].gps)
                    .then(async (locationRadius)=>{
                        let minutes = await this.calculateTimeDifference(locationAndTimeDetails[i-1].time, locationAndTimeDetails[i].time)
                        this.totalTime += minutes
                        this.distance += locationRadius
                        if(this.totalTime >=25){
                            if(this.distance < 40){
                                if(halted){
                                    await new Promise((resolve, reject)=> resolve(this.result.haltCoOrdiantes.push([(locationAndTimeDetails[i].gps[0]+locationAndTimeDetails[i-1].gps[0])/2,(locationAndTimeDetails[i].gps[1]+locationAndTimeDetails[i-1].gps[1])/2])))
                                    .then(()=>{
                                        this.result.totalHalts +=1;
                                        halted = 0
                                    }, (err)=>reject(err))
                                    
                                }else{
                                    let position = this.result.haltCoOrdiantes.length-1
                                    await new Promise((resolve, reject)=> resolve([(locationAndTimeDetails[i].gps[0]+this.result.haltCoOrdiantes[position][0])/2, (locationAndTimeDetails[i].gps[1]+this.result.haltCoOrdiantes[position][1])/2]))
                                    .then((meanPoints)=>{
                                        this.result.haltCoOrdiantes[position] = meanPoints
                                    }, (err)=>reject(err))
                                }
                            }
                            else{
                                this.distance = 0;
                                this.totalTime = 0;
                                halted = 1
                            }
                        }
                        // console.log("Final result",this.result, this.distance, this.totalTime)
                    })
                    .catch(err=> reject(err))
                }
            })
            .then(()=> resolve(this.result))
            .catch(err=> reject(err))
            })
    }

}

