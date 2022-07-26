async function errors_post() {
  let selected_lang
  const lang_select = document.querySelector('#lang_select');
  for (let i=0; i<lang_select.length; i++){
    const each_lang_select = lang_select[i];

    if(each_lang_select.selected === true){
      selected_lang = each_lang_select.value
      if(selected_lang === ''){
        show_alert('warning', '🚧 언어를 선택해주세요 🚧',lang_select)
        return
      }
      break
    }
  }
  const message = document.querySelector('#message');
  const situation = document.querySelector('#situation');
  const solution = document.querySelector('#solution');
  const note = document.querySelector('#note');
  const link = document.querySelector('#link');


  if(message.value === ''){
    show_alert('warning','🚧 오류 메세지를 작성해주세요 🚧',message)
    return
  }
  if(situation.value === ''){
    show_alert('warning','🚧 오류 상황을 작성해주세요 🚧',situation)
    return
  }
  if(solution.value === ''){
    show_alert('warning','🚧 오류 해결 방법을 작성해주세요 🚧',solution)
    return
  }
  const payload = {
    createdAt: Date.now(),
    message_give: message.value,
    language_give: selected_lang,
    situation_give: situation.value,
    solution_give: solution.value,
    note_give: note.value,
    link_give: link.value
  }
  const res  = await fetch("/error_post", {
    method: "POST",
    headers: {"Content-Type": 'application/json'},
    body: JSON.stringify(payload)
  })
  if(res.ok){
    window.location.href = "/";
    return
  }
  throw new Error('Error in post with fetch');
}