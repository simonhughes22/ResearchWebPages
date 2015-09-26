function drawCircles(essay_category){

    var range = [1,2,3,4,5];
    var radius = 30;
    var padding = 2;
    
    var defaultColor = "#336699"; //blue
    var selectedColor = "#00CC66"; // green
    var selectedStroke = "white";
    
    var width = range.length * 2 * (radius + padding);
    var height = (radius + padding) * 2;

    $("svg").html("");
    
    var svg = d3.select("svg")
        .style({width:  width.toString()  + "px", 
                height: height.toString() + "px"
               });
        
     var elem = svg.selectAll("g")
        .data(range)

    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform", function(d){return "translate("+(d*2*(radius+padding) - radius -padding)+"," + (radius+padding) + ")"})

    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return radius} )        
        .attr("stroke",function(d){
            if(d == essay_category){
                return selectedStroke;
            }
            return defaultColor;
        })
        .attr("stroke-width",function(d){
            if(d == essay_category){
                return "4";
            }
            return "2";
        })
        .attr("fill",function(d){
            if(d == essay_category){
                return selectedColor;
            }
            return "white";
        })

    /* Create the text for each block */
    var textOffset = 7;
    elemEnter.append("text")
        .attr("dx", function(d){return -textOffset})
        .attr("dy", function(d){return +textOffset})
        .style("fill",function(d){
            if(d == essay_category){
                return "white";
            }
            return defaultColor;
        })
        .style("font-weight",function(d){
            if(d == essay_category){
                return "bold";
            }
            return "";
        })
        .text(function(d){return d})
}
