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
        console.log(response)
        let posts = response["posts"]

        for (let i = 0; i < posts.length; i++) {
          let post = posts[i]
          let error_msg = post["message"]
          let error_lang= post["language"]
          let error_solu= post["solution"]

          console.log(error_msg, error_lang, error_solu)
          let error_temp = 
            `
            <section class="box">
              <div class="content">
                <div>
                  <h5> ${error_msg} <span>@username</span> <span>10분 전</span> </h5>
                </div>
                <div>${error_lang}</div>
                <p>
                    ${error_solu}
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