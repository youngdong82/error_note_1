function errors_post() {
  let selected_lang
  const lang_select = document.querySelector('#lang_select');
  for (let i=0; i<lang_select.length; i++){
    const each_lang_select = lang_select[i]

    if(each_lang_select.selected === true){
      selected_lang = each_lang_select.value
      if(selected_lang === ''){
        alert('언어를 선택해주세요.')
        return
      }
      break
    }
  }
  let message = $("#message").val();
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
      language_give: selected_lang,
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