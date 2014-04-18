# helper functions

displayName = (user) ->
  if( user === undefined ) {
    return null;
  }

  if( user.profile && user.profile.name ) {
    return user.profile.name;
  } else {
    return user.emails[0].address.split("@")[0];
  }

contactEmail = (user) ->
  if (user.emails && user.emails.length){
    return user.emails[0].address;
  }
  if (user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email;
  }

  return null;

coordsRelativeToElement = (element, event) ->
  offset = $(element).offset();
  x = event.pageX - offset.left;
  y = event.pageY - offset.top;
  return {
    x: x,
    y: y
  };

openCreateDialog = (x, y) ->
  Session.set("createCoords", {
    x: x,
    y: y
  });
  Session.set("createError", null);
  Session.set("showCreateDialog", true);

sortOrderIs = (order) ->
  return Session.get('sortOrderIs') === order;
