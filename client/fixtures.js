
var p = new Date(new Date().setDate(new Date().getDate()-5)).toISOString();
var n = new Date(new Date().setDate(new Date().getDate()+5)).toISOString();

Template.fixtures.helpers({
    fixtures: function() {
        return Fixtures.find({leagueId: this.soccerseasons, date: { $gte: p, $lte: n}})
    }
})


