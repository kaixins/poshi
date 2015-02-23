Incomes = new Mongo.Collection("incomes");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('s_income', 0);

  Template.income.helpers({
    income: function () {
      return Session.get('s_income');
    }
  });

  Template.income.events({
    'submit #income-form': function () {
          // update the saved income
        Session.set('s_income', text);

        Tasks.insert({
          user: 'kai',
          value: text,
          createdAt: new Date(),
          deleted: false
        });

        // Clear form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
    }

  });

  //data
   Template.body.helpers({
    incomes: function () {
      return Incomes.find({}, {sort: {createdAt: -1}});
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
