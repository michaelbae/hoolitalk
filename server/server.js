//!!!!!!!!!!!!!
//ASSUMPTION: Seasons lastUpdated is the indication of table or fixtures udpate
Meteor.startup(function () {
    if (Meteor.isServer){
		
        // Leagues.remove({});
        // Fixtures.remove({});
        
       // Update server every 24 hours to store the updated leagues and fixtures
        // 86400000 milliseconds = 24 Hours
        //setInterval(Meteor.call("updateDB"), 86400000);

        //Meteor.call("updateDB");
    }
});

Meteor.methods({
        
		//API call for league
        getLeague: function () {
            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons", 
                {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}, query: {"season": new Date().getFullYear()}});

            //TODO: should check the response status is 200. Otherwise try again. Timeout
        },
		
		//API call for specific league's season worth fixtures
        getFixtures: function (leagueId) {
            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons/" + leagueId + "/fixtures/", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },

        getTables: function (leagueId) {
            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons/" + leagueId + "/leagueTable/", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },

        getTeams: function (leagueId) {
            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons/" + leagueId + "/teams/", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },

		//parsing data
        parse: function(data) {
            var json = EJSON.stringify(data);
            return EJSON.parse(json);
        },

		//update entire mongoDB
        updateDB: function(){
            
            //update league
            var leagueData = Meteor.call("getLeague");
            var leagueJSON = Meteor.call("parse", leagueData);
            var listOfUpdatedLeaguesId = Meteor.call("updateLeague", leagueJSON);
            //Fixtures.insert(listOfUpdatedLeaguesId);
            //Meteor.call("updateFixture", listOfUpdatedLeaguesId);
            //Meteor.call("updateTable", listOfUpdatedLeaguesId);
            Meteor.call("updateTeam", listOfUpdatedLeaguesId);
        },

		//update information about one league/competition in mongoDB 
        updateLeague: function(league){  
            var listOfUpdatedLeaguesNumber = [];
            for (i=0; i<league.data.length; i++) {
                listOfUpdatedLeaguesNumber.push(Meteor.call("storeLeague", league.data[i]));
            }
            return listOfUpdatedLeaguesNumber;
        }, 
		//update a season's worth of fixtures of a specific league
        updateFixture: function(listOfLeagueIds){

            //#of leagues
            for (i=0; i<listOfLeagueIds.length; i++) {
                
                 var fixturesData = Meteor.call("getFixtures", listOfLeagueIds[i]);
                 var fixturesJSON = Meteor.call("parse", fixturesData);
                 
                for(j=0; j<fixturesJSON.data.fixtures.length; j++){  
                    Meteor.call("storeFixtures", fixturesJSON.data.fixtures[j], listOfLeagueIds[i]);
                }
            }
        }, 

        updateTable: function(listOfLeagueIds){

            for (i=0; i<listOfLeagueIds.length; i++){
                if (listOfLeagueIds[i] != "362"){
                    var tableData = Meteor.call("getTables", listOfLeagueIds[i]);
                    var tableJSON = Meteor.call("parse", tableData);

                    for(j=0; j<tableJSON.data.standing.length; j++){  
                        Meteor.call("storeTable", tableJSON.data.standing[j], listOfLeagueIds[i]);
                    }
                }
            }
        },

        updateTeam: function(listOfLeagueIds){

            Teams.remove({});
            
            for (i=0; i<listOfLeagueIds.length; i++){
                var leagueId = listOfLeagueIds[i];
                var teamData = Meteor.call("getTeams", leagueId);
                var teamJSON = Meteor.call("parse", teamData);

                for(j=0; j<teamJSON.data.count; j++){  
                        Meteor.call("storeTeam", teamJSON.data.teams[j], leagueId);
                }    
            }
        },
		
        //store data about one league/competition in mongoDB
        storeLeague: function (league) {

                var url = league._links.self.href;
                var leagueNumber = url.substr(url.lastIndexOf('/') + 1);

                if (Leagues.find({soccerseasons : {$eq: leagueNumber}}, {'soccerseasons' : 1}).count() > 0)
                {
                    Leagues.update({soccerseasons : {$eq: leagueNumber}}, {
                        caption :  league.caption,
                        league  :   league.league,                           
                        year    :   league.year,
                        numberOfTeams   :   league.numberOfTeams,
                        numberOfGames   :   league.numberOfGames,
                        lastUpdated :   league.lastUpdated,
                        soccerseasons : leagueNumber
                    });        
                } else {
                    Leagues.insert({
                        caption :  league.caption,
                        league  :   league.league,                           
                        year    :   league.year,
                        numberOfTeams   :   league.numberOfTeams,
                        numberOfGames   :   league.numberOfGames,
                        lastUpdated :   league.lastUpdated,
                        soccerseasons : leagueNumber
                    }); 
                }  
                return leagueNumber;        
        },

        //store one fixture into DB
        storeFixtures: function (singleFixture, leagueId) {

                var uri = singleFixture._links.self.href;
                var fixtureNumber = uri.substr(uri.lastIndexOf('/') + 1);
                
                if (Fixtures.find({fixtureId : {$eq: fixtureNumber}}, {'fixtureId': 1}).count()>0){
                    Fixtures.update({fixtureId : {$eq: fixtureNumber}},{
                        date: singleFixture.date,
                        status: singleFixture.status,
                        matchday: singleFixture.matchday,
                        homeTeamName: singleFixture.homeTeamName,
                        awayTeamName: singleFixture.awayTeamName,
                        result: singleFixture.result,     
                        fixtureId: fixtureNumber,
                        leagueId: leagueId
                    })
                } else {
                    Fixtures.insert({
                        date: singleFixture.date,
                        status: singleFixture.status,
                        matchday: singleFixture.matchday,
                        homeTeamName: singleFixture.homeTeamName,
                        awayTeamName: singleFixture.awayTeamName,
                        result: singleFixture.result,     
                        fixtureId: fixtureNumber,
                        leagueId: leagueId
                    });
                }
        },

        
        storeTable: function (singleStanding, leagueId) {

                var uri = singleStanding._links.team.href;
                var teamNumber = uri.substr(uri.lastIndexOf('/') + 1);
                
                if (Tables.find({teamId : {$eq: teamNumber}}, {'teamId': 1}).count()>0){
                    Tables.update({teamId : {$eq: teamNumber}},{
                        position: singleStanding.position,
                        teamName: singleStanding.teamName,
                        playedGames: singleStanding.playedGames,
                        points: singleStanding.points,
                        goals: singleStanding.goals,
                        goalsAgainst: singleStanding.goalsAgainst,     
                        goalDifference: singleStanding.goalDifference,
                        teamId: teamNumber,
                        leagueId: leagueId
                    })
                } else {
                    Tables.insert({
                        position: singleStanding.position,
                        teamName: singleStanding.teamName,
                        playedGames: singleStanding.playedGames,
                        points: singleStanding.points,
                        goals: singleStanding.goals,
                        goalsAgainst: singleStanding.goalsAgainst,     
                        goalDifference: singleStanding.goalDifference,
                        teamId: teamNumber,
                        leagueId: leagueId
                    });
                }
        },

        storeTeam: function (singleTeam, leagueId) {

            var uri = singleTeam._links.self.href;
            var teamNumber = uri.substr(uri.lastIndexOf('/') + 1);
            
            Teams.insert({
                    name: singleTeam.name,
                    code: singleTeam.code,
                    shortName: singleTeam.shortName,
                    squadMarketValue: singleTeam.squadMarketValue,
                    crestUrl: singleTeam.crestUrl,
                    teamId: teamNumber,
                    leagueId: leagueId
            });
        },


        yakInsert: function(yak, fixtureId) {
            var postId = Yaks.insert({
                yak : yak, 
                score : 0,
                fixtureId: '136714', 
                submitted : new Date()
            });
        }, 

        commentInsert: function(comment) {
            Comments.insert(comment);
        },

        addTask: function (text, fixtureId) {
            Yaks.insert({
              yak: text,
              score : 0,
              fixtureId: fixtureId, 
              submitted: new Date(),
              username: Meteor.user().username || Meteor.user().profile.name 
            });
        }
})

