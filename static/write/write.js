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
  let situation = $("#situation").val();
  let solution = $("#solution").val();
  let note = $("#note").val();
  let link = $("#link").val();

  if(message === ''){
    alert('오류 메세지를 작성해주세요.')
    $("#message").focus()
    return
  }
  if(situation === ''){
    alert('오류 상황을 작성해주세요.')
    $("#situation").focus()
    return
  }
  if(solution === ''){
    alert('오류 해결 방법을 작성해주세요.')
    $("#solution").focus()
    return
  }

  $.ajax({
    type: "POST",
    url: "/error_post",
    data: {
      createdAt: Date.now(),
      message_give: message,
      language_give: selected_lang,
      situation_give: situation,
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