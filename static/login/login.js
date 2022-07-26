async function sign_in() {
    const login_id = document.querySelector('#login_id');
    const login_pw = document.querySelector('#login_pw');
    const error_message = document.querySelector('.error_message');
            
    if (login_id.value == "") {
        error_message.innerHTML = "아이디를 입력해주세요."
        login_id.focus()
        return;
    } else {
        error_message.innerHTML = "";
    }

    if (login_pw.value == "") {
        error_message.innerHTML = "비밀번호를 입력해주세요";
        login_pw.focus()
        return;
    } else {
        error_message.innerHTML = "";
    }
    const payload = {
        loginId_give: login_id.value,
        loginPw_give: login_pw.value
    };
    const res = await fetch("/sign_in",{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    if(res.ok){
        const data = await res.json();

        if (data['result'] == 'success') {
            console.log('successs!')
            document.cookie = `mytoken=${data['token']}`
            window.location.replace("/")
        } else {
            show_alert('danger',`🙅‍♂️ ${data['msg']} 🙅‍♀️`, document.querySelector('#login_pw'))
        }
        return
    }
    throw new Error('Error in post with fetch');
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