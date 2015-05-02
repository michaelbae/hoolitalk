Template.leagues.helpers({
    leagues: function() {
        return Leagues.find({}, { sort: { time: -1}});
    }
})

