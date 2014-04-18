# Template events

Template.addButton.events({
  'click .add': function(event, template) {
    var coords = coordsRelativeToElement(event.currentTarget, event);
    openCreateDialog(coords.x / 500, coords.y / 500);
  }
});

Template.comments.events({
  'click .comment_count': function() {
    $("#" +  this._id + " .comment_list").toggle('fast');

    if( !this.comments ) {
      $("#" +  this._id + " .comment_text").select();
    }

    return true;
  },

  'click #submit': function() {
    commentText = $("#" +  this._id + " .comment_text").val()

    Meteor.call("comment", this._id, commentText);
  }
});

Template.createDialog.events({
  'click .save': function(event, template) {
		var name = template.find(".name").value;
		var description = template.find(".description").value;
		var url = template.find(".url").value;
		var categories = template.find(".categories").value.split(",");


		if (name.length && description.length && url.length) {
			var postId = createPost({
				name: name,
				description: description,
				url: url,
			});


		  categories = categories.map(function(s) {
  			var categoryId = createCategory({
  				name: s.trim(),
  			});

        addCategoryToPost(categoryId,postId);
  			return postId;
	   });

			Session.set("selected", postId);
			Session.set("showCreateDialog", false);
		}
    else {
			Session.set("createError", "It needs a name, a description and a URL—or why bother?");
		}
  },

  'click .cancel': function() {
    Session.set("showCreateDialog", false);
  }
});

Template.post.events({
  'click .upvotecount': function() {
    var element = $('#' + event.currentTarget.id + ".upvotecount");

    element.popover('show');
    setTimeout(function() { element.popover('hide'); }, 2000);
    setTimeout(function() { element.popover('destroy'); }, 2500);
  }
});

Template.upvote_button.events({
  'click .upvote': function() {
    var postId = this._id;
    var userId = Meteor.user()._id;

    Meteor.call("upvote", postId, userId);
  }
});

Template.flag_button.events({
  'click .flag': function() {
    var postId = this._id;
    var userId = Meteor.user()._id;

    Meteor.call("flag", postId, userId);
  }
});

Template.most_recent.events({
  'click .sort': function() {
    Session.set('sortOrderIs', 'most_recent');
    Session.set('sortOrder', {updatedAt: -1});
  }
});

Template.most_upvotes.events({
  'click .sort': function() {
    Session.set('sortOrderIs', 'most_upvotes');
    Session.set('sortOrder', {upvoteCount: -1, updatedAt: -1});
  }
});

Template.categories.events({
  'click .sort': function() {
    Session.set('sortOrderIs', 'categories');
    Session.set('sortOrder', {category: -1, upvoteCount: -1, updatedAt: -1});
  }
});
