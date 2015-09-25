function executeUnsupervisedFeedbackQuery(viewModel, Manager, dLocations){
        
        console.log("Unsupervised Feedback");
        Manager.servlet = "ufselect";
        
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
    
        // fill out remaining parameters
        Manager.store.remove('defType');
        Manager.store.addByValue('defType', "edismax");
    
        Manager.store.addByValue('mm', "0");
        Manager.store.addByValue('q.op', "OR");
    
        Manager.store.remove("uf.maxflqt");
        Manager.store.addByValue("uf.maxflqt", NUM_TERMS_TO_EXTRACT.toString());
    
        Manager.store.remove("uf.normflboosts");
        Manager.store.addByValue("uf.normflboosts", "true");
    
        Manager.store.remove("uf.interestingTerms");
        Manager.store.addByValue("uf.interestingTerms", "details");
    
        if(viewModel.isOw()){
            Manager.store.remove('fq');
            Manager.store.addByValue('fq', "countrycode:US");
            
            Manager.store.remove('uf.fq');
            Manager.store.addByValue('uf.fq', "countrycode:US");
        }
        else{    
            Manager.store.remove('fq');
            Manager.store.addByValue('fq', "item_type:" + viewModel.itemType());
            
            Manager.store.remove('mlt.fq');
            Manager.store.addByValue('mlt.fq', "item_type:" + viewModel.itemType());
        }
        
        Manager.store.remove('df');
		Manager.store.addByValue('df', fieldNames.title);
        
        Manager.store.remove('start');
		Manager.store.addByValue('start', "0");
        
        Manager.store.remove('rows');
		Manager.store.addByValue('rows', RESULTS_TO_DISPLAY.toString());
        
        Manager.store.remove('fl');
        var defaultfields = "";
        var fnames = [];
        for(var fname in fieldNames){
            var val = fieldNames[fname];
            fnames.push(val);
        }
    
        var defaultfields = join(",", fnames);
        Manager.store.addByValue("fl", defaultfields);
    
        Manager.store.remove("uf.fl");
        Manager.store.addByValue("uf.fl", fieldNames.title + "," + fieldNames.skillsQry);
    
        Manager.store.remove("uf.qf");
        var qfValue =   fieldNames.title        + "^" + viewModel.titleBoost().toString() + " " + 
                        fieldNames.skillsQry    + "^" + viewModel.skillsBoost().toString();
        Manager.store.addByValue("uf.qf", qfValue);
        
        var distanceBoostFormula = viewModel.distanceBoostFormula().trim();
        var distanceBoostObj = getDistanceBoost(viewModel.cities(), viewModel.states(), dLocations);
        var distanceBoost = "";
    
        Manager.store.remove('uf.boost');
        if(distanceBoostObj && distanceBoostFormula.length > 0){
            distanceBoost = distanceBoostFormula.replace(/_DIST_/g, distanceBoostObj.distance);
            Manager.store.addByValue('uf.boost', distanceBoost);  
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
            console.log("uf.boost: " + distanceBoost);
		
            viewModel.recommenderHash(queryHash);
            viewModel.recommending(true);
            Manager.doRequest();
        }        
}