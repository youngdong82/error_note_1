function errors_post() {
  let selected_lang
  const lang_select = document.querySelector('#lang_select');
  for (let i=0; i<lang_select.length; i++){
    const each_lang_select = lang_select[i];

    if(each_lang_select.selected === true){
      selected_lang = each_lang_select.value
      if(selected_lang === ''){
        show_alert('warning', '언어를 선택해주세요.',lang_select)
        return
      }
      break
    }
  }
  const message_ele = document.querySelector('#message');
  const situation_ele = document.querySelector('#situation');
  const solution_ele = document.querySelector('#solution');

  let message = message_ele.value;
  let situation = situation_ele.value;
  let solution = solution_ele.value;
  let note = $("#note").val();
  let link = $("#link").val();

  if(message === ''){
    show_alert('warning','🚧 오류 메세지를 작성해주세요 🚧',message_ele)
    return
  }
  if(situation === ''){
    show_alert('warning','🚧 오류 상황을 작성해주세요 🚧',situation_ele)
    return
  }
  if(solution === ''){
    show_alert('warning','🚧 오류 해결 방법을 작성해주세요 🚧',solution_ele)
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
      window.location.href = "/";
    },
  });
}