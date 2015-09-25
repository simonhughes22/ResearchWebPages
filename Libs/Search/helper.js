function getMembers(obj){
    var members = [];
    for (var prop in obj) {
      // important check that this is objects own property 
      // not from prototype prop inherited
      if(obj.hasOwnProperty(prop)){
        members.push(prop);
      }
    }
    return members;
}

function getKVPs(obj){
	var pairs = [];
	var members = getMembers(obj);
	for(var i = 0; i < members.length; i++){
		var key = members[i];
		var value = obj[key];
		pairs.push({key: key, value: value});
	}
	return pairs;
}

function getMatches(regex, qryTxt)
{
	var matches = (" " + qryTxt + " ").replace(/\s+/g, "  ").match(regex);
	if(matches)
	{
		return unique(matches);
	}
	return matches;
}

function buildQueryForMatches(matches, field, notrequired)
{
	var query = "";
	if(matches && matches.length > 0)
	{
		var prefix = "+";
		if(notrequired)
		{
			prefix = "";
		}
		query += " " + prefix + field + ":("
		for(var i = 0; i < matches.length;i++)
		{	var match = matches[i].trim().replace(/\s+/g, " ");
			query += "\"" + match + "\" ";
		}	
		query += ") "
		return query
	}
	return null;
}

function addAll(jsarray, koarray)
{
	koarray.removeAll();
	for(var i = 0; i < jsarray.length; i++)
	{
		koarray.push(jsarray[i]);
	}
	return koarray;
}

function removeMatches(query, matches)
{
	var qry = spaces(query).replace(/\s+/g, " ");
	for(var i = 0; i < matches.length;i++)
	{
		var m = matches[i].trim();
		// handle C++ and .net
		m = m.replace(/\+/g, "\\+")
				.replace(/\./g, "\\.")
				.replace(/\$/g, "\\$")
				.replace(/\s+/g, " ");
		var re = new RegExp("\\s" + m + "\\s", "g");
		qry = spaces(qry).replace(re," ").replace(/\s+/g, " ");
	}
	return qry.replace(/\s+/g, " ").trim();
}

function comma(fn, arr)
{
	if(!arr || arr.length == 0)
	{
		return "";
	}
	if(!fn)
	{
		fn = function(a){return a};
	}
	return join(", ", map(fn, arr));
}

// for skills, expected with no spaces
function spacesToSemiColon(s)
{
	return s.trim().replace(/\s+/g, ";")
}

function validSkill(sk)
{
	return sk.trim().match(/er$/) == null;
}

function removeNonSkillWords(title)
{
	var matches = getMatches(/([a-z]+(er|or)\s)|(\ssan\s)/g, title);
	if(!matches)
	{
		return title;
	}
	var removed = title;
	for(var i = 0; i < matches.length; i++)
	{
		removed = spaces(removed).replace(spaces(matches[i].trim()), " ");
	}
	return removed.replace(/\s+/g, "  ");
}

function toCurrency(s)
{
    return "$" + 
        Number(s)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function toThousandSeparator(s)
{
    return 
        Number(s)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
    
function addAll(input, existing)
{
    for(var i = 0; i < input.length; i++)
    {
        existing.push(input[i]);
    }
    return existing;
}

function getTitle(doc){
    return doc.title_orig;
}

function truncateTitle(doc){
    var title = doc.title_orig;
    if(title.length > MAX_TITLE_DISPLAY){
        ix = MAX_TITLE_DISPLAY -1;
        while(ix < title.length){
            if(title[ix] == " "){
                break;
            }
            ix++;
        }
        title = title.substring(0, ix) + "...";
    }
    return toInitialCaps(title);
}

function filterSkills(jsonSkills, topN){
    if(topN == undefined){
        topN = SKILLS_TO_DISPLAY;
    }
    
    var arr = [];
    if(!jsonSkills){
        return arr;
    }
    if(jsonSkills.indexOf("{") > -1){
        var oSkills = $.parseJSON( jsonSkills );
        for(var skill in oSkills){
            arr.push({skill: skill, val: oSkills[skill]});
        }
        arr.sort(function(kvpa, kvpb){ return kvpb.val - kvpa.val; });
    }
    else {
        var split = undefined;
        if(jsonSkills.constructor == Array){
            split = jsonSkills;
        }
        else{
            split = jsonSkills.split(",");
        }
        var unique = {};
        for(var i = 0; i< split.length;i++){
            var skill = split[i];
            if(skill in unique){
                continue;
            }
            unique[skill] = true;
            if(skill == "dotnet"){
                skill = ".net";
            }
            else{
                skill = toInitialCaps(skill);
            }
            arr.push({skill: skill, val: 1.0});
        }
    }
    return arr.slice(0, topN);
}

function filterSkillsDisplay(jsonSkills){
    var arr = filterSkills(jsonSkills);
    var retVal = join(", ", map(function(kvp){return kvp.skill;}, arr)).trim();
    if(retVal == ""){
        return "None";
    }
    return retVal;
}

function getLocation(doc){
    var location = "";   
    if(doc.city && doc.city.trim().length > 0){
        location = toInitialCaps(doc.city);
    }
    if(doc.state && doc.state.trim().length > 0){
        if(location.length > 0){
            location += ", ";
        }
        location += doc.state;
    }
    
    if(location.length == 0){
        return null;
    }
    return location;
}