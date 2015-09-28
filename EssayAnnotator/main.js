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
    
    var DELAY = 700;
    
    var loaded = false;
    var viewModel = createViewModel(); // is bound in update call on first callback
    
    function doAnnotate(){        
        console.log("do annotate");
        viewModel.text($("#essayText").val());
        viewModel.error("");
        if(viewModel.querying()){
            return;
        }
        viewModel.querying(true);        
        annotate(viewModel.text(), viewModel.update);        
    }
    
    // EVENTS
    var timerVal = {}
    function textChanged(){
        console.log("text changed");
        clearTimeout(timerVal);
        timerVal = setTimeout(doAnnotate, DELAY);
    }
    
    $("#essayText").bind("oncut", textChanged);
    $('#essayText').bind('input propertychange', textChanged);
    
    // trigger on load
    doAnnotate();    
});