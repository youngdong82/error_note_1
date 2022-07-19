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
                show_alert('danger',`🙅‍♂️ ${response['msg']} 🙅‍♀️`, document.querySelector('#login_pw'))
            }
        }
    });
}

const success_alert = () => {
    const right_before = document.referrer;
    let url_route;
    let splitted_url_route;
    url_route = right_before.split(window.location.href.split('login')[0])[1];
    if (url_route !== undefined){
        splitted_url_route = url_route.split('/')[0]
        console.log(splitted_url_route)
        if(splitted_url_route === 'register'){
        show_alert('success','.🎉 회원 가입 완료 🎉');
        }
    }
}
window.onload = success_alert();