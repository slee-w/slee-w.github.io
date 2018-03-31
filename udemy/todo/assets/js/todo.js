// apply strikethrough to completed items

$("#list").on("click", "li", function() {
  $(this).toggleClass("completed");
});

// click to delete

$("ul").on("click", "li span", function(event) {
  // remove the li
  $(this).parent().fadeOut(500, function() {
    $(this).remove();

  // if no lis remaining, hide the ul
  if ($("li").length === 0) {
    $("#list").slideUp(500);
  };

});

  // do not allow other events to fire
  event.stopPropagation();
});

// add new li on pressing enter

$("input[type='text']").on("keypress", function(event) {
  if (event.which === 13) {

    // get the text of the new item
    var newItem = $(this).val();

    // if ul is hidden, slide down
    if ($("#list").css("display") === "none") {
      $("#list").slideDown(500);
    };

    // append a new li with this text
    $("#list").append("<li><span class='delete'><i class='far fa-trash-alt'></i></span> " + newItem + "</li>");

    // clear out the input
    $(this).val("");

  };
});

// hide form when clicking minus, expand when clicking plus

$("#expand").on("click", "svg", function() {
  $("input[type='text']").fadeToggle();
});

$(document).ready(function() {
  $("#expand").on("click", "svg", function() {
    $(this).toggleClass("fa-minus fa-plus");
  });
});
