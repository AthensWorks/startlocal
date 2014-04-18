//// helper functions

displayName = function (userId) {
  userList = Meteor.users.find(userId).fetch();
  if (userList.length==0) {
    return "Error!!";
  };
  MUser = userList[0];
  if (MUser.profile && MUser.profile.name){
    return MUser.profile.name;
  };
  if (MUser.emails && MUser.emails[0].address) {
    return MUser.emails[0].address.split("@")[0];
  };
};

contactEmail = function (user) {
  if (user.emails && user.emails.length){
    return user.emails[0].address;
  }
  if (user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email;
  }

  return null;
};

coordsRelativeToElement = function(element, event) {
  var offset = $(element).offset();
  var x = event.pageX - offset.left;
  var y = event.pageY - offset.top;
  return {
    x: x,
    y: y
  };
};

openCreateDialog = function(x, y) {
  Session.set("createCoords", {
    x: x,
    y: y
  });
  Session.set("createError", null);
  Session.set("showCreateDialog", true);
};

sortOrderIs = function(order) {
  return Session.get('sortOrderIs') === order;
};
