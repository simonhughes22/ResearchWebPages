function createViewModel(){
    var codesScale = d3.scale.category20();
    var causalScale = d3.scale.category20b();
    
    var vm = {
        
        bound         : false,
        
        querying      : ko.observable(false),
        error         : ko.observable(""),
        text          : ko.observable(""),
        
        getCodeColor  : function(code){
            return codesScale(code);
        },
        
        getCausalColor : function(causal){
            return causalScale(causal);
        },
        
        getCategoryDescription : function(cat){
            if(cat == 1){
                return "No core content";
            }
            if(cat == 2){
                return "No causal chains";
            }
            if(cat == 3){
                return "Causal chain with no intervening factors";
            }
            if(cat == 4){
                return "'Easy' Causal chain with intervening factor(s) from one document";
            }
            if(cat == 5){
                return "Causal chain with intervening factor(s) from multiple documents";
            }
            return "";
        },
        
        getCaption : function(tagged_word){
            if(tagged_word.word() == tagged_word.corrected_word()){
                return "";
            }
            return "Corrected from " + tagged_word.word();
        },
        
        getFontStyle : function(tagged_word){
            if(tagged_word.word() == tagged_word.corrected_word()){
                return "normal";
            }
            return "italic";
        },
        
        update      : function(data){
            console.log(data);
            vm.querying(false);
            if(data.error){
                vm.error(data.error);
                return
            }
            vm.error("");
            if(!vm.bound){
                vm.bound = true;
                var mappedVm = ko.mapping.fromJS(data);
                vm = $.extend(vm, mappedVm);
                ko.applyBindings(vm);
            }
            else{
                ko.mapping.fromJS(data, vm);
            }
            vm.updateAnnotations();
        },
        updateAnnotations : function(){
            drawCircles(vm.essay_category());
        }
        
	};
    
    return vm;
}