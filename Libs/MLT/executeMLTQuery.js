function getMLTDistanceBoost(doc){

    if(!doc.location || doc.location.trim().length == 0){
        return null;
    }
    
    return geodist = "geodist(" + fieldNames.location + " , " + doc.location.toString() + ")";    
}

function executeMLTQuery(doc, viewModel, Manager){
        
        console.log("MLT");
        if(viewModel.isOw()){
            Manager.servlet = "mlt_dice";
        }
        else{
            Manager.servlet = "mlt";   
        }
        
        viewModel.recommenderTarget(doc.dockey);
    
        // build query
        var excludeQry = "-" + fieldNames.dockey + ":" + doc.dockey;        
        var solrTitleQry = getTitleQuery(collapseSpaces(doc.title.trim()), fieldNames.title, 
                                      viewModel.titleBoost(), viewModel.titleBigramBoost(), viewModel.titlePhraseBoost(), viewModel.titlePhraseSlop());
        
        var solrQry = ""; 
        var clicked = viewModel.recommenderTargetDocs();
        if(viewModel.isMLThese() && clicked.length > 1){
            
            // doc already exists
            var keys = [];
            for(var i = 0; i < clicked.length; i++){
                var dockey = clicked[i].dockey;                
                keys.push(dockey);
            }
            keys.sort();
            for(var i = 0; i < keys.length; i++){
                var key = keys[i];
                solrQry += " " + fieldNames.dockey + ":" + key;
            }            
            solrQry = collapseSpaces(solrQry);
        }
        else{
            solrQry = "+" + fieldNames.dockey + ":" + doc.dockey;
        }
        Manager.store.remove('q');
        Manager.store.addByValue('q', solrQry);
    
        // fill out remaining parameters
        Manager.store.remove('defType');
        Manager.store.addByValue('defType', "edismax");
    
        Manager.store.addByValue('mm', "0");
        Manager.store.addByValue('q.op', "OR");
    
        Manager.store.remove("mlt.boost");
        Manager.store.addByValue("mlt.boost", "true");

        Manager.store.remove("mlt.maxflqt");
        Manager.store.addByValue("mlt.maxflqt", NUM_TERMS_TO_EXTRACT.toString());
    
        Manager.store.remove("mlt.normflboosts");
        Manager.store.addByValue("mlt.normflboosts", "true");
    
        Manager.store.remove("mlt.interestingTerms");
        Manager.store.addByValue("mlt.interestingTerms", "details");
    
        if(viewModel.isOw()){
            Manager.store.remove('fq');
            Manager.store.addByValue('fq', "countrycode:US");
            
            Manager.store.remove('mlt.fq');
            Manager.store.addByValue('mlt.fq', "countrycode:US");
        }
        else{
            if(mapData.name == "mapRecommenderData"){
                Manager.store.remove('fq');
                Manager.store.addByValue('fq', "item_type:" + viewModel.itemType());
            
                Manager.store.remove('mlt.fq');
                Manager.store.addByValue('mlt.fq', "item_type:" + viewModel.itemType());
            }
        }
        
        Manager.store.remove('df');
		Manager.store.addByValue('df', fieldNames.title);
        
        Manager.store.remove('start');
		Manager.store.addByValue('start', "0");
        
        Manager.store.remove('rows');
		Manager.store.addByValue('rows', NUM_RECOMMENDATIONS.toString());
        
        Manager.store.remove('fl');
        var defaultfields = "";
        var fnames = [];
        for(var fname in fieldNames){
            var val = fieldNames[fname];
            fnames.push(val);
        }
    
        var defaultfields = join(",", fnames);
        Manager.store.addByValue("fl", defaultfields);
    
        Manager.store.remove("mlt.fl");
        Manager.store.addByValue("mlt.fl", fieldNames.title + "," + fieldNames.skillsQry);
    
        Manager.store.remove("mlt.qf");
        var qfValue =   fieldNames.title        + "^" + viewModel.titleBoost().toString() + " " + 
                        fieldNames.skillsQry    + "^" + viewModel.skillsBoost().toString();
        
        Manager.store.addByValue("mlt.qf", qfValue);
        Manager.store.remove('mlt.boostfn');
    
        var distanceBoostFormula = viewModel.distanceBoostFormula().trim();
        var distanceBoost = getMLTDistanceBoost(doc);
        
        if(distanceBoost && distanceBoostFormula.length > 0){
            distanceBoost = distanceBoostFormula.replace(/_DIST_/g, distanceBoost);
            Manager.store.addByValue('mlt.boostfn', distanceBoost);  
        }
        else{
            /*if(viewModel.cities().length > 0){
                solrQry += applyBoost( join(" ", viewModel.cities() ), fieldNames.city, 10);
            }
            if(viewModel.states().length > 0){
                solrQry += applyBoost(join(" ", viewModel.states()).toUpperCase(), fieldNames.state, 10);
            }
            // needed to clear boost, else previous boost persists
            Manager.store.addByValue('mlt.boostfn', "1.0");            
            */
        }
        viewModel.hasLocation(viewModel.hasLocation() || distanceBoost != null);
        
        // take whole sory query plus distance boost, that way it includes changes to the different query boosts
        var queryHash = solrQry + "|\n" +  distanceBoost + "|\n" + qfValue;
        // nothing changed?
        if(queryHash == viewModel.recommenderHash()){
            console.log("already queried");
            return;
        }
        else{
            console.log(solrQry);
            console.log("mlt.boostfn: " + distanceBoost);
		
            viewModel.recommenderHash(queryHash);
            viewModel.recommending(true);
            Manager.doRequest();
        }        
}