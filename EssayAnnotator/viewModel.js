function createViewModel(){
    var vm = {
        
        querying    : ko.observable(false),
        error       : ko.observable(""),
        text        : ko.observable(""),
        
        category    : ko.observable(-1),
        
        categoryDescription : function(cat){
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
        
        update      : function(data){
            
            console.log(data);
            
            vm.querying(false);

            if(data.error){
                vm.error(data.error);
            }
            else{
                vm.error("");
                vm.category(data.essay_category);
                drawCircles(vm.category());
            }
        }
	};
    
    return vm;
}