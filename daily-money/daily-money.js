Incomes = new Mongo.Collection("incomes");
//Expenses = new Mongo.Collection("expenses");

if (Meteor.isClient) {
    
  Meteor.subscribe("incomes");
 // Meteor.subscribe("expenses");
    
  Accounts.ui.config({
       passwordSignupFields: "USERNAME_ONLY"
  });

  Template.body.events({
      

   /* 'submit .expense-form': function () {
         
         console.log("submit");
         console.log($('.expense-form input.expense').val());

        var amount = $('.expense-form input.expense').val()
          var label = $('.income-form input.label').val();

       Meteor.call("addExpense", amount);

        // Clear form
        event.target.text = "";
        
        // Prevent default form submit
        return false;
    }, */
    'submit .income-form': function () {
          // update the saved income
         console.log("submit");
         console.log($('.income-form input.income').val());

        var amount =  $('.income-form input.income').val();
        var label = $('.income-form input.label').val();
        
       Meteor.call("addIncome", amount);

        // Clear form
        event.target.text = "";
        
        // Prevent default form submit
        return false;
    }
      
      
  });

  //data
   Template.body.helpers({
     
   /* expenses: function () {
      return Expenses.find({}, {sort: {createdAt: -1}});
    },
       
    expenses_for_user: function () {
      return Expenses.find({ owner : Meteor.userId() }, {sort: {createdAt: -1}});
    },
    
    total_expenses_for_user: function () {
       var total = 0;
       Expenses.find({owner : Meteor.userId() }).map(function(income) {
          total += parseInt(income.value);
        });
        return total;
    },
     */  
    incomes: function () {
      return Incomes.find({}, {sort: {createdAt: -1}});
    },
       
    incomes_for_user: function () {
      return Incomes.find({ owner : Meteor.userId() }, {sort: {createdAt: -1}});
    },
    
    total_income_for_user: function () {
       var total = 0;
        Incomes.find({owner : Meteor.userId() }).map(function(income) {
          total += parseInt(income.value);
        });
        return total;
    }  
       
  });
    
  Template.income.events({
      "click .delete": function () {
          console.log("deleting " + this._id);
          Meteor.call("deleteIncome", this._id);
      }
  });
    
    Template.Sidebar.rendered = function() {
    
    };
//end client
}

Meteor.methods({
    
    /*addExpense: function (amount) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Expenses.insert({
          username: Meteor.user().username,
          value: amount,
          label: 'label',
          createdAt: new Date(),
          deleted: false,
          owner: Meteor.userId()
        });
  },*/
  addIncome: function (amount) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

     Incomes.insert({
          username: Meteor.user().username,
          value: amount,
          label: 'label',
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
