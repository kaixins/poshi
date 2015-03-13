Incomes = new Mongo.Collection("incomes");

if (Meteor.isClient) {

  Template.body.events({
    'submit .income-form': function () {
          // update the saved income
         console.log("submit");
         console.log($('.income-form input.income').val());
        
        var text = $('.income-form input.income').val()

        Incomes.insert({
          username: Meteor.user().username,
          value: text,
          createdAt: new Date(),
          deleted: false,
          owner: Meteor.userId()
        });

        // Clear form
        event.target.text = "";

        // Prevent default form submit
        return false;
    }

  });

  //data
   Template.body.helpers({
    incomes: function () {
      return Incomes.find({}, {sort: {createdAt: -1}});
    }
       
  //  income_total: function () {
  //     return Incomes.
 //  }   

  });
    
    Template.income.events({
        "click .delete": function () {
            console.log("deleting " + this._id);
            Incomes.remove(this._id);
        }
    });

    
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
