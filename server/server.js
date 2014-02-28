if (Meteor.isServer) {
  // Meteor.startup(function() {
  //   return Meteor.methods({
  //     removeAllPosts: function() {
  //       return Posts.remove({});
  //     }
  //   });
  // });

  Meteor.publish("posts", function () {
    return Posts.find({ $where: "this.flaggedBy.length < 5" });
  });

}