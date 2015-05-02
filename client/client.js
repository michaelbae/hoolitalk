// At the bottom of the client code
Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});

Template.yaksList.helpers({
	yaks: function() {
		return Yaks.find({}, {sort : {score: -1}});
	}
})