// ensure a console object to prevent countless checks if not there
if(!window.console){
    console = {
        log : function(s){}
    }
    window.console = console;
}

function quote(s){
    return "\"" + s + "\"";
}

$(document).ready(function(){
    
    var DELAY = 250;
    
    var loaded = false;
    
    var viewModel = createViewModel();
    ko.applyBindings(viewModel);
    
    function doAnnotate(){
        console.log("do annotate");
        viewModel.text($("#essayText").val());
        annotate(viewModel);
    }
    
    function textChanged(){
        console.log("text changed");
        clearTimeout(timerVal);
        timerVal = setTimeout(doAnnotate, DELAY);
    }
    
    var timerVal = {}
    $('#essayText').bind('input propertychange', textChanged);
    
    doAnnotate();    
});