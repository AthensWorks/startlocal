if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.startup(function() {
    return Meteor.methods({
      removeAllPosts: function() {
        return Posts.remove({});
      }
    });
  });