function applyBoost(query, field, boost, slop){
    if(query.constructor == Array){
        var q = "";
        var unitBoost = boost / Math.sqrt(query.length); 
        for(var i = 0; i < query.length; i++){
            q += applyBoost("\"" + query[i] + "\"", field, unitBoost, slop);
        }
        return q;
    }
    
    if(boost <= 0.0 || query.length == 0){
        return "";
    }
    if(!slop || slop == 0){
        return " " + field + ":(" + query + ")^" + boost + " ";
    }
    return " " + field + ":(" + query + ")~" + slop.toString() + "^" + boost + " ";
}

function applyQfBoost(field, boost, slop){
    if(boost <= 0.0 || !field){
        return "";
    }
    if(!slop || slop == 0){
        return " " + field + "^" + boost + " ";
    }
    return " " + field + "~" + slop.toString() + "^" + boost + " ";
}

function getTitleQuery(title, field, boost, bigramBoost, phraseBoost, phraseSlop){
    var solrTitleQry = applyBoost(title, field, boost);

    // BI-GRAMS
    var bigrams  = getNgrams(title, 2);        
    var titleBigramQry = "";
    if(bigrams.length > 0){
        titleBigramQry = applyBoost(bigrams, field, bigramBoost);
    }
    var phraseQry = applyBoost(quote(collapseSpaces(title.trim())), field, phraseBoost, phraseSlop);
    return solrTitleQry + titleBigramQry + phraseQry;   
}