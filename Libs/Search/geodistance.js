function getLatLong(city, state, dLocations){
    var city_state = city.trim() + "," + state.trim();
    if(!city_state in dLocations){
        return null;
    } 

    var latLong =  dLocations[city_state];
    if(!latLong){
        return null;
    }
    return { 
        lat:    latLong[0], 
        long:   latLong[1],
        city:   city,
        state:  state
    }
}

function getDistanceBoost(cityMatches, stateMatches, dLocations){
    if(cityMatches.length == 0 || stateMatches.length == 0){
        return null;
    }

    var distance = "";
    var locations = [];
    for(var i = 0; i < cityMatches.length; i++){
        var city = cityMatches[i].replace(/\s+/g, " ");
        for(var j = 0; j < stateMatches.length; j++){
            var state = stateMatches[j].replace(/\s+/g, " ");
            var latLong = getLatLong(city, state, dLocations);
            if(latLong){
                var latlongstr = latLong.lat.toString() + "," + latLong.long.toString();
                locations.push(latlongstr);
                var geodist = "geodist(" + fieldNames.location + " , " + latlongstr + ")";
                if(distance.length == 0){
                    distance = geodist;
                }
                else{
                    distance = "min(" + geodist + "," + distance + ")";
                }
            }
        }
    }
    if(distance == ""){
        return null;
    }
    return { 
        boost:      "div(1.0, min(1000, max(25, " + distance + ")))",
        distance:   distance,
        latlongs:   locations
    };
}