function getMLTDistanceBoost(doc){

    if(!doc.location || doc.location.trim().length == 0){
        return null;
    }
    
    return geodist = "geodist(" + fieldNames.location + " , " + doc.location.toString() + ")";    
}

function executeMLTContentQuery(streambody, viewModel, Manager, dLocations, maxTerms, rows){
        if(!maxTerms){
            maxTerms = 10;
        }
        if(!rows){
            rows = NUM_RECOMMENDATIONS;
        }
        
        console.log("MLT");
        if(viewModel.isOw()){
            Manager.servlet = "mlt_dice";
        }
        else{
            Manager.servlet = "mlt";
        }
        
        // build query
        
        Manager.store.remove('stream.body');
        Manager.store.remove('stream.url');
        
        var url = viewModel.url().trim();
        var body = streambody.trim();
    
        var fromUrl = false;
        if(url.length > 0){
            Manager.store.addByValue('stream.url', url);
            fromUrl = true;
        }
        else{
            
            if(body.length == 0){
                return;
            }
            Manager.store.addByValue('stream.body', body);
        }
        
        Manager.store.remove("mlt.interestingTerms");
        Manager.store.addByValue("mlt.interestingTerms", "details");
    
        if(viewModel.isOw()){
            Manager.store.remove('fq');
            Manager.store.addByValue('fq', "countrycode:US");
            
            Manager.store.remove('mlt.fq');
            Manager.store.addByValue('mlt.fq', "countrycode:US");
        }
        
        // needed for edismax
        //Manager.store.remove('df');
		//Manager.store.addByValue('df', fieldNames.title);
        
        Manager.store.remove('start');
		Manager.store.addByValue('start', "0");
        
        Manager.store.remove('mlt.maxflqt');
		Manager.store.addByValue('mlt.maxflqt', maxTerms.toString());
        
        Manager.store.remove('rows');
		Manager.store.addByValue('rows', rows.toString());
        
        Manager.store.remove('fl');
        var defaultfields = "";
        var fnames = [];
        for(var fname in fieldNames){
            var val = fieldNames[fname];
            fnames.push(val);
        }
        
        var defaultfields = join(",", fnames);
        Manager.store.addByValue("fl", defaultfields);
    
        Manager.store.remove("mlt.qf");
        var qfValue =   fieldNames.title                    + "^" + viewModel.titleBoost().toString() + " " +
                        fieldNames.title_synonym_bigrams    + "^" + viewModel.titleBigramBoost().toString() + " " +
                        fieldNames.skillsMltQry             + "^" + viewModel.skillsBoost().toString();
        Manager.store.addByValue("mlt.qf", qfValue);
    
        Manager.store.remove('mlt.boostfn');

        var distanceBoostFormula = viewModel.distanceBoostFormula().trim();
        var distanceBoostObj = getDistanceBoost(viewModel.cities(), viewModel.states(), dLocations);
        var distanceBoost = "";
    
        if(distanceBoostObj && distanceBoostFormula.length > 0){
            distanceBoost = distanceBoostFormula.replace(/_DIST_/g, distanceBoostObj.distance);
            Manager.store.addByValue('mlt.boostfn', distanceBoost);  
        }
       
        viewModel.hasLocation(viewModel.hasLocation() || distanceBoost != null);
        
        // take whole sory query plus distance boost, that way it includes changes to the different query boosts
        var queryHash = url + "\n" + streambody + "|\n" +  distanceBoost + "|\n" + qfValue;

        console.log("mlt.boostfn: " + distanceBoost);
        if(fromUrl){
            console.log("mlt.stream.url: " + url);
        }
        else{
            console.log("stream.body: ");
            console.log(streambody.substring(0,100));
            console.log("");
        }

        viewModel.recommenderHash(queryHash);
        viewModel.recommending(true);
        Manager.doRequest();
}