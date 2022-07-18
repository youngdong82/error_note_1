function is_nickname(asValue) {
  var regExp = /^(?=.*[a-zA-Z])[-a-zA-Z0-9_.]{2,10}$/;
  return regExp.test(asValue);
}
function is_password(asValue) {
  var regExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{8,20}$/;
  return regExp.test(asValue);
}


function sign_up() {
  let userId = $("#input-id").val()
  let pw = $("#input_pw").val()
  let pw2 = $("#input_pw2").val()

  // 아이디 확인
  if ($("#help_id").hasClass("is-danger")) {
      alert("아이디를 다시 확인해주세요.")
      return;
  } else if (!$("#help_id").hasClass("is-success")) {
      alert("아이디 중복확인을 해주세요.")
      return;
  }
  const detail_pw = document.querySelector('.detail_pw_help')
  if (pw == "" | pw == undefined) {
      $("#help_msg").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
      detail_pw.classList.add('paint_green')
      $("#input_pw").focus()
      return;
  } else if (!is_password(pw)) {
      $("#help_msg").text("비밀번호의 형식을 확인해주세요. 영문과 숫자 필수 포함, 특수문자(!@#$%^&*) 사용가능 8-20자").removeClass("is-safe").addClass("is-danger")
      $("#input_pw").focus()
      return
  } else {
    detail_pw.innerHTML = "사용할 수 있는 비밀번호입니다."
  }

  if (pw2 == "") {
      $("#help_msg").text("비밀번호를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
      $("#input_pw2").focus()
      return;
  } else if (pw2 != pw) {
      $("#help_msg").text("비밀번호가 일치하지 않습니다.").removeClass("is-safe").addClass("is-danger")
      $("#input_pw2").focus()
      return;
  } else {
      $("#help_msg").text("").removeClass("is-danger").addClass("is-success")
  }
  $.ajax({
      type: "POST",
      url: "/sign_up/save",
      data: {
          userId_give: userId,
          pw_give: pw
      },
      success: function (response) {
          alert("회원가입을 축하드립니다!")
          window.location.replace("/login")
      }
  });
}



function check_dup() {
  let userId = $("#input-id").val()
  if (userId == "") {
    $("#help_id").text("아이디를 입력해주세요.").removeClass("is-safe").addClass("is-danger")
    $("#input-id").focus()
    return;
  }
  const help_id = document.querySelector('#help_id')
  if (!is_nickname(userId)) {
    $("#help_id").text("아이디의 형식을 확인해주세요. 영문과 숫자, 일부 특수문자(._-) 사용 가능. 2-10자 길이").removeClass("is-safe").addClass("is-danger")
    help_id.className.add("paint_red")
    $("#input-id").focus()
    return;
  }
    // 로딩중? 굳이?
  $("#help_id").text("확인 중 입니다").addClass("is-loading")
  $.ajax({
    type: "POST",
    url: "/sign_up/check_dup",
    data: {
        userId_give: userId
    },
    success: function (response) {
        if (response["exists"]) {
            $("#help_id").text("이미 존재하는 아이디입니다.").removeClass("is-safe").addClass("is-danger")
            $("#input-username").focus()
        } else {
            $("#help_id").text("사용할 수 있는 아이디입니다.").removeClass("is-danger").addClass("is-success")
        }
        $("#help_id").removeClass("is-loading")
    }
  });
}