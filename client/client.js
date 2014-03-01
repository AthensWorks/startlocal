//// helper functions

var coordsRelativeToElement = function(element, event) {
  var offset = $(element).offset();
  var x = event.pageX - offset.left;
  var y = event.pageY - offset.top;
  return {
    x: x,
    y: y
  };
};

var openCreateDialog = function(x, y) {
  Session.set("createCoords", {
    x: x,
    y: y
  });
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

/// Subscribe

Meteor.subscribe("posts");

/// Template functions

Template.postlist.posts = function() {
  return Posts.find({}, { sort: Session.get('sortOrder') });
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
	if( this.categories.length > 0 ) {
		return Categories.find({ _id: { $in: this.categories } }, {sort: {name: 1}});		
	} else {
		return;
	}
};

/// Template events

Template.addButton.events({
  'click .add': function(event, template) {
    var coords = coordsRelativeToElement(event.currentTarget, event);
    openCreateDialog(coords.x / 500, coords.y / 500);
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
			
			Meteor.call('addToPost', categoryId, postId);
			
			return postId;
	 });

			Session.set("selected", postId);
			Session.set("showCreateDialog", false);
		} else {
			Session.set("createError", "It needs a name, a description and a URL—or why bother?");
		}
  },

  'click .cancel': function() {
    Session.set("showCreateDialog", false);
  }
});

Template.postlist.events({
  'click input.inc': function() {
    Posts.update(Session.get("selected_post"), {
      $inc: {
        score: 5
      }
    });
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
    Session.set('sortOrder', {updatedAt: -1});
  }
});

Template.most_upvotes.events({
  'click .sort': function() {
    Session.set('sortOrder', {upvoteCount: -1, updatedAt: -1});
  }
});

Template.categories.events({
  'click .sort': function() {
    Session.set('sortOrder', {category: -1, upvoteCount: -1, updatedAt: -1});
  }
});