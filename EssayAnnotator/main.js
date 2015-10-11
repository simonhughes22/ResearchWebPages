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
    
    var loaded = false;
    var viewModel = createViewModel(); // is bound in update call on first callback
    
    function doAnnotate(){        
        console.log("do annotate");
        $("#spinner").show();
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
    
    $("#analyze").click(function(){
        // intercept as they want a prompt here at some point
        doAnnotate();
    });
    // trigger on load
    //doAnnotate();    
});