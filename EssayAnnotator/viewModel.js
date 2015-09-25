function createViewModel(){
    var vm = {
        
        querying    : ko.observable(false),
        error       : ko.observable(""),
        text        : ko.observable(""),
        
        update      : function(data){
            
            console.log(data);
            
            vm.querying(false);

            if(data.error){
                vm.error(data.error);            
            }
            else{

            }
        }
	};
    
    return vm;
}