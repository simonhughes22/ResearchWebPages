
function createMap(){
    return new Datamap({

		element: document.getElementById("map"),
		geographyConfig: {
			popupOnHover: false,
			highlightOnHover: false
		},
		fills: {
			defaultFill: '#ddd',
			red : 'red',
			blue: 'blue',
		},
		scope: 'usa'        
	});
}

function updateMap(bubble_map, docs, fillkey)
{
    if(fillkey == "blue" && bubble_map.red_bubbles){
        var bubbles = bubble_map.red_bubbles.slice();
    }
    else{
        var bubbles = [];
        bubble_map.red_bubbles = bubbles;
    }
    for(var i = 0; i < docs.length;i++)
    {
        var doc = docs[i];
        if(doc.location)
        {
            // only show the top 1000 results, otherwise we see results all over the country
            bubbles.push(createBubble(doc, fillkey));
        }
    }
    
    bubble_map.bubbles(
      bubbles, {
        popupOnHover: false,
        borderWidth: 0,
        borderColor: '#FFFFFF',

        fillOpacity: 0.5,
        highlightOnHover: true,
        highlightFillColor: 'yellow',
        highlightBorderColor: '#FFFFFF',
        highlightBorderWidth: 2,
        highlightFillOpacity: 0.85
    });
}

function createBubble(doc, fillkey){
    var locn = doc.location.split(",");
    
    return { 
        title: 		doc.experience_title_current, 
        radius: 	1.0,
        fillKey: 	fillkey, 
        latitude: 	locn[0],
        longitude: 	locn[1],
        townstate: 	doc.townstate
    }
}