Template.table.helpers({
    standings: function() {
        return Tables.find({leagueId: this.soccerseasons}, { sort: { position: 1}})
    }
})
