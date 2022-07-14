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
          let errorId = post["_id"]
          let error_msg = post["message"]
          let error_lang= post["language"]
          let error_solu= post["solution"]
          const section = document.createElement('section');
          section.className = 'box'
          section.dataset.id = errorId
          section.innerHTML = 
            `
              <div class="content">
                <div class="content_title">
                  <span class="paint_red"> ${error_msg} </span> <span>@username</span> <span>10분 전</span>
                </div>
                <div class="content_lang"><span>${error_lang}</span></div>
                <p class="content_solution paint_green">
                    ${error_solu}
                </p>
              </div>
            `
            $(".error_note_container").append(section)
        }
      }
    }
  })
}

window.onload = get_posts()

const go_write = () => {
  window.location.href= '/write'
}

const show_detail = (errorId) => {
  window.location.href = `/error_detail/${errorId}`;
}

const error_note_container = document.querySelector('.error_note_container');
error_note_container.addEventListener('click',(e) => {
  const box = e.target.closest('.box');
  if(!box){
    return
  }
  errorId = box.dataset.id
  show_detail(errorId)
})
