
Leagues = new Mongo.Collection("leagues");
Fixtures = new Mongo.Collection("fixtures");



Meteor.startup(function () {
    if (Meteor.isServer){
        //if(updatetime==true){}
        //Leagues.remove({});
        //Fixtures.remove({});

        //24cycle 
        Meteor.call("storeLeague");


        Meteor.call("storeFixture");


        //else

    }
});

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
                    //sample: obj.data[i]
                    caption :  obj.data[i].caption,
                    league  :   obj.data[i].league,                           
                    year    :   obj.data[i].year,
                    numberOfTeams   :   obj.data[i].numberOfTeams,
                    numberOfGames   :   obj.data[i].numberOfGames,
                    lastUpdated :   obj.data[i].lastUpdated,
                    soccerseasons : obj.data[i]._links

                    //self:obj.data[i].links
                    // teams:obj.data[i]._links[1].href,
                    // fixtures:obj.data[i]._links[2].href,
                    // leagueTable:obj.data[i]._links[3].href
                 });
            }            
        },

        storeFixture: function () {
   //      	var obj = JSON.parse(Meteor.call("getFixture"));

			// for (i=0; i<fixtures.count; i++) {
	  //       	Fixtures.insert({
                    id: 164374834
	  //       		date: obj.fixtures[i].date,
	  //       		status: obj.fixtures[i].status,
	  //       		matchday: obj.fixtures[i].matchday,
	  //       		homeTeamName: obj.fixtures[i].homeTeamName,
	  //       		awayTeamName: obj.fixtures[i].awayTeamName,
	  //       		goalsHomeTeam: obj.fixtures[i].goalsHomeTeam,
	  //       		goalsAwayTeam: obj.fixtures[i].goalsAwayTeam,
      //            FK_LEAGUES.leaguenumber:        
                    //fixturenumber
	  //       	});
	  //       }
            Fixtures.insert({

                 caption: "lalalalala"
             });
          
    	}        
    });
}



