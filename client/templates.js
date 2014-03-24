/// Template functions

Template.postlist.posts = function() {
  if (Session.get('sortOrder') == null){
    Session.set('sortOrderIs', 'most_recent');
    Session.set('sortOrder', {updatedAt: -1});
  }

  return Posts.find({}, {
    sort: Session.get('sortOrder')
  });
};

Template.page.showCreateDialog = function() {
  return Session.get("showCreateDialog");
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

Template.post.upvotedByNames = function () {
  var namesArray = _.map(this.upvotedBy, function(userId) {
    var user = Meteor.users.findOne(userId);

    if( user === undefined ) {
      return "";
    }

    if( user.profile ) {
      return user.profile.name;
    } else {
      return user.emails[0].address.split("@")[0];
    }
  });

  return namesArray.join(", ");
};

/// Sort Ordering
Template.most_recent.sortOrderIs = sortOrderIs;

Template.most_upvotes.sortOrderIs = sortOrderIs;

Template.categories.sortOrderIs = sortOrderIs;
