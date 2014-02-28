if (Meteor.isClient) {

  Template.post_list.posts = function () {
    return Posts.find({});
  };

}