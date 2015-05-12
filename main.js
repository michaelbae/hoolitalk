
//Retrieve existing DBs
Leagues = new Mongo.Collection("leagues");
Fixtures = new Mongo.Collection("fixtures");
Yaks = new Mongo.Collection("yaks");
Comments = new Mongo.Collection("comments");
Test = new Mongo.Collection("test");

var p = new Date(new Date().setDate(new Date().getDate()-3)).toISOString();
var n = new Date(new Date().setDate(new Date().getDate()+3)).toISOString();

Router.map(function () {
  this.route('leagues', {
  	path: '/leagues' 
  }); 

  this.route('login', {
    path: '/'
  });

  this.route('yaksSubmit', {
    path: '/submit'
  });

  this.route('yakPage', {
    path: '/yaks/:_id',
    data: function() {return Yaks.findOne(this.params._id)}
  });

  this.route('fixtures', {
    path: '/leagues/:soccerseasons/fixtures',
    data: function () {return this.params}
  });

 this.route('yaksList', {
   path: '/leagues/:leagueId/fixtures/:fixtureId/yaks',
   data: function() {return this.params}
  });
 
});

