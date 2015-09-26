// ensure a console object to prevent countless checks if not there
if(!window.console){
    console = {
        log : function(s){}
    }
    window.console = console;
}

$(document).ready(function(){

    var loaded = false;
    
    var viewModel = createViewModel();
    ko.applyBindings(viewModel);
    
    function doAnnotate(){
        viewModel.text($("#essayText").val());
        annotate(viewModel);
    }
    
    var timerVal = {}
    $('#essayText').bind('input propertychange', function() {
        clearTimeout(timerVal);
        timerVal = setTimeout(doAnnotate, 2000);
    });
    
    doAnnotate();
});