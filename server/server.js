if (Meteor.isServer) {
  Meteor.startup(function() {
    return Meteor.methods({
      removeAllPosts: function() {
        return Posts.remove({});
      }
    });
  });

  Meteor.publish("posts", function () {
    return Posts.find({ flagCount: { $lt: 5 } });
  });

  Meteor.publish("categories", function () {
    return Categories.find({});
  });

  Meteor.publish("allUserData", function () {
    return Meteor.users.find({});
  });
}
