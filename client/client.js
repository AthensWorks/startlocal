if (Meteor.isClient) {

  Meteor.subscribe("posts");

  Template.post_list.posts = function () {
    return Posts.find().fetch();
  };

  upNow = function (){
  	var postId = this.parent.id; 	// not right
  	var userId = Meteor.user()._id;
  	Meteor.call("upvote",postId,userId);
  }
}