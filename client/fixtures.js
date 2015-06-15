// NO MATCH DURING SUMMER SO PRESET THE DATE
// var p = new Date(new Date().setDate(new Date().getDate()-5)).toISOString();
// var n = new Date(new Date().setDate(new Date().getDate()+5)).toISOString();

var p = "2015-05-20T13:30:00Z";
var n = "2015-05-30T13:30:00Z";

// Template.fixtures.helpers({
//     fixtures: function() {
//         Fixtures.find({leagueId: this.soccerseasons, date: { $gte: p, $lte: n}}).forEach(function(obj){
//                 var teamlogo
//             });
//     }
// })

Template.fixtures.helpers({
    fixtures: function() {
        return Fixtures.find({leagueId: this.soccerseasons, date: { $gte: p, $lte: n}});
    }

    // firstTeam: function() {
    // 	var crestUrl;
   	//     Fixtures.find({leagueId: this.soccerseasons, date: { $gte: p, $lte: n}}).forEach(function(obj){
            
    //         Teams.find({name: obj.homeTeamName}, {crestUrl:1}).forEach(function(obj2){
	   //          crestUrl = obj2.crestUrl
	   //      });
    //     });;
    //     return crestUrl;
    // }
}),

Template.fixture.helpers({
	homeTeamLogo: function(){
		var crestUrl;
		Teams.find({name: this.homeTeamName}, {crestUrl:1}).forEach(function(obj){
            crestUrl = obj.crestUrl
        });
        return crestUrl;
	},

	awayTeamLogo: function(){
		var crestUrl;
		Teams.find({name: this.awayTeamName}, {crestUrl:1}).forEach(function(obj){
            crestUrl = obj.crestUrl
        });
        return crestUrl;
	}
})

