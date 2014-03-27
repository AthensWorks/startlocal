/// Template functions

Template.page.showCreateDialog = function() {
  return Session.get("showCreateDialog");
};


Template.postlist.posts = function() {
  if (Session.get('sortOrder') == null){
    Session.set('sortOrderIs', 'most_upvotes');
    Session.set('sortOrder', {upvoteCount: -1, updatedAt: -1});
  }

  return Posts.find({}, {
    sort: Session.get('sortOrder')
  });
};

Template.post.updatedAtString = function() {
  return moment(this.updatedAt).calendar();
}

Template.post.categories = function () {
  //read all categories.posts ids and return categories matching to this posts' id
  cats = Categories.find({posts: this._id});
  if(cats.count() > 0){
    return cats;
	} else {
    // console.log("Found no Categories for the post: "+this._id);
		return;
	}
};

Template.post.upvotedByNames = function () {
  var namesArray = _.map(this.upvotedBy, function(userId) {
    var user = Meteor.users.findOne(userId);

    return displayName(user);
  });

  return namesArray.join(", ");
};

Template.comments.comment_count = function() {
  if (!this.comments) {
    return 0;
  }

  return this.comments.length;
};

Template.comment.createdAtString = function () {
    return moment(this.createdAt).calendar();
}

Template.comment.author_name = function() {
  author = Meteor.users.findOne(this.authorId);

  return displayName(author);
}

Template.upvote_button.upvoted = function(){
  if( Meteor.user() === undefined )
    return false;

  var userId = Meteor.user()._id;

  if (_.contains(this.upvotedBy, userId)){
    return true;
  }

  return false;
};
Template.flag_button.flagged = function(){
  if( Meteor.user() === undefined )
    return false;

  var userId = Meteor.user()._id;

  if (_.contains(this.flaggedBy, userId)){
    return true;
  }

  return false;
};

/// Sort Ordering
Template.most_recent.sortOrderIs = sortOrderIs;

Template.most_upvotes.sortOrderIs = sortOrderIs;

Template.categories.sortOrderIs = sortOrderIs;
