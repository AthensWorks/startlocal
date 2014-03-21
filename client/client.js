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

Template.comments.events({
  'click .comment_count': function() {
    $("#" +  this._id + " .comment_list").toggle('fast');
    return true;
  },

  'click #submit': function() {
    commentText = $("#" +  this._id + " .comment_text").val()
    console.log(this._id);
    console.log(commentText);

    Meteor.call("comment", this._id, Meteor.user()._id, commentText);
  }
});


Template.comment.author_name = function() {
  author = Meteor.users.findOne(this.authorId);

  return author.profile.name;
}


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

Template.most_recent.sortOrderIs  = sortOrderIs;
Template.most_upvotes.sortOrderIs = sortOrderIs;
Template.categories.sortOrderIs   = sortOrderIs;