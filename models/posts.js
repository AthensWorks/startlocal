Posts = new Meteor.Collection("posts");

Posts.allow({
  insert: function (userId, post) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function (userId, post, fields, modifier) {
    if (userId !== post.ownedBy)
      return false; // not the owner

    var allowed = ["name", "url", "description", "categories"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, post) {
    // You can only remove posts that you created and nobody else upvoted.
    return post.ownedBy === userId && upvoteCount(post) === 1;
  }
});

upvoteCount = function (post) {
  return post.upvotedBy.length;
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

var NonEmptyArray = Match.Where(function (x) {
  check(x, Array);
  return x.length > 0;
});

createPost = function (options) {
  var id = Random.id();
  Meteor.call('createPost', _.extend({ _id: id }, options));
  return id;
};

Meteor.methods({
  // options should include: name, url, description
  createPost: function (options) {
    check(options, {
      name: NonEmptyString,
      url: NonEmptyString,
      description: NonEmptyString,
      _id: Match.Optional(NonEmptyString)
    });

    if (options.name.length > 64)
      throw new Meteor.Error(413, "Name too long");
    if (options.description.length > 144)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    var id = options._id || Random.id();
    Posts.insert({
      _id: id,
      ownedBy: this.userId,
      name: options.name,
      description: options.description,
      url: options.url,
      upvotedBy: [this.userId],
      upvoteCount: 1,
      flaggedBy: [],
      flagCount: 0,
      comments: [],
      createdAt: Date(),
      updatedAt: Date(),
    });
    return id;
  },

  upvote: function (postId, userId) {
    check(postId, String);
    check(userId, String);

    var post = Posts.findOne(postId);
    if (! post)
      throw new Meteor.Error(404, "No such post");
    if (_.contains(post.upvotedBy, userId))
      throw new Meteor.Error(403, "Already upvoted");

    Posts.update(postId, { $addToSet: {upvotedBy: userId}, $inc: {upvoteCount: 1}, $set: {updatedAt: Date()} });
  },

  flag: function (postId, userId) {
    check(postId, String);
    check(userId, String);

    var post = Posts.findOne(postId);
    if (! post)
      throw new Meteor.Error(404, "No such post");
    if (_.contains(post.flaggedBy, userId))
      throw new Meteor.Error(403, "Already flagged");

    Posts.update(postId, { $addToSet: {flaggedBy: userId}, $inc: {flagCount: 1}, $set: {updatedAt: Date()} });
  },

  comment: function (postId, authorId, commentText) {
    check(postId, String);
    check(authorId, String);
    check(commentText, String);

    var post = Posts.findOne(postId);
    var authorId = Meteor.user()._id;

    if (! post)
      throw new Meteor.Error(404, "No such post");

    Posts.update(postId, {$addToSet: {comments: {
      createdAt: Date(),
      authorId: authorId,
      text: commentText
    }}});

    return this;
  }
});
