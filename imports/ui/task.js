import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Tasks } from '../api/tasks.js';
 
import './task.html';
import './body.html';

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('MM-DD-YYYY');
});
 
Template.task.events({
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .join'() {
    Meteor.call('tasks.addBuddy', this._id);
  },
});


