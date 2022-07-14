function get_posts(username) {
  if (username == undefined) {
    username = ""
  }
  $(".error_note_container").empty()
  $.ajax({
    type: "GET",
    url: `/get_posts`,
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
        let posts = response["posts"]

        for (let i = 0; i < posts.length; i++) {
          let post = posts[i]
          console.log(post)
          let error_msg = post["message"]
          let error_lang= post["language"]
          let error_solu= post["solution"]
          let error_state= post["state"]
          let error_note= post["note"]
          let error_link= post["link"]

          let error_temp = 
            `
            <section class="box">
              <div class="content">
                <div>
                  <h5> ${error_msg} <span>@username</span> <span>10분 전</span> </h5>
                </div>
                <div>${error_lang}</div>
                <p>
                    ${error_state}
                </p>
                <p>
                    ${error_solu}
                </p>
                <p>
                    ${error_note}
                </p>
                <p>
                    ${error_link}
                </p>
              </div>
            </section>
            `
            $(".error_note_container").append(error_temp)
        }
      }
    }
  })
}

window.onload = get_posts()

const go_write = () => {
  window.location.href= '/write'
}