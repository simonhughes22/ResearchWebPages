function drawCircles(val){

    var range = [1,2,3,4,5];
    var radius = 30;
    var padding = 2;
    
    var width = range.length * (radius * 2 + padding);
    var height = (radius + padding) * 2;

    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);
    
     var elem = svg.selectAll("g")
        .data(range)

    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = elem.enter()
        .append("g")
        .attr("transform", function(d){return "translate("+d+",80)"})

    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
        .attr("r", function(d){return radius} )
        .attr("stroke","black")
        .attr("fill", "white")

    /* Create the text for each block */
    elemEnter.append("text")
        .attr("dx", function(d){return -20})
        .text(function(d){return d.label})
}
