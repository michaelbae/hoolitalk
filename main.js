
//Retrieve existing DBs
Leagues = new Mongo.Collection("leagues");
Fixtures = new Mongo.Collection("fixtures");
Yaks = new Mongo.Collection("yaks");
Comments = new Mongo.Collection("comments");


Router.map(function () {
  this.route('leagues', {
  	path: '/leagues', 
  });  // By default, path = '/about', template = 'about'
  this.route('login', {
    path: '/',  //overrides the default '/home'
  });
  this.route('fixtures', {
  	path: '/fixtures/:soccerseasons',
  	data: function () {return Fixtures.find({leagueId: this.params.soccerseasons})},
  });

  // this.route('articles', {
  //   data: function () {return Articles.find()}  //set template data context
  // });
  // this.route('article', {
  //   path: '/article/:_id',
  //   data: function () {return Articles.findOne({_id: this.params._id})},
  //   template: 'fullArticle'
  // });
});



// Router.route('/leagues/:_id1/fixtures', {
// 	name: 'fixtures',
// 	data: function() {
// 		return Leagues.findOne(this.params._id1);
// 	}
// });



// Router.route('/leagues/:_id/fixtures/:_id2/yaks', {
// 	name: 'yaks',
// 	data: function() {
// 		return Fixtures.findOne(this.params._id2);
// 	}
// });

// Router.route('/leagues/:_id/fixtures/:_id2/yaks/:_id3', {
// 	name: 'comments',
// 	data: function() {
// 		return Yaks.findOne(this.params._id3);
// 	}
// });