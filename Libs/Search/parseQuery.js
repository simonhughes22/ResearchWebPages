var re_states = /\srhode island\s|\sga\s|\snevada\s|\stx\s|\sla\s|\sminnesota\s|\stn\s|\smaryland\s|\stexas\s|\siowa\s|\smichigan\s|\sde\s|\sutah\s|\sdc\s|\shawaii\s|\sdistrict of columbia\s|\sidaho\s|\sohio\s|\soklahoma\s|\sarkansas\s|\sri\s|\sarizona\s|\swisconsin\s|\swa\s|\swi\s|\swv\s|\scalifornia\s|\snew mexico\s|\swy\s|\sok\s|\soh\s|\sflorida\s|\salaska\s|\sco\s|\scolorado\s|\sca\s|\swashington\s|\stennessee\s|\sct\s|\smississippi\s|\ssouth dakota\s|\snew\s+jersey\s|\snorth carolina\s|\snew york\s|\sindiana\s|\slouisiana\s|\soregon\s|\sconnecticut\s|\shi\s|\sme\s|\smd\s|\sgeorgia\s|\sma\s|\sut\s|\smo\s|\smn\s|\smi\s|\skentucky\s|\smt\s|\snebraska\s|\snew hampshire\s|\sms\s|\ssouth carolina\s|\sva\s|\snorth dakota\s|\sak\s|\sal\s|\sar\s|\svt\s|\sil\s|\sia\s|\saz\s|\sid\s|\snh\s|\snj\s|\snm\s|\spa\s|\snc\s|\snd\s|\sne\s|\sillinois\s|\sny\s|\snv\s|\shawai'i\s|\skansas\s|\svirginia\s|\smontana\s|\smassachusetts\s|\sfl\s|\sky\s|\spennsylvania\s|\sks\s|\smissouri\s|\ssc\s|\salabama\s/g
var re_ucStates = /\sIN\s|\sIn\s|\sOR\s|\sOr\s/g
var re_cities = /\shouston\s|\smadison\s|\scincinnati\s|\sfresno\s|\ssavannah\s|\sbeaumont\s|\shampton\s|\stallahassee\s|\swest\s+palm\s+beach\s|\stempe\s|\scambridge\s|\sbirmingham\s|\scedar\s+rapids\s|\sfrisco\s|\smilwaukee\s|\smcallen\s|\srancho\s+cucamonga\s|\srichmond\s|\sdenton\s|\snewport\s+news\s|\sboulder\s|\swest\s+covina\s|\swest\s+valley\s+city\s|\sfullerton\s|\sclarksville\s|\sdenver\s|\slansing\s|\scosta\s+mesa\s|\snew\s+orleans\s|\slowell\s|\sorange\s|\sriverside\s|\smiramar\s|\storrance\s|\shenderson\s|\sgreen\s+bay\s|\snorth\s+las\s+vegas\s|\stulsa\s|\sgresham\s|\saurora\s|\sfremont\s|\samarillo\s|\scarrollton\s|\snorman\s|\sakron\s|\sjoliet\s|\sjacksonville\s|\ssanta\s+maria\s|\ssyracuse\s|\sst.\s+louis\s|\spueblo\s|\slincoln\s|\snorfolk\s|\smiami\s|\schesapeake\s|\sbaton\s+rouge\s|\sorlando\s|\slexington\s|\sdetroit\s|\sbridgeport\s|\spomona\s|\skenosha\s|\sglendale\s|\smodesto\s|\smiami\s+gardens\s|\ssanta\s+clara\s|\sconcord\s|\swilmington\s|\sst.\s+petersburg\s|\shialeah\s|\stemecula\s|\sstamford\s|\sprovo\s|\ssanta\s+rosa\s|\scleveland\s|\ssanta\s+ana\s|\sbellevue\s|\sportland\s|\scarlsbad\s|\selizabeth\s|\slancaster\s|\sfort\s+lauderdale\s|\snew\s+haven\s|\sjackson\s|\sgarland\s|\schicago\s|\sfontana\s|\sknoxville\s|\stucson\s|\snewark\s|\sprovidence\s|\sfort\s+wayne\s|\snaperville\s|\skent\s|\stoledo\s|\sfargo\s|\ssurprise\s|\swarren\s|\sindependence\s|\scolorado\s+springs\s|\scolumbus\s|\scary\s|\sjersey\s+city\s|\snorwalk\s|\snashville\s|\salbuquerque\s|\sboise\s|\sodessa\s|\shigh\s+point\s|\santioch\s|\sshreveport\s|\sberkeley\s|\solathe\s|\ssan\s+bernardino\s|\spalmdale\s|\svirginia\s+beach\s|\sbakersfield\s|\spembroke\s+pines\s|\sspokane\s|\sthousand\s+oaks\s|\sanchorage\s|\shollywood\s|\sfort\s+worth\s|\sburbank\s|\sclearwater\s|\sel\s+cajon\s|\slas\s+vegas\s|\stopeka\s|\sraleigh\s|\smurrieta\s|\sport\s+st.\s+lucie\s|\scharleston\s|\saustin\s|\sgreensboro\s|\slas\s+cruces\s|\salexandria\s|\sstockton\s|\swashington\s|\selgin\s|\soxnard\s|\sathens\s|\ssalinas\s|\sdurham\s|\ssan\s+buenaventura\s|\ssan\s+francisco\s|\soakland\s|\spompano\s+beach\s|\scape\s+coral\s|\smoreno\s+valley\s|\sontario\s|\swaco\s|\sarlington\s|\sann\s+arbor\s|\serie\s|\sphiladelphia\s|\ssalt\s+lake\s+city\s|\sfairfield\s|\sflint\s|\snew\s+york\s|\sdowney\s|\sarvada\s|\spaterson\s|\ssaint\s+paul\s|\shuntington\s+beach\s|\scorpus\s+christi\s|\sevansville\s|\sbroken\s+arrow\s|\schandler\s|\smckinney\s|\schula\s+vista\s|\sel\s+monte\s|\ssioux\s+falls\s|\svictorville\s|\selk\s+grove\s|\spittsburgh\s|\speoria\s|\swaterbury\s|\sirving\s|\swest\s+jordan\s|\sirvine\s|\ssterling\s+heights\s|\sround\s+rock\s|\shartford\s|\sreno\s|\shonolulu\s|\sescondido\s|\satlanta\s|\smemphis\s|\sgilbert\s|\stampa\s|\srockford\s|\svallejo\s|\smidland\s|\sgarden\s+grove\s|\sfort\s+collins\s|\sgrand\s+prairie\s|\soceanside\s|\saugusta\s|\slong\s+beach\s|\sanaheim\s|\smanchester\s|\sdes\s+moines\s|\soklahoma\s+city\s|\slaredo\s|\sdavenport\s|\srialto\s|\scentennial\s|\scharlotte\s|\soverland\s+park\s|\swinston�salem\s|\smurfreesboro\s|\sboston\s|\slittle\s+rock\s|\sworcester\s|\sminneapolis\s|\svisalia\s|\sroseville\s|\ssalem\s|\smesquite\s|\sseattle\s|\singlewood\s|\snorth\s+charleston\s|\scoral\s+springs\s|\swichita\s+falls\s|\stacoma\s|\srochester\s|\slakewood\s|\sdallas\s|\syonkers\s|\slubbock\s|\sthornton\s|\ssan\s+diego\s|\sgainesville\s|\smontgomery\s|\swestminster\s|\shuntsville\s|\slouisville\s|\spasadena\s|\svancouver\s|\seugene\s|\spalm\s+bay\s|\ssan\s+antonio\s|\sspringfield\s|\shayward\s|\sindianapolis\s|\scolumbia\s|\ssunnyvale\s|\sphoenix\s|\sdayton\s|\ssacramento\s|\severett\s|\ssan\s+jose\s|\skansas\s+city\s|\sscottsdale\s|\sbrownsville\s|\sbillings\s|\splano\s|\smesa\s|\ssanta\s+clarita\s|\schattanooga\s|\sdaly\s+city\s|\somaha\s|\skilleen\s|\smobile\s|\ssimi\s+valley\s|\ssouth\s+bend\s|\sabilene\s|\swichita\s|\scorona\s|\sel\s+paso\s|\sgrand\s+rapids\s|\slafayette\s|\sbaltimore\s|\slos\s+angeles\s|\sallentown\s|\srichardson\s|\sfayetteville\s|\sbuffalo\s/g
var re_skills = getRegexSkills();
var re_seniority = /\ssr\s|\ssr\.\s|\ssnr\s|\ssnr\.\s|\ssenior\s|\sjr\s|\ssr.\s|\sjnr\s|\sjnr\.\s|\sjunior\s|\sentry([\-\s])+level\s|\svp\s|\svp\.\s|\svice\s+president\s|\sc[a-z]o\s|\sc[a-z]o\.\s|\schief\s+[a-z]+\s+officer\s/g;
var re_stopwords = /\sto\s|\sand\s|\s-\s|\sin\s/g;

function parseQuery(rawQryTxt, viewModel){

    var extraQuery = " ";
    
    var statesQry     = "";
    var citiesQry     = "";
    var skillsQry     = "";
    var seniorityQry  = "";
    var noSkillsQry   = "";

    viewModel.reset();
    
    var originalQuery = collapseSpaces(rawQryTxt.replace(/[;\/\-]/g," ")).trim();
    var query = collapseSpaces(originalQuery.replace(/,/g, " ")).toLowerCase();

    var stateMatches = getMatches(re_states, query);
    if(stateMatches)
    {
        addAll(stateMatches, viewModel.states);
        extraQuery += buildQueryForMatches(stateMatches, "state");
        query = removeMatches(query, stateMatches);
        statesQry = comma(toUpper, stateMatches);
    }

    var ucStateMatches = getMatches(re_ucStates, originalQuery);
    if(ucStateMatches)
    {
        ucStateMatches = map(toLower, ucStateMatches);
        addAll(ucStateMatches, viewModel.states);
        extraQuery += buildQueryForMatches(ucStateMatches, "state");
        query = removeMatches(query, ucStateMatches);
        statesQry = comma(toUpper, ucStateMatches);
    }

    var cityMatches = getMatches(re_cities, query);
    if(cityMatches)
    {
        addAll(cityMatches, viewModel.cities);
        extraQuery += buildQueryForMatches(cityMatches, "city");
        query = removeMatches(query, cityMatches);
        citiesQry = comma(toInitialCaps, cityMatches);
    }

    
    var seniorityMatches = getMatches(re_seniority, query);
    if(seniorityMatches)
    {
        // take first item only
        match = seniorityMatches[0].trim();
        extraQuery += "+(skills:" + spacesToSemiColon(match) + " title:\"" + match + "\")^0.2 ";
        query = removeMatches(query, [match]);
        seniorityQry = toInitialCaps(match);			
    }
    
    var skillsMatches = getMatches(re_skills, removeNonSkillWords(query));
    var solrSkillsQry = "";
    if(skillsMatches)
    {
        addAll(skillsMatches, viewModel.skills);
        solrSkillsQry = " " + buildQueryForMatches(map(spacesToSemiColon, skillsMatches), "skills", true).trim();
        noSkillsQry = removeMatches(query, skillsMatches);
        // don't remove skills, leave for job title field
        skillsQry = comma(toInitialCaps, skillsMatches);		
    }

    // remove stop words
    var stopWordMatches = getMatches(re_stopwords, query);
    if(stopWordMatches)
    {
        query = removeMatches(query, stopWordMatches);
    }

    // update query parts
    // TODO pull out into separate object and return that instead - remove side effects
    viewModel.query(query);

    viewModel.statesQry(statesQry);
    viewModel.citiesQry(citiesQry);
    
    viewModel.skillsQry(skillsQry);
    viewModel.solrSkillsQry(solrSkillsQry);
    viewModel.noSkillsQry(noSkillsQry);
    
    viewModel.seniorityQry(seniorityQry);
    viewModel.extraQry(extraQuery);
}