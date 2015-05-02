
//Retrieve existing DBs
Leagues = new Mongo.Collection("leagues");
Fixtures = new Mongo.Collection("fixtures");
Yaks = new Mongo.Collection("yaks");
Comments = new Mongo.Collection("comments");


// Router.route('/', {name: 'stringline'})

// Router.route('/login', {name: 'login'})
Router.route('/', {name: 'login'})

Router.route('/leagues', {name: 'leagues'})


Router.route('/leagues/:_id1/fixtures', {
	name: 'fixtures',
	data: function() {
		return Leagues.findOne(this.params._id1);
	}
});

Router.route('/leagues/:_id/fixtures/:_id2/yaks', {
	name: 'yaks',
	data: function() {
		return Fixtures.findOne(this.params._id2);
	}
});

Router.route('/leagues/:_id/fixtures/:_id2/yaks/:_id3', {
	name: 'comments',
	data: function() {
		return Yaks.findOne(this.params._id3);
	}
});