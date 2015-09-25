function annotate(vm){
    vm.error("");
    if(vm.querying()){
        return;
    }

    vm.querying(true);
    //var url = endpoint + "AnnotateEssays?text=" + vm.text();
    var url = endpoint + "AnnotateEssays";
    $.getJSON(url, {
        text: vm.text()
    }).done(vm.update);   
}
