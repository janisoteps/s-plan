import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find();
  });

  Meteor.publish('otherUsers',function(){
   return Meteor.users.find({},{ fields: { 'username': 1 }});
 });

  Meteor.publish('otherFbUsers',function(){
   return Meteor.users.find({},{ fields: { 
    'profile.name': 1, 
    'services.facebook.first_name': 1,
    'services.facebook.id': 1,
  }});
 });


Meteor.methods({
  'tasks.insert'(restaurant, address, date, comment, opengroup, couples) {
    check(restaurant, String);
    check(address, String);
    check(date, String);
    check(comment, String);
    check(opengroup, Boolean);
    check(couples, Boolean);
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    
    var buddies = [];
    var buddiesusernames = [];
    var chat = [];

    Tasks.insert({
    	restaurant,
    	address,
    	date,
    	comment,
    	opengroup,
    	couples,
    	createdAt: new Date(), // current time
    	owner: this.userId,
    	username: Meteor.users.findOne(this.userId).username,
      buddies,
      buddiesusernames,
      chat,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);
 
    const task = Tasks.findOne(taskId);
    if (task.owner !== this.userId) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  
  'tasks.addBuddy'(taskId) {

    const owner = Tasks.findOne(taskId).owner;
    const buddies = Tasks.findOne(taskId).buddies;
    var joiner = this.userId;
    var joinerusername = Meteor.users.findOne(joiner).username;
    if (!joinerusername) {
      var joinerfbname = Meteor.users.findOne(joiner).profile.name;
    }


    function findBuddies(bud){
      return bud.budid === joiner;
    }
    var budcheck = buddies.find(findBuddies);
    console.log(budcheck);

    if(budcheck){
      var checker = "duplicate";
      console.log(checker);
    }
    else{
      var checker = "unique";
      console.log(checker);
    }

    if (checker == "unique"){
      if (joiner !== owner){
        Tasks.update(taskId, { $push: { buddies: {budid: joiner, budname: joinerusername, budfbname: joinerfbname}}});
        Tasks.update(taskId, { $push: { buddiesusernames: joinerusername }});
      }
    }
  },

  'tasks.addChat'(taskId, comment) {
    check(comment, String);
    var author = Meteor.users.findOne(this.userId)._id;
    const owner = Tasks.findOne(taskId).owner;
    const buddies = Tasks.findOne(taskId).buddies;

    var authorusername = Meteor.users.findOne(author).username;
    if (!authorusername) {
      var authorfbname = Meteor.users.findOne(author).profile.name;
    }

    function findBuddies(bud){
      return bud.budid === author;
    }
    var budcheck = buddies.find(findBuddies);

    if(budcheck){
      var checker = "duplicate";
    }
    else{
      var checker = "unique";
    }

    if (checker == "duplicate"){
      Tasks.update(
        {"_id": taskId},
        {$push:{
          chat: {
            author: author, 
            authorusername: authorusername, 
            authorfbname: authorfbname, 
            comment: comment, 
            createdAt: new Date()
          },
        }}
      );
    }
    else {
      if(author == owner){
        Tasks.update(
          {"_id": taskId},
          {$push:{
            chat: {
              author: author, 
              authorusername: authorusername, 
              authorfbname: authorfbname, 
              comment: comment, 
              createdAt: new Date()
            },
          }}
        );
      }
      else{}
    }
  },
});

}