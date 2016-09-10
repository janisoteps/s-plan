import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js'; 
import './body.html';
 

Template.seatingHome.onCreated(function() {
  Meteor.subscribe('tasks');
  var self = this;
  self.autorun(function() {
    var taskId = FlowRouter.getParam('taskId');
    self.subscribe('tasks'); 

    self.subscribe('otherUsers');
  });
});

Template.singlePlan.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var taskId = FlowRouter.getParam('taskId');
    self.subscribe('tasks', taskId); 
    self.subscribe('otherFbUsers');
    self.subscribe('otherUsers'); 
  });
});

Template.userProfile2.onCreated(function() {
  var self = this;
  self.autorun(function() {
    var username = FlowRouter.getParam('username');
    self.subscribe('otherUsers', username);
    self.subscribe('otherFbUsers');
  });
});

Template.task.onCreated(function() {
  var self = this;
  self.autorun(function() {
  self.subscribe('otherUsers'); 
  self.subscribe('otherFbUsers');
  });
});

Template.myprofile.onCreated(function() {
  var self = this;
  self.autorun(function() {
  self.subscribe('otherUsers'); 
  self.subscribe('otherFbUsers');
  });
});

Template.Navbar.onCreated(function() {
  var self = this;
  self.autorun(function() {
  self.subscribe('otherUsers'); 
  self.subscribe('otherFbUsers');
  });
});
Template.Navbar.helpers({
  profilephoto() {
  var userphotoid = Meteor.user;
      try{
        if(Meteor.users.findOne(userphotoid).services.facebook){ 
          var fbpiclink = "http://graph.facebook.com/" + Meteor.users.findOne(userphotoid).services.facebook.id + "/picture/?type=large";
        return  fbpiclink;
        }
        else {
          return "../blank-profile-picture.png"
        }
      }
      finally{
        //return fbpiclink;
      }
    }
});
    


Template.seatingHome.helpers({
  tasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  }
});

Template.task.helpers({
  joiners(){
    return Tasks.findOne({_id:this._id}).buddies;
  },
  createdAt: function() {
    return moment(this.createdAt).fromNow();
  },
  fbusername: function(){
    var poster = Tasks.findOne({_id:this._id}).owner;
    try {
      var posteracc = Meteor.users.findOne({_id:poster}).profile.name;
      if (typeof posteracc !== "undefined"){
        var fucka = Meteor.users.findOne({_id:poster}).services.facebook.first_name;
        return fucka; 
      }
    }
    finally {
      return fucka;
    }
  },
  user: function(){
    var ownerid = Tasks.findOne({_id:this._id}).owner;
    try{
      var ownername = Meteor.users.findOne({_id:ownerid}).username;
    }
    finally{
      return ownername;
    }
  } 
});

Template.singlePlan.helpers({
  plan: function() {
    var taskId = FlowRouter.getParam('taskId');
    var task = Tasks.findOne({_id: taskId}) || {};
    return task;
  },
  joiners(){
    return Tasks.findOne({_id:this._id}).buddies;
  },
  chatters(){
    var chatitems = Tasks.findOne({_id:this._id}).chat;
    chatitems.sort( function(a,b) { return new Date(b.createdAt) - new Date(a.createdAt) } );
    return chatitems;
  },
  createdAt: function() {
    return moment(this.createdAt).fromNow();
  },
  fbusername: function(){
    var poster = Tasks.findOne({_id:this._id}).owner;
    try {
      var posteracc = Meteor.users.findOne({_id:poster}).profile.name;
      if (typeof posteracc !== "undefined"){
        var fucka = Meteor.users.findOne({_id:poster}).services.facebook.first_name;
        return fucka; 
      }
    }
    finally {
      return fucka;
    }
  },
  user: function(){
    var ownerid = Tasks.findOne({_id:this._id}).owner;
    try{
      var ownername = Meteor.users.findOne({_id:ownerid}).username;
    }
    finally{
      return ownername;
    }
  } 
});

Template.userProfile2.helpers({
  guy: function() {
    var gy = FlowRouter.getParam('userid');
    var guy = Meteor.users.findOne({_id: gy}) || {};
    return guy;
  },
  fbusername: function(){
    var profile_id = Meteor.users.findOne(this._id)._id;
    try {
      var profileFbName = Meteor.users.findOne({_id:profile_id}).profile.name;
      if (typeof posteracc !== "undefined"){
        return profileFbName; 
      }
    }
    finally {
      return profileFbName;
    }
  },
  profilephoto(){
    var userphotoid = FlowRouter.getParam('userid');
    try{
      if(Meteor.users.findOne(userphotoid).services.facebook){ 
        var fbpiclink = "http://graph.facebook.com/" + Meteor.users.findOne(userphotoid).services.facebook.id + "/picture/?type=large";
      return  fbpiclink;
      }
      else {
        return "../blank-profile-picture.png"
      }
    }
    finally{
      //return fbpiclink;
    }
  }
}); 

Template.myprofile.helpers({
  profile_name() {
    try{
      var profile_fb_name = Meteor.user().profile.name;
      return profile_fb_name;
    }
    finally{
      return profile_fb_name;
    }
  },
  username() {
    try{
      var profile_fb_name = Meteor.user().username;
      return profile_fb_name;
    }
    finally{
      return profile_fb_name;
    }
  },
  profilephoto(){
    try{
      if(Meteor.user().services.facebook){ 
        var fbpiclink = "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=large";
        var usr = Meteor.user().services.facebook.id;
        console.log(usr);
      return  fbpiclink;
      }
      else {
        fbpiclink = "../blank-profile-picture.png";
      }
    }
    finally{
      return fbpiclink;
    }
  },
  profilecity(){
    try{
      if(Meteor.user().services.facebook){ 
        var fbcity = "http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/me?fields=location";
      return  fbcity.name;
      }
      else {
        fbcity = "Far Away Place";
      }
    }
    finally{
      return fbcity;
    }
  }
});

Template.seatingHome.events({
  'submit .new-task':function(event) {
    // Prevent default browser form submit
    event.preventDefault();
 	var target, restaurant, address, date, comment;
    // Get value from form element
    target = event.target;
    restaurant = target.restaurant.value;
    address = target.address.value;
    date = target.date.value;
 	  comment = target.comment.value;
 	  opengroup = target.opengroup.checked;
 	  couples = target.couples.checked;
    // Insert a task into the collection
    if (restaurant == ""){
      window.alert("Please input a name of restaurant")
    }
    else {
      if (address == ""){
        window.alert("Please input an address of restaurant")
      }
      else {
        if (date == ""){
          window.alert("Please input a date")
        }
        else {
          if (comment == ""){
            window.alert("Please input a comment")
          }
          else {
            Meteor.call('tasks.insert', restaurant, address, date, comment, opengroup, couples);
            // Clear form
            target.restaurant.value = '';
            target.address.value = '';
            target.date.value = '';
            target.comment.value = '';
            target.opengroup.checked = false;
            target.couples.checked = false;
            document.getElementById("inputform").style.height = "60px"; 
          }
        }
      }
    }
    
  },
  'click .openform':function(event){
  	var height = document.getElementById("inputform").style.height;
  	if (height == "440px"){
      document.getElementById("inputform").style.height = "60px"; 	
  	}
  	else {
      document.getElementById("inputform").style.height = "440px"; 
  	}
  },
});
Template.singlePlan.events({
  'click .join'() {
      Meteor.call('tasks.addBuddy', this._id);
    },
    'click .delete'() {
      Meteor.call('tasks.remove', this._id);  
    },
    'submit .new-plan-chat':function(event){
      event.preventDefault();
      var target, comment;
      target = event.target;
      comment = target.singplePlanChat.value;
      Meteor.call('tasks.addChat', this._id, comment);
      target.singplePlanChat.value = '';
    },  
});