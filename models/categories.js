Categories = new Meteor.Collection("categories");

Categories.allow({
  insert: function (userId, category) {
    return true; // anyone can add
  },
  update: function (userId, category, fields, modifier) {
//     if (userId !== category.ownedBy)
//       return false; // not the owner

    var allowed = ["posts"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
//   remove: function (userId, category) {
//     // You can only remove posts that you created and nobody else upvoted.
//     return post.ownedBy === userId;
//   }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

var NonEmptyArray = Match.Where(function (x) {
  check(x, Array);
  return x.length > 0;
});

createCategory = function (options) {
  var id = Random.id();
  Meteor.call('createCategory',_.extend({_id: id},options));
  return id;
};

// checks to see if a category with the same already exists
//  true if exists, false if not exists
checkCategoryExistance = function (newCategoryName) {
  cats = Categories.find({name: newCategoryName});
  return (cats.count()>0);
}

getCategoryExistanceId = function (newCategoryName) {
  return Categories.find({name: newCategoryName}).fetch()[0]._id;
}

addCategoryToPost = function (categoryId, postId) {
  Meteor.call('addToPost',categoryId, postId);
}


Meteor.methods({
  // options should include: name
  createCategory: function (options) {
    check(options, {
      name: NonEmptyString,
      posts: Match.Optional(NonEmptyArray),
      _id: Match.Optional(NonEmptyString)
    });

    if (options.name.length > 64)
      throw new Meteor.Error(413, "Name too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

      var id = options._id || Random.id();
      Categories.insert({
        _id: id,
        ownedBy: this.userId,
        name: options.name,
        createdAt: Date(),
        updatedAt: Date(),
        posts: []//options.posts
      });
      Categories.update(id, {$addToSet: {posts: options.posts} });
      return id;
  },

  addToPost: function (categoryId, postId) {
  	check(categoryId, NonEmptyString);
    check(postId, NonEmptyString);

    var post = Posts.findOne(postId);
    if (! post)
      throw new Meteor.Error(404, "No such post");
    if (_.contains(post.categories, categoryId))
      throw new Meteor.Error(403, "Already has this category");

    Categories.update(categoryId, { $addToSet: {posts: postId}, $set: {updatedAt: Date()} }); // $inc: {postCount: 1} or something?
  },
});

// ///////////////////////////////////////////////////////////////////////////////
// // Users
//
// displayName = function (user) {
//   if (user.profile && user.profile.name)
//     return user.profile.name;
//   return user.emails[0].address;
// };
//
// var contactEmail = function (user) {
//   if (user.emails && user.emails.length)
//     return user.emails[0].address;
//   if (user.services && user.services.facebook && user.services.facebook.email)
//     return user.services.facebook.email;
//   return null;
// };
