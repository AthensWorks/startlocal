 # Template functions

Template.page.showCreateDialog = () ->
  return Session.get("showCreateDialog")


Template.postlist.posts = () ->
  if Session.get('sortOrder') == null
    Session.set('sortOrderIs', 'most_upvotes')
    Session.set('sortOrder', {upvoteCount: -1, updatedAt: -1})

  return Posts.find(
    {},
    {sort: Session.get('sortOrder')}
  )

Template.post.updatedAtString = () ->
  return moment(this.updatedAt).calendar()

Template.post.categories = () ->
  # read all categories.posts ids and return categories matching to this posts' id
  cats = Categories.find({posts: this._id})
  if cats.count() > 0
    return cats
  else
    # console.log("Found no Categories for the post: "+this._id)
    return

Template.post.upvotedByNames = () ->
  namesArray = _.map(this.upvotedBy, (userId) ->
    user = Meteor.users.findOne(userId)

    return displayName(user)
  )

  return namesArray.join(", ")

Template.comments.comment_count = () ->
  if !this.comments
    return 0

  return this.comments.length

Template.comment.createdAtString = () ->
    return moment(this.createdAt).calendar()

Template.comment.author_name = () ->
  author = Meteor.users.findOne(this.authorId)

  return displayName(author)

Template.upvote_button.upvoted = () ->
  if Meteor.user() is undefined
    return false

  userId = Meteor.user()._id

  if _.contains(this.upvotedBy, userId)
    return true

  return false

Template.flag_button.flagged = () ->
  if Meteor.user() is undefined
    return false

  userId = Meteor.user()._id

  if _.contains(this.flaggedBy, userId)
    return true

  return false

# Sort Ordering
Template.most_recent.sortOrderIs = sortOrderIs

Template.most_upvotes.sortOrderIs = sortOrderIs

Template.categories.sortOrderIs = sortOrderIs
