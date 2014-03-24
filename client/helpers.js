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

sortOrderIs = function(order) {
  return Session.get('sortOrderIs') === order;
};
