Template.table.helpers({
    standings: function() {
        return Tables.find({leagueId: this.soccerseasons}, { sort: { position: 1}})
    }
}),

Template.standing.helpers({
	teamLogo: function(){
		var crestUrl;
		Teams.find({name: this.teamName}, {crestUrl:1}).forEach(function(obj){
            crestUrl = obj.crestUrl
        });
        return crestUrl;
	}
})
