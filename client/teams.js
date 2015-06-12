Template.teams.helpers({
    teams: function() {
        return Teams.find({leagueId: this.soccerseasons}, { sort: { squadMarketValue: -1}})
    }
})
