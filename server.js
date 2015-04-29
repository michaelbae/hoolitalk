
Leagues = new Mongo.Collection("leagues");
Fixtures = new Mongo.Collection("fixtures");

Meteor.startup(function () {

    if (Meteor.isServer){

        //Leagues.remove({});
        //Fixtures.remove({});

        // Update server every 24 hours to store the updated leagues and fixtures
        // 86400000 milliseconds = 24 Hours
        setInterval(Meteor.call("storeLeague"), 86400000); 
        setInterval(Meteor.call("storeFixture"), 86400000);
        }
    }
);

  // API call for league

if (Meteor.isServer){

    Meteor.methods({

        getLeague: function () {

            return Meteor.http.call("GET", "http://api.football-data.org/alpha/soccerseasons/", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },

        getFixture: function () {

            return Meteor.http.call("GET", "http://api.football-data.org/alpha/fixtures?timeFrame=n3", {headers: {"X-Auth-Token": "a87a67fb2885496bb1a5274e1eb79236"}});
        },

        storeLeague: function () {

            var data = Meteor.call("getLeague");
            var json = EJSON.stringify(data);
            var obj = EJSON.parse(json);

            for (i=0; i<obj.data.length; i++) {

                 Leagues.insert({

                    caption :  obj.data[i].caption,
                    league  :   obj.data[i].league,                           
                    year    :   obj.data[i].year,
                    numberOfTeams   :   obj.data[i].numberOfTeams,
                    numberOfGames   :   obj.data[i].numberOfGames,
                    lastUpdated :   obj.data[i].lastUpdated,
                    soccerseasons : obj.data[i]._links
                 });
            }            
        },

        storeFixture: function () {

            // var obj = JSON.parse(Meteor.call("getFixture"));

            // for (i=0; i<fixtures.count; i++) {
                // Fixtures.insert({
                    
                    id: 164374834
                    // date: obj.fixtures[i].date,
                    // status: obj.fixtures[i].status,
                    // matchday: obj.fixtures[i].matchday,
                    // homeTeamName: obj.fixtures[i].homeTeamName,
                    // awayTeamName: obj.fixtures[i].awayTeamName,
                    // goalsHomeTeam: obj.fixtures[i].goalsHomeTeam,
                    // goalsAwayTeam: obj.fixtures[i].goalsAwayTeam,
                    // FK_LEAGUES.leaguenumber:        
                    // fixturenumber
                //});
            //}
            
            Fixtures.insert({

                 caption: "lalalalala"
            });
          
        }        
    });
}



