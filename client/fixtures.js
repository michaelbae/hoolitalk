// NO MATCH DURING SUMMER SO PRESET THE DATE
// var p = new Date(new Date().setDate(new Date().getDate()-5)).toISOString();
// var n = new Date(new Date().setDate(new Date().getDate()+5)).toISOString();

var p = "2015-05-20T13:30:00Z";
var n = "2015-05-30T13:30:00Z";

Template.fixtures.helpers({
    fixtures: function() {
        return Fixtures.find({leagueId: this.soccerseasons, date: { $gte: p, $lte: n}})
    }
})


