function sign_in() {
    let loginId = $("#login_id").val()
    let loginPw = $("#login_pw").val()
            
    if (loginId == "") {
        $("#login_msg").text("아이디를 입력해주세요.")
        $("#login_id").focus()
        return;
    } else {
        $("#login_msg").text("")
    }

    if (loginPw == "") {
        $("#login_msg").text("비밀번호를 입력해주세요.")
        $("#login_pw").focus()
        return;
    } else {
        $("#login_msg").text("")
    }
    $.ajax({
        type: "POST",
        url: "/sign_in",
        data: {
            loginId_give: loginId,
            loginPw_give: loginPw
        },
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token'], {path: '/'});
                window.location.replace("/")
            } else {
                alert(response['msg'])
            }
        }
    });
}