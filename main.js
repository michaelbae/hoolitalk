
//Retrieve existing DBs
Leagues = new Mongo.Collection("leagues");
Fixtures = new Mongo.Collection("fixtures");
Yaks = new Mongo.Collection("yaks");
Comments = new Mongo.Collection("comments");
Test = new Mongo.Collection("test");

var p = new Date(new Date().setDate(new Date().getDate()-3)).toISOString();
var n = new Date(new Date().setDate(new Date().getDate()+3)).toISOString();

Router.map(function () {
 
  this.route('login', {
    path: '/'
  });

  this.route('leagues', {
  	path: '/leagues' 
  }); 

  this.route('fixtures', {
    path: '/leagues/:soccerseasons/fixtures',
    data: function () {return this.params}
  });

  this.route('yaksList', {
   path: '/leagues/:leagueId/fixtures/:fixtureId/yaks',
   data: function() {return this.params}
  });

  this.route('yakSubmit', {
    path: '/leagues/:leagueId/fixtures/:fixtureId/yaks/submit',
    data: function() {return this.params}
  });

  this.route('yakPage', {
    path: '/leagues/:leagueId/fixtures/:fixtureId/yaks/:yakId',
    data: function() {return this.params}
  });

});

