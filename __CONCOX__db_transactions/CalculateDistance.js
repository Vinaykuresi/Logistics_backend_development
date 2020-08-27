Number.prototype.toRad = function(degrees) { return degrees * (Math.PI / 180); };
  
const earthRadiusKm = 6371;

async function distanceInKmBetweenEarthCoordinates(currentGps, pastGps) {
    return new Promise((resolve, reject) => {
        try{
            var dLat = Number.prototype.toRad(currentGps[0]-pastGps[0]);
            var dLon = Number.prototype.toRad(currentGps[1]-pastGps[1]);

            lat1 = Number.prototype.toRad(currentGps[0]);
            lat2 = Number.prototype.toRad(pastGps[0]);

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

            resolve(earthRadiusKm * c * 1000)

        }catch(err){
            reject()
        }
    })
}

module.exports.distanceInKmBetweenEarthCoordinates = distanceInKmBetweenEarthCoordinates;

