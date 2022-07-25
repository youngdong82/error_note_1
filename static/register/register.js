function is_nickname(asValue) {
  var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
  return regExp.test(asValue);
}
function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}

async function sign_up() {
  const input_id = document.querySelector('#input_id');
  const input_pw = document.querySelector('#input_pw');
  const input_pw2 = document.querySelector('#input_pw2');

  // 아이디 확인
  const help_id = document.querySelector('#help_id');
  const error_message = document.querySelector('.error_message');
  const detail_pw = document.querySelector('.detail_pw_help');


  if (Array.from(help_id.classList).includes("paint_red")) {
      show_alert("warning","🚧 아이디를 다시 확인해주세요 🚧",document.querySelector(".dupli_btn"))
      return;
  } else if (!Array.from(help_id.classList).includes("paint_green")) {
      show_alert("warning","🚧 아이디 중복확인을 해주세요 🚧",document.querySelector(".dupli_btn"))
      return;
  }

  if (input_pw.value == "" | input_pw.value == undefined) {
      error_message.classList.remove("paint_green");
      error_message.classList.add("paint_red");
      error_message.innerHTML = "비밀번호를 입력해주세요";
      detail_pw.classList.add('paint_green');
      input_pw.focus()
      return;
  } else if (!is_password(input_pw.value)) {
    console.log('here?')
      error_message.classList.remove("paint_green");
      error_message.classList.add("paint_red");
      error_message.innerHTML = "비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자";
      input_pw.focus()
      return
  } else {
    detail_pw.innerHTML = "사용할 수 있는 비밀번호입니다."
  }

  if (input_pw2.value == "") {
      error_message.classList.remove("paint_green");
      error_message.classList.add("paint_red");
      error_message.innerHTML = "비밀번호를 입력해주세요";
      input_pw2.focus()
      return;
  } else if (input_pw2.value != input_pw.value) {
      error_message.classList.remove("paint_green");
      error_message.classList.add("paint_red");
      error_message.innerHTML = "비밀번호가 일치하지 않습니다";
      input_pw2.focus()
      return;
  } else {
    error_message.classList.remove("paint_red");
    error_message.classList.add("paint_green");
    error_message.innerHTML = "";
  }
  const payload = {
    userId_give: input_id.value,
    pw_give: input_pw.value
  }
  console.log(payload)

  const res = await fetch("/sign_up/save",{
    method: "POST",
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  console.log(res)
  if(res.ok){
    window.location.href = "/login"
    return
  }
  throw new Error('Error in post with fetch');
}

async function check_dup () {
  const input_id = document.querySelector('#input_id');
  const help_id = document.querySelector('#help_id');

  if (input_id.value == "") {
    help_id.classList.add("paint_red");
    help_id.classList.remove("paint_green");
    help_id.innerHTML = '아이디를 입력해주세요';
    input_id.focus()
    return;
  }
  if (!is_nickname(input_id.value)) {
    help_id.classList.add("paint_red")
    help_id.classList.remove("paint_green");
    help_id.innerHTML = '아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이';
    input_id.focus()
    return;
  }
    // 로딩중? 굳이?
  help_id.classList.add("is-loading");
  help_id.innerHTML = '확인 중 입니다';

  const payload = {
    userId_give: input_id.value
  };
  const res = await fetch(`/sign_up/check_dup`,{
    method: 'POST',
    headers:{'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  })
  if(res.ok){
    const json = await res.json();
    if (json["exists"]) {
      help_id.classList.add("paint_red");
      help_id.classList.remove("paint_green");
      help_id.innerHTML = '이미 존재하는 아이디입니다';
      input_id.focus()
    } else {
        help_id.classList.add("paint_green");
        help_id.classList.remove("paint_red");
        help_id.innerHTML = '사용할 수 있는 아이디입니다';
    }
    help_id.classList.remove("is-loading");
    return 
  }
  throw new Error('Error in post with fetch')
}

function replace_url(){
  const sneek_to_login = `${window.location.href.split('register')[0]}/login`;
  window.location.replace(sneek_to_login)
}