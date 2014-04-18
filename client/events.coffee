# Template events

Template.addButton.events(
  'click .add': (event, template) ->
    coords = coordsRelativeToElement(event.currentTarget, event)
    openCreateDialog(coords.x / 500, coords.y / 500)
)

Template.comments.events(
  'click .comment_count': () ->
    $("#" +  this._id + " .comment_list").toggle('fast')

    if !this.comments
      $("#" +  this._id + " .comment_text").select()

    return true
  ,

  'click #submit': () ->
    commentText = $("#" +  this._id + " .comment_text").val()

    Meteor.call("comment", this._id, commentText)
)

Template.createDialog.events(
  'click .save': (event, template) ->
    name = template.find(".name").value
    description = template.find(".description").value
    url = template.find(".url").value
    categories = template.find(".categories").value.split(",")

    categories = categories.map((s) ->
      return s.trim();
    )

    if categories.length == 0
      categories = null;

    if name.length && description.length && url.length
      postId = createPost(
        name: name,
        description: description,
        url: url,
        categories: categories,
      )

      Session.set("selected", postId)
      Session.set("showCreateDialog", false)
    else
      Session.set("createError", "It needs a name, a description and a URL—or why bother?")

  'click .cancel': () ->
    Session.set("showCreateDialog", false)
)

Template.post.events(
  'click .upvotecount': () ->
    element = $('#' + event.currentTarget.id + ".upvotecount")

    element.popover('show')
    setTimeout(
      () -> element.popover('hide'),
      2000
    )
    setTimeout(
      () -> element.popover('destroy'),
      2500
    )
)

Template.upvote_button.events(
  'click .upvote': () ->
    postId = this._id
    userId = Meteor.user()._id

    Meteor.call("upvote", postId, userId)
)

Template.flag_button.events(
  'click .flag': () ->
    postId = this._id
    userId = Meteor.user()._id

    Meteor.call("flag", postId, userId)
)

Template.most_recent.events(
  'click .sort': () ->
    Session.set('sortOrderIs', 'most_recent')
    Session.set('sortOrder', updatedAt: -1)
)

Template.most_upvotes.events(
  'click .sort': () ->
    Session.set('sortOrderIs', 'most_upvotes')
    Session.set(
      'sortOrder',
        upvoteCount: -1,
        updatedAt: -1
    )
)

Template.categories.events(
  'click .sort': () ->
    Session.set('sortOrderIs', 'categories')
    Session.set(
      'sortOrder',
        category: -1,
        upvoteCount: -1,
        updatedAt: -1
    )
)
