FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "seatingHome"});
  }
});

FlowRouter.route('/:taskId', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "singlePlan"});
  }
});

FlowRouter.route('/people/:userid', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "userProfile2"});
  }
});

FlowRouter.route('/profile/:userid', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "myprofile"});
  }
});

FlowRouter.route('/about/us', {
  action: function() {
    BlazeLayout.render("mainLayout", {content: "about"});
  }
});