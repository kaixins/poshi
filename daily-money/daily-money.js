Incomes = new Mongo.Collection("incomes");

if (Meteor.isClient) {
    
    Meteor.subscribe("incomes");

  Template.body.events({
    'submit .income-form': function () {
          // update the saved income
         console.log("submit");
         console.log($('.income-form input.income').val());

        var text = $('.income-form input.income').val()

       Meteor.call("addIncome", text);

        // Clear form
        event.target.text = "";
        
       // Meteor.call("")

        // Prevent default form submit
        return false;
    }

  });

  //data
   Template.body.helpers({
       
    incomes: function () {
      return Incomes.find({}, {sort: {createdAt: -1}});
    },
       
    incomes_for_user: function () {
      return Incomes.find({ owner : Meteor.userId() }, {sort: {createdAt: -1}});
    },
    
    total_income_for_user: function () {
        console.log("getting total")
       var total = 0;
        Incomes.find({owner : Meteor.userId() }).map(function(income) {
          total += parseInt(income.value);
        });
        console.log(total);
        return total;
    }  
       
  });
    
  Template.income.events({
      "click .delete": function () {
          console.log("deleting " + this._id);
          Meteor.call("deleteIncome", this._id);
      }
  });

    
    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

Meteor.methods({
  addIncome: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

     Incomes.insert({
          username: Meteor.user().username,
          value: text,
          createdAt: new Date(),
          deleted: false,
          owner: Meteor.userId()
        });
  },
  deleteIncome: function (id) {
     Incomes.remove(id);
  }             
});


if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
      Meteor.publish("incomes", function () {
        return Incomes.find();
      });
  });
}
