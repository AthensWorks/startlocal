/// Subscribe

Meteor.subscribe("posts");
Meteor.subscribe("categories");
/// Template functions

Template.postlist.posts = function() {
  if (Session.get('sortOrder') == null){
    Session.set('sortOrderIs', 'most_upvotes');
    Session.set('sortOrder', {upvoteCount: -1, updatedAt: -1});
  }

  return Posts.find({}, {
    sort: Session.get('sortOrder')
  });
};

Template.page.showCreateDialog = function() {
  return Session.get("showCreateDialog");
};

Template.postlist.selected_name = function() {
  var post = Posts.findOne(Session.get("selected_post"));
  return post && post.name;
};

Template.post.selected = function() {
  return Session.equals("selected_post", this._id) ? "selected" : '';
};

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

Template.comments.comment_count = function() {
  if (!this.comments)
    return 0;

  return this.comments.length;
};

Template.comment.author_name = function() {
  author = Meteor.users.findOne(this.authorId);

  return author.profile.name;
}

Template.most_recent.sortOrderIs  = sortOrderIs;
Template.most_upvotes.sortOrderIs = sortOrderIs;
Template.categories.sortOrderIs   = sortOrderIs;