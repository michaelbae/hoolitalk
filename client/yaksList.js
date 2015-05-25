Template.yaksList.helpers({
    yaks: function() {
    	return Yaks.find({fixtureId: this.fixtureId});
    }
})

// Template.yaksList.events({
// 	'submit .yaksSubmitForm': function(event,err) {

// 		event.preventDefault();
// 		var yak = event.target.yak.value; 		// get yak value

// 		// check if the value is empty
// 		if (yak == "") {
// 			alert("You can't insert empty yak. Try to write something funny instead! :)");
// 		} else {
// 			Meteor.call('yakInsert', yak, this);
// 			/*post._id = Yaks.insert(post);*/
// 			Router.go('yaksList');
// 		}
		
// 	}
// });

Template.yaksList.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted
      var text = event.target.text.value;

      Meteor.call("addTask", text, this.fixtureId);

      // Clear form
      event.target.text.value = "";

      // Prevent default form submit
      return false;
    },

  });