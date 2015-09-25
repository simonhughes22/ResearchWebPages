function getRecommenderDistanceBoost(doc){

    if(!doc.location || doc.location.trim().length == 0){
        return null;
    }
    
    return geodist = "geodist(latlng , " + doc.location.toString() + ")";    
}

function executeRecommenderQuery(doc, viewModel, Manager){
        
        console.log("Recommender");
        
        viewModel.recommenderTarget(doc.dockey);
    
        // build query
        var excludeQry = "-" + fieldNames.dockey + ":" + doc.dockey;        
        var solrTitleQry = getTitleQuery(collapseSpaces(doc.title.trim()), fieldNames.title, 
                                      viewModel.titleBoost(), viewModel.titleBigramBoost(), viewModel.titlePhraseBoost(), viewModel.titlePhraseSlop());
        var solrSkillsQry = "";
        if(doc.skills.length > 0 && viewModel.skillsBoost() > 0.0){
            
            var skills = filterSkills(doc.skills, NUM_TERMS_TO_EXTRACT);
            
            var lens = map(function(kvp){ return kvp.val; }, skills);    
            var vecLen = vectorLength(lens);
            
            for(var i = 0; i< skills.length; i++){
                var kvp = skills[i];
                
                var boost = (viewModel.skillsBoost() * kvp.val) / vecLen;
                solrSkillsQry += applyBoost(quote(kvp.skill), fieldNames.skillsQry, boost);
            }
        }
        var solrQry = collapseSpaces(excludeQry + solrTitleQry + solrSkillsQry);
        Manager.store.remove('q');
        Manager.store.addByValue('q', solrQry);
    
        // fill out remaining parameters
        Manager.store.remove('defType');
        Manager.store.addByValue('defType', "edismax");
    
        Manager.store.addByValue('mm', "0");
        Manager.store.addByValue('q.op', "OR");
        
        Manager.store.remove('fq');
        if(IS_OW){    
            Manager.store.addByValue('fq', "countrycode:US");
        }
        else{
            Manager.store.addByValue('fq', "item_type:" + viewModel.itemType());
        }
        
        Manager.store.remove('df');
		Manager.store.addByValue('df', fieldNames.title);
        
        Manager.store.remove('start');
		Manager.store.addByValue('start', "0");
        
        Manager.store.remove('rows');
		Manager.store.addByValue('rows', TOP_N.toString());
        
        Manager.store.remove('fl');
        var defaultfields = "";
        var fnames = [];
        for(var fname in fieldNames){
            var val = fieldNames[fname];
            fnames.push(val);
        }
    
        var defaultfields = join(",", fnames);
        Manager.store.addByValue("fl", defaultfields);
    
        Manager.store.remove('boost');
        var distanceBoostFormula = viewModel.distanceBoostFormula().trim();
        var distanceBoost = getMLTDistanceBoost(doc);
        
        if(distanceBoost && distanceBoostFormula.length > 0){
            distanceBoost = distanceBoostFormula.replace(/_DIST_/g, distanceBoost);
            Manager.store.addByValue('boost', distanceBoost);  
        }
        else{
            if(viewModel.cities().length > 0){
                solrQry += applyBoost( join(" ", viewModel.cities() ), fieldNames.city, 10);
            }
            if(viewModel.states().length > 0){
                solrQry += applyBoost(join(" ", viewModel.states()).toUpperCase(), fieldNames.state, 10);
            }
            // needed to clear boost, else previous boost persists
            Manager.store.addByValue('boost', "1.0");            
        }
        viewModel.hasLocation(viewModel.hasLocation() || distanceBoost != null);
        
        // take whole sory query plus distance boost, that way it includes changes to the different query boosts
        var queryHash = solrQry + "|\n" +  distanceBoost + "|\n";
        // nothing changed?
        if(queryHash == viewModel.recommenderHash()){
            console.log("already queried");
            return;
        }
        else{
            console.log(solrQry);
            console.log("boost: " + distanceBoost);
		
            viewModel.recommenderHash(queryHash);
            viewModel.recommending(true);
            Manager.doRequest();
        }            
}