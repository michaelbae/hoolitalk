Template.leagues.helpers({
    leagues: function() {
        return Leagues.find({}, { sort: { time: -1}});
    }
})

// Template.league.events({

//     "click .enter": function () {
//       //Meteor.call("deleteTask", this.soccerseasons);
//       Router.go('fixtures');
//     }
// });