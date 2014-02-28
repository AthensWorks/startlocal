if (Meteor.isClient) {

  Meteor.subscribe("posts");

  Template.post_list.posts = function () {
    return Posts.find().fetch();
  };
}

$(function(){
  $('body').on('click', 'a.upvote', function(){
    var postId = $(this).data('id');
    var userId = Meteor.user()._id;

    Meteor.call("upvote", postId, userId);
  });
})