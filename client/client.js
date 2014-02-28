if (Meteor.isClient) {

  Meteor.subscribe("posts");

  Template.post_list.posts = function () {
    return Posts.find().fetch();
  };

}