Incomes = new Mongo.Collection("incomes");
Expenses = new Mongo.Collection("expenses");

if (Meteor.isClient) {

    Meteor.subscribe("incomes");
    Meteor.subscribe("expenses");

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });

    Template.body.helpers({
        
        //Return lists of incomes and expenses, as well as totals for the logged in user
        
        expenses: function() {
            return Expenses.find({}, { sort: { createdAt: -1 } });
        },

        expenses_for_user: function() {
            return Expenses.find({ owner: Meteor.userId() }, { sort: { createdAt: -1 } });
        },

        total_expenses_for_user: function() {
            var total = 0;
            Expenses.find({ owner: Meteor.userId() }).map(function(expense) {
                total += parseInt(expense.value);
            });
            return total;
        },

        incomes: function() {
            return Incomes.find({}, { sort: { createdAt: -1 } });
        },
        incomes_for_user: function() {
            return Incomes.find({ owner: Meteor.userId() }, { sort: { createdAt: -1 } });
        },
        total_income_for_user: function() {
            var total = 0;
            Incomes.find({ owner: Meteor.userId() }).map(function(income) {
                total += parseInt(income.value);
            });
            return total;
        }
    });

    Template.today.helpers({
        total_now: function() {
            var incomes = 0;
            var expenses = 0;

           Incomes.find({ owner: Meteor.userId() }).map(function(income) {
                incomes += parseInt(income.value);
            });
              
            var expense = 0;
            Expenses.find({ owner: Meteor.userId() }).map(function(expense) {
                expenses += parseInt(expense.value);
            });
              
            return incomes - expenses;
        }
    });
    
    Template.expenseForm.events({
        'submit .expense-form': function() {

            var amount = $('.expense-form input.amount').val();
            var label = $('.expense-form input.label').val();

            Meteor.call("addExpense", amount, label);

            event.target.text = "";

            // Prevent default form submit
            return false;
        }
    });
    
    Template.incomeForm.events({
        'submit .income-form': function() {
            var amount = $('.income-form input.amount').val();
            var label = $('.income-form input.label').val();

            Meteor.call("addIncome", amount, label);

            event.target.text = "";

            // Prevent default form submit
            return false;
        }
    });
    Template.listItem.events({
        "click .delete": function() {
            Meteor.call("deleteItem", this._id);
        }
    });
    //end client
}

Meteor.methods({
    addExpense: function(amount, label) {
        // Make sure the user is logged in
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Expenses.insert({
            username: Meteor.user().username,
            value: amount,
            label: label,
            createdAt: new Date(),
            deleted: false,
            owner: Meteor.userId()
        });
    },

    addIncome: function(amount, label) {
        // Make sure the user is logged
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Incomes.insert({
            username: Meteor.user().username,
            value: amount,
            label: label,
            createdAt: new Date(),
            deleted: false,
            owner: Meteor.userId()
        });
    },
    //delete an income or expense
    deleteItem: function(id) {
        var exp = Expenses.findOne(id);
        var inc = Incomes.findOne(id);

        if(inc != undefined){
            Incomes.remove(id);
        }
        else if(exp != undefined){
             Expenses.remove(id);
        }
     
    }
});


if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
        Meteor.publish("incomes", function() {
            return Incomes.find();
        });
        Meteor.publish("expenses", function() {
            return Expenses.find();
        });
    });
}
