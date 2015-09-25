function salaryParser(qry, itemType, scaleUp){

    if(scaleUp == undefined){
        scaleUp = true;
    }
    var re_salary = /\s(between|and|to|-|at|around|over|greater|greater\s+than|more\s+than|above|less|less\s+than|below|under|>|>=|<|<=)?\s*\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)(\.[0-9]{1,2})?([mMkK]|(\s*grand|Grand)|(\s*(\/|an\s+|per\s+)?\s*(hr|hr\.|hour|hrly|hrly\.|hourly)))?\s/g
    //var re_money = /\$?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)(\.[0-9]{1,2})?([mMkK]|(\s*grand|Grand))?/
    
    // more flexible in terms of comma placement
    var re_money = /\$?((([0-9,])+))(\.[0-9]{1,2})?(\s*([mMkKgG]|(grand|Grand)|(\/?(hr|hr\.|hour|hrly|hrly\.|hourly))))?/

    function getMatches(q){
        var salaryMatches = (" " + q + " ").match(re_salary);
        if(!salaryMatches)
        {
            return null;
        }
        salaryMatches = map(trim, filter(isNotNullOrEmpty, salaryMatches));
        if(salaryMatches.length == 0)
        {
            return null;
        }
        // sort by length descending
        salaryMatches.sort(function(a,b) { return b.length - a.length; });
        return salaryMatches;
    }

    var matchCount = 0;
    var minAmount = 100000000000;
    var maxAmount = 0;
    var predicate = "";
    var hourly = false;
    var matches = [];

    var salaryMatches = getMatches(qry);
    while(salaryMatches && salaryMatches.length > 0)
    {
        matchCount++;
        var match = salaryMatches.shift();
        matches.push(match);

        var money = match.match(re_money)[0];
        if(match.match(/hr|hour|hrly|hourly/g)){
            hourly = true;   
        }
        // parse the alpha money values
        var amount = money
                        .replace(/\//g, "")
                        .replace(/hr|hour|hrly|hourly/g,"")                
                        .replace(/[kK]/g, "000")
                        .replace(/\s*grand/g, "000")
                        .replace(/[mM]/g, "000000")
                        .replace(/[,\$]/g, "");
        
        amount = parseFloat(amount);
        if(amount <= 1000 && amount != 0 && scaleUp){
            amount *= 1000;
        }

        var fltr = match.replace(money, " ").replace(/\s+/g, " ").trim();

        if(fltr.length > 0)
        {
            fltr = fltr
                        // ignore than's
                        .replace(/than/g, " ")
                        // normalize above\below
                        .replace(/above|greater|more|over|>/g, ">")
                        .replace(/less|below|under|</g, "<")
                        // cleanse results
                        .replace(/\s+/g, " ")
                        .trim();
        }
        predicate = "";
        if(fltr.match(/>=/))
        {
            predicate = ">=";
        }
        else if(fltr.match(/<=/))
        {
            predicate = "<=";
        }
        else if(fltr.match(/>/))
        {
            predicate = ">";
        }
        else if(fltr.match(/</))
        {
            predicate = "<";
        }
        else if(fltr.match(/at/))
        {
            predicate = "=";
        }
        else if(fltr.match(/around/))
        {
            predicate = "~";
        }
        else
        {
            if(itemType == "Seeker")
            {
                predicate = "<=";
            }
            else if(itemType == "Job")
            {
                predicate = ">=";
            }
            else
            {
                predicate = "=";
            }
        }

        minAmount = Math.min(minAmount, amount);
        maxAmount = Math.max(maxAmount, amount);
        
        qry = qry.replace(match, " ").replace(/\s+/g, " ").trim();
        salaryMatches = getMatches(qry);
    }

    if(matchCount == 0)
    {
        return null;
    }
    if(matchCount > 1)
    {
        predicate = "between";
    }
    return { bottom : minAmount, top: maxAmount, predicate : predicate, matches : matches, hourly: hourly };
};

function getSolrSalaryQuery(amount, prefix){
    if(prefix == ">")
    {
        return "+salary:[" + (amount+1).toString() + " TO 99999999] ";
    }
    else if(prefix == ">=")
    {
        return "+salary:[" + amount.toString() + " TO 99999999] ";
    }
    else if(prefix == "<")
    {
        return "+salary:[1 TO " + (amount-1).toString() + "] ";
    }
    else if(prefix == "<=")
    {
        return "+salary:[1 TO " + amount.toString() + "] ";
    }
    else if(prefix == "=")
    {
        return "+salary:[" + amount.toString() + " TO " + amount.toString() + "] ";
    }
    else if(prefix == "~")
    {
        var top; var bottom;
        if(amount == 100000.0)
        {
            top     = 100000;
            bottom  =  90000;
        }
        else if(amount <= 100000.0)
        {
            var amnt = Math.round(amount / 5000.0) * 5000.0;
            top     = amnt + 5000.0;
            bottom  = amnt - 5000.0;
        }
        else
        {
            var amnt = Math.round(amount / 25000.0) * 25000.0;
            // rounded down
            if(amnt < amount)
            {
                bottom  = amnt;
                top     = amnt + 25000.0;
            }
            else
            {
                bottom  = amnt - 25000.0;
                top     = amnt;
            }
        }
        // give 10% either way
        return "+salary:[" + bottom.toString() + " TO " + top.toString() + "] ";
    }
}