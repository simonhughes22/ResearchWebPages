function executeSolrQuery(viewModel, Manager, dLocations){
        console.log("Search");
    
        // build query
        var titleQuery = viewModel.query().trim().toLowerCase();
        var fullTitleQuery = collapseSpaces(viewModel.seniorityQry().toLowerCase() + " " + viewModel.query());
        
        var solrTitleQry = getTitleQuery(fullTitleQuery, fieldNames.title, 
                                      viewModel.titleBoost(), viewModel.titleBigramBoost(), viewModel.titlePhraseBoost(), viewModel.titlePhraseSlop());
        
        var solrSkillsQry = "";
        if(viewModel.skills().length > 0 && viewModel.skillsBoost() > 0.0){
            solrSkillsQry = applyBoost(viewModel.skills(), fieldNames.skillsQry, viewModel.skillsBoost());
        }

        var solrQry = collapseSpaces(solrTitleQry) + solrSkillsQry;
        
        Manager.store.remove('q');
        Manager.store.addByValue('q', solrQry);
        
        // rest of the parameters
        Manager.store.remove('defType');
        Manager.store.addByValue('defType', "edismax");
    
        Manager.store.addByValue('mm', "0");
        Manager.store.addByValue('q.op', "OR");
                
        Manager.store.remove('fq');
        if(IS_OW){    
            Manager.store.addByValue('fq', "countrycode:US");
        }
        else{
            if(mapData.name == "mapRecommenderData"){
                Manager.store.addByValue('fq', "item_type:" + viewModel.itemType());
            }
        }
        
        Manager.store.remove('df');
		Manager.store.addByValue('df', fieldNames.title);
        
        Manager.store.remove('start');
		Manager.store.addByValue('start', viewModel.pageStart().toString());
        
        Manager.store.remove('rows');
		Manager.store.addByValue('rows', TOP_N.toString());
        //Manager.store.addByValue("debugQuery", "true");
        
        var distanceBoostFormula = viewModel.distanceBoostFormula().trim();
        var distanceBoostObj = getDistanceBoost(viewModel.cities(), viewModel.states(), dLocations);
        var distanceBoost = "";

        Manager.store.remove('boost');
        Manager.store.remove('fl');
    
        var defaultfields = "";
        var fnames = [];
        for(var fname in fieldNames){
            var val = fieldNames[fname];
            fnames.push(val);
        }
    
        var defaultfields = join(",", fnames);
        Manager.store.addByValue("fl", defaultfields);
    
        if(distanceBoostObj && distanceBoostFormula.length > 0){
            distanceBoost = distanceBoostFormula.replace(/_DIST_/g, distanceBoostObj.distance);
            Manager.store.addByValue('boost', distanceBoost);    
        }
        else{
            /*if(viewModel.cities().length > 0){
                solrQry += applyBoost( join(" ", viewModel.cities() ), fieldNames.city, 10);
            }
            if(viewModel.states().length > 0){
                solrQry += applyBoost(join(" ", viewModel.states()).toUpperCase(), fieldNames.state, 10);
            }*/
            // needed to clear boost, else previous boost persists
            Manager.store.addByValue('boost', "1.0");            
        }
        viewModel.hasLocation(distanceBoostObj != null);
        
        // take whole sory query plus distance boost, that way it includes changes to the different query boosts
        var queryHash = solrQry + "|\n" +  distanceBoost + "|\n" + viewModel.pageStart().toString() + "\n";
        // nothing changed?
        if(queryHash == viewModel.queryHash()){
            console.log("already queried");
            return;
        }
        else{
            
            console.log(solrQry);
            console.log("boost: " + distanceBoost);
            viewModel.recommenderHash("");
            viewModel.queryHash(queryHash);
            viewModel.querying(true);
            Manager.doRequest();            
        }        
}