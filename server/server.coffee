if Meteor.isServer
  Meteor.startup(() ->
    return Meteor.methods(
      removeAllPosts: () ->
        return Posts.remove({})
    )
  )

  Meteor.publish("posts", () ->
    return Posts.find({ flagCount: { $lt: 5 } })
  )

  Meteor.publish("categories", () ->
    return Categories.find({})
  )
