var diceFieldNames = {
        title:      "title",
        title_orig: "title_orig",
        title_synonym_bigrams:"title_synonym_bigrams",
        // skills to read
        skillsFetch:"skills",
        // skill to query
        skillsQry:  "skills",
        location:   "location",
        city:       "city",
        state:      "state",
        dockey:     "dockey"
}

function getOwTitle(doc){
    if(!doc.experience_title_current || doc.experience_title_current.length == 0 || !doc.experience_title_current[0]){
        return "NO TITLE";
    }
    return doc.experience_title_current[0];
}

function mapRecommenderData(obj){
    return obj;
}

function mapOwData(obj){    
    return {
        title:      getOwTitle(obj),
        title_orig: getOwTitle(obj),
        title_synonym_bigrams:getOwTitle(obj),
        // todo update
        skills:     obj.skill_entity_score,
        location:   obj.latlng,
        distance:   null,
        city:       obj.town,
        state:      obj.statecode,
        dockey:     obj.person_id,
        dist_boost: obj.dist_boost
    }
}
var owFieldNames = {
        title:      "experience_title_current",
        title_orig: "experience_title_current",
        title_synonym_bigrams:"experience_title_current",
        // todo update
        skillsFetch:"skill_entity_score",
        skillsQry:  "skill_entity_weighted",
        location:   "latlng",
        city:       "town",
        state:      "statecode",
        dockey:     "person_id"
}

function mapDiceJobsData(obj){    
    return {
        title:      obj.jobTitle_text,
        title_orig: obj.jobTitle,
        title_synonym_bigrams:obj.jobTitle_synonym_bigrams,
        // todo update
        skills:     obj.skill,
        location:   obj.jobEndecaGeoCode,
        distance:   obj.distance,
        city:       obj.jobMunicipality,
        state:      obj.jobRegion,
        dockey:     obj.id,
        dist_boost: obj.dist_boost,
        company:    obj.company,
        description:obj.description,
        
        companySegmentType: obj.companySegmentType,
        companySegmentVal:  obj.companySegmentVal,
        taxTerms:   obj.rawTaxTerms,
        
        diceID:     obj.diceID,
        positionID: obj.positionID,
    }
}

var diceJobsFieldNames = {
        title:      "jobTitle_text",
        title_orig: "jobTitle",
        title_synonym_bigrams:"jobTitle_synonym_bigrams",

        // skills to read
        skillsFetch:"skill",
        // skill to query
        skillsQry:  "skill",
        skillsMltQry:"skillFromTitleDescription",
        
        location:   "jobEndecaGeoCode",
        city:       "jobMunicipality",
        state:      "jobRegion",
        dockey:     "id",
        
        company:     "company_text",
        companyRaw:  "company",
        description: "description",
        text_dice:   "text_dice",
        
        companySegmentType: "companySegmentType",
        companySegmentVal:  "companySegmentVal",
        taxTerms:           "rawTaxTerms",
        diceID:             "diceID",
        positionID:         "positionID",
}

function mapDiceProfilesData(obj){
    // some salaries are entered in thousands
    if(obj.fYearlyRate && obj.fYearlyRate > 0 && obj.fYearlyRate < 1000){
        obj.fYearlyRate *= 1000;
    }
    
    return {
        doc:            obj,
        
        title:          obj.positionTitle,
        title_orig:     obj.positionTitle,
        title_synonym_bigrams:obj.positionTitleBigrams,
        // todo update
        skills:         obj.skills,
        location:       obj.geoCode,
        distance:       obj.distance,
        city:           obj.municipality,
        state:          obj.region,
        dockey:         obj.id,
        dist_boost:     obj.dist_boost,
        email:          obj.email,
        givenName:      obj.givenName,
        familyName:     obj.familyName,
        id:             obj.id,
        
        salary      :   obj.fYearlyRate,
        yearlySalary:   obj.fYearlyRate,
        hourlySalary:   obj.fHourlyRate,
        
        location1   :   obj.geoCodeFirst,
        location2   :   obj.geoCodeSecond,
        location3   :   obj.geoCodeThird,
    
        city1       :   obj.metro_first,
        city2       :   obj.metro_second,
        city3       :   obj.metro_third,
    
        state1      :   obj.region_first,
        state2      :   obj.region_second,
        state3      :   obj.region_third,
        
        taxTerms    :   obj.taxTerms,
        workAuth    :   obj.workAuth != undefined? obj.workAuth : "",
        announceDate:   obj.announceDate
    }
}

var diceProfilesFieldNames = {
        title:      "positionTitle",
        title_orig: "positionTitle",
        title_synonym_bigrams:"positionTitleBigrams",

        // skills to read
        skillsFetch:"skills",
        // skill to query
        skillsQry:  "skillFromTitleClassificationResume",
        location:   "geoCode",
        city:       "municipality",
        state:      "region",
        dockey:     "id",
        
        company:     "employerName",
        description: "diceSeekerResume",
        // present in Profiles but not used
        text_dice:   "text_dice",
        email:       "email",
        givenName:   "givenName",
        familyName:  "familyName",
        id:          "id",
        
        salary:       "fYearlyRate",
        yearlySalary: "fYearlyRate",
        hourlySalary: "fHourlyRate",
    
        // alternate location preferences
        location1   : "geoCodeFirst",
        location2   : "geoCodeSecond",
        location3   : "geoCodeThird",
    
        city1       : "metro_first",
        city2       : "metro_second",
        city3       : "metro_third",
    
        state1      : "region_first",
        state2      : "region_second",
        state3      : "region_third",
    
        taxTerms    : "taxTerms",
        workAuth    : "workAuth",
    
        announceDate: "announceDate",        
}
