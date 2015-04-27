//Retrieve existing DBs
Leagues = new Mongo.Collection("leagues");

BL1 = new Mongo.Collection("fixtures_bl1");
BL2 = new Mongo.Collection("fixtures_bl2");
BL3 = new Mongo.Collection("fixtures_bl3");
PL = new Mongo.Collection("fixtures_pl");
EL1 = new Mongo.Collection("fixtures_el1");
SA = new Mongo.Collection("fixtures_sa");
SB = new Mongo.Collection("fixtures_sb");
PD = new Mongo.Collection("fixtures_pd");
SD = new Mongo.Collection("fixtures_sd");
FL1 = new Mongo.Collection("fixtures_fl1");
FL2 = new Mongo.Collection("fixtures_fl2");
DED = new Mongo.Collection("fixtures_ded");
PPL = new Mongo.Collection("fixtures_ppl");
GSL = new Mongo.Collection("fixtures_gsl");
CL = new Mongo.Collection("fixtures_cl");

Meteor.startup(function () {
    if (Meteor.isServer){
		//once in 24hr
        Meteor.call("updateDB");
		Meteor.call("adminYak");
    }
});

if (Meteor.isServer){
    Meteor.methods({
        
		//API call for league
        getLeague: function () {
            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons/", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },
		
		//API call for specific league's season worth fixtures
        getFixtures: function (leagueId) {
        	return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons/" + leagueId + "/fixtures/", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },

		//parsing data
        parse: function(data) {
            var json = EJSON.stringify(data);
            return EJSON.parse(json);
        },

		//update entire mongoDB
        updateDB: function(){
            var leagueData = Meteor.call("getLeague");
            var leagueJSON = Meteor.call("parse", leagueData);
            ListOfLeagues to be updated = Meteor.call("updateLeague", leagueJSON);

            for (i=0; i<ListOfLeaguesId.length; i++){
				var fixturesData = Meteor.call("getFixtures", ListOfLeaguesId[i]);
				var fixturesJSON = Meteor.call("parse", fixturesData)
                Meteor.call("updateFixture", ListOfLeagues[i], fixturesJSON)
            }
        },

		//update information about one league/competition in mongoDB AND create a queue of leagues that needs to update its fixtures
        updateLeague: function(league){  
            new list

            for (i=0; i<league.data.length; i++) {
                 //find one league's caption
                 var caption = league.data[i].caption;

                 //find the league's lastUpdated stored in mongo using the previous found caption
                 var oldLeague = Leagues.find({caption: {$e: caption}});
                 
                 //compare the two
                 if (league.data[i].lastUpdated != oldLeague.lastUpdated){
                    //add to the list of league that needs to be updated
                    list.add(league.data[i].id)    
                    //replace with new League
                    Meteor.call("storeLeague", league.data[i]);
                 }
            }  
            return list
        },

		//update a season's worth of fixtures of a specific league
        updateFixture: function(leagueId, fixtures){
            var data = Meteor.call("getFixtures", leagueId);
            var obj = Meteor.call("parse", data);
            
			//find corresponding mongoDB using leagueid
			
            //replace with new League
            Meteor.call("storeFixtures", fixtures.data, leagueId, mongoDB);
        },   
		
        //store information about one league/competition in mongoDB
        storeLeague: function (league) {
            Leagues.insert({
                caption :  league.caption,
                league  :   league.league,                           
                year    :   league.year,
                numberOfTeams   :   league.numberOfTeams,
                numberOfGames   :   league.numberOfGames,
                lastUpdated :   league.lastUpdated,
                soccerseasons : league._links
            });       
        },
		
		//store a season's worth of fixtures of a specific league in mongoDB
        storeFixtures: function (fixtures, leagueId, mongoDB) {
            mongoDB.insert({
                id: 164374834
        		date: obj.fixtures[i].date,
        		status: obj.fixtures[i].status,
        		matchday: obj.fixtures[i].matchday,
        		homeTeamName: obj.fixtures[i].homeTeamName,
        		awayTeamName: obj.fixtures[i].awayTeamName,
        		goalsHomeTeam: obj.fixtures[i].goalsHomeTeam,
        		goalsAwayTeam: obj.fixtures[i].goalsAwayTeam,
             FK_LEAGUES.leaguenumber:        
                fixturenumber
        	});
    	}
		
		adminYak: function(){
			//look at the above 15 league's fixtures mongoDB and find the 3p3n mathches (~150)
			
			//run loop to create 150 yak DB collections.
		}
    });
}

client
1. league page - league.find()
(pass a league's fixture DB)
2. upcoming fixtures - fixturesDB.find(where date is p3n3)
(pass a match DB)
3. match's yak - matchDB.find() 


