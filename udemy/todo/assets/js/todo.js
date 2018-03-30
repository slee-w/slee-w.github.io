// apply strikethrough to completed items

$("#list").on("click", "li", function() {
  $(this).toggleClass("completed");
});

// click to delete

$("ul").on("click", "li span", function(event) {
  // remove the li
  $(this).parent().fadeOut(500, function() {
    $(this).remove();
  });

  // do not allow other events to fire
  event.stopPropagation();
});

// add new li on pressing enter

$("input[type='text']").on("keypress", function(event) {
  if (event.which === 13) {

    // get the text of the new item
    var newItem = $(this).val();

    // append a new li with this text
    $("#list").append("<li><span class='delete'><i class='far fa-trash-alt'></i></span> " + newItem + "</li>");

    // clear out the input
    $(this).val("");

  };
});

// hide form when clicking plus

$("#expand").on("click", function() {
  $("input[type='text']").fadeToggle();
});
