//!!!!!!!!!!!!!
//ASSUMPTION: Seasons lastUpdated is the indication of table or fixtures udpate
// max 50req/min API-call restriction must be stricted follow by spreading out the requests in different intervals.
// league request = 1, fixtures request = 13, tables request = 12, teams request = 13, squads request = 13

Meteor.startup(function () {
    if (Meteor.isServer){
        
        // Leagues.remove({});
        // Fixtures.remove({});
        // Tables.remove({});
        // Teams.remove({});

        // 86400000 milliseconds = 24 Hours
        Meteor.setInterval(Meteor.call("updateDB"), 86400000);
        //Meteor.call("updateDB");

    }
});

Meteor.methods({

        //get Data from http://api.football-data.org
        getLeague: function () {
            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons", 
                {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}, query: {"season": new Date().getFullYear()}});
        },
        
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
        
        getLeagueIds: function() {
            //call DB
            var listOfLeagueIds = [];
            Leagues.find({}, {soccerseasons:1, _id:0}).forEach(function(obj){
                listOfLeagueIds.push(obj.soccerseasons)
            });
            return listOfLeagueIds;
        },

        updateDB: function(){
            Meteor.call("updateLeague"); // once a season
            Meteor.call("updateFixture"); //once a day
            Meteor.call("updateTable"); //once an hour
            Meteor.call("updateTeam"); //once a season
        },
 
        updateLeague: function(){  

            var leagueData = Meteor.call("getLeague");
            var leagueJSON = Meteor.call("parse", leagueData);

            for (i=0; i<leagueJSON.data.length; i++) {
                Meteor.call("storeLeague", leagueJSON.data[i]);
            }
        }, 

        storeLeague: function (league) {

                var url = league._links.self.href;
                var leagueNumber = url.substr(url.lastIndexOf('/') + 1);

                if (Leagues.find({soccerseasons : leagueNumber}, {'soccerseasons' : 1}).count() > 0)
                {
                    Leagues.update({soccerseasons : leagueNumber}, {
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
        },

        updateFixture: function(){

            var listOfLeagueIds = Meteor.call("getLeagueIds");

            for (i=0; i<listOfLeagueIds.length; i++) {
                
                 var fixturesData = Meteor.call("getFixtures", listOfLeagueIds[i]);
                 var fixturesJSON = Meteor.call("parse", fixturesData);
                 
                for(j=0; j<fixturesJSON.data.fixtures.length; j++){  
                    Meteor.call("storeFixtures", fixturesJSON.data.fixtures[j], listOfLeagueIds[i]);
                }
            }
        }, 

        storeFixtures: function (singleFixture, leagueId) {

                var uri = singleFixture._links.self.href;
                var fixtureNumber = uri.substr(uri.lastIndexOf('/') + 1);
                
                if (Fixtures.find({fixtureId : fixtureNumber}, {'fixtureId': 1}).count()>0){
                    Fixtures.update({fixtureId : fixtureNumber},{
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

        updateTable: function(){

            var listOfLeagueIds = Meteor.call("getLeagueIds");

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

        storeTable: function (singleStanding, leagueId) {

                var uri = singleStanding._links.team.href;
                var teamNumber = uri.substr(uri.lastIndexOf('/') + 1);
                
                if (Tables.find({teamId : teamNumber}, {'teamId': 1}).count()>0){
                    Tables.update({teamId : teamNumber},{
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

        updateTeam: function(){

            var listOfLeagueIds = Meteor.call("getLeagueIds");

            Teams.remove({});
            
            for (i=0; i<listOfLeagueIds.length; i++){
                var teamData = Meteor.call("getTeams", listOfLeagueIds[i]);
                var teamJSON = Meteor.call("parse", teamData);

                for(j=0; j<teamJSON.data.count; j++){  
                        Meteor.call("storeTeam", teamJSON.data.teams[j], listOfLeagueIds[i]);
                }    
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


        //this will require around ~7 minutes server downtime due to api req caps.
        // updateSquad: function(){

        // },

        // storeSquad: function(singleSquad, leagueId) {

        // }

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