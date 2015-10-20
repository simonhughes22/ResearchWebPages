function annotate(text, cb){

    var url = endpoint + "AnnotateEssays";
    $.getJSON(url, {
        text: text
    }).done(cb)
    .fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
        //alert("Ajax error - Request Failed: " + err);
    });  
}
