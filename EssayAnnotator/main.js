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
    
    var timerVal = {}
    $('#essayText').bind('input propertychange', function() {
        
        viewModel.text($("#essayText").val());
        clearTimeout(timerVal);
        timerVal = setTimeout(function(){annotate(viewModel);}, 2000);        
    });

});