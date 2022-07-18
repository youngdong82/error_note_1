function errors_post() {
  let message = $("#message").val();
  let language = $("#language").val();
  let state = $("#state").val();
  let solution = $("#solution").val();
  let note = $("#note").val();
  let link = $("#link").val();

  $.ajax({
    type: "POST",
    url: "/error_post",
    data: {
      createdAt: Date.now(),
      message_give: message,
      language_give: language,
      state_give: state,
      solution_give: solution,
      note_give: note,
      link_give: link,
    },
    success: function (response) {
      alert(response["msg"]);
      window.location.href = "/";
    },
  });
}

function close_box() {
  $("#errornote").hide();
}