@Categories = new Meteor.Collection("categories")

Categories.allow(
  insert: (userId, category) ->
    return true // anyone can add
  ,
  update: (userId, category, fields, modifier) ->
     # if (userId !== category.ownedBy)
     # return false // not the owner

    allowed = ["posts"]
    if _.difference(fields, allowed).length
      return false # tried to write to forbidden field

    # A good improvement would be to validate the type of the new
    # value of the field (and if a string, the length.) In the
     # future Meteor will have a schema system to makes that easier.
    return true
  #,
  # remove:  (userId, category) {
  # You can only remove posts that you created and nobody else upvoted.
  # return post.ownedBy === userId
  # }
)

NonEmptyString = Match.Where((x) ->
  check(x, String)
  return x.length > 0
)

NonEmptyArray = Match.Where((x) ->
  check(x, Array)
  return x.length > 0
)

@createCategory = (options) ->
  id = Random.id()
  Meteor.call('createCategory',_.extend({_id: id}, options))
  return id

# checks to see if a category with the same already exists
#  true if exists, false if not exists
@checkCategoryExistance = (newCategoryName) ->
  cats = Categories.find({name: newCategoryName})
  return (cats.count()>0)

@getCategoryExistanceId = (newCategoryName) ->
  return Categories.find({name: newCategoryName}).fetch()[0]._id

@addCategoryToPost = (categoryId, postId) ->
  Meteor.call('addToPost',categoryId, postId)


Meteor.methods(
  # options should include: name
  createCategory: (options) ->
    check(options,
      name: NonEmptyString,
      posts: Match.Optional(NonEmptyArray),
      _id: Match.Optional(NonEmptyString)
    )

    if options.name.length > 64
      throw new Meteor.Error(413, "Name too long")
    if !this.userId
      throw new Meteor.Error(403, "You must be logged in")

      id = options._id || Random.id()
      Categories.insert(
        _id: id,
        ownedBy: this.userId,
        name: options.name,
        createdAt: Date(),
        updatedAt: Date(),
        posts: [] #options.posts
      )
      Categories.update(id, {$addToSet: {posts: options.posts} })
      return id
  ,

  addToPost: (categoryId, postId) ->
    check(categoryId, NonEmptyString)
    check(postId, NonEmptyString)

    post = Posts.findOne(postId)
    if !post
      throw new Meteor.Error(404, "No such post")
    if _.contains(post.categories, categoryId)
      throw new Meteor.Error(403, "Already has this category")

    Categories.update(categoryId, { $addToSet: {posts: postId}, $set: {updatedAt: Date()} }) # $inc: {postCount: 1} or something?
  ,
)
