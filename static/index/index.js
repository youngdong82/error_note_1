const get_diff_time = (createdAt) => {
  const diff = Date.now() - createdAt
  const standard_diff = parseInt(diff / 1000)

  let final_diff = 0
  if (standard_diff < 60){
    final_diff = `${standard_diff} 초 전`
  } else if(standard_diff < 60* 60){
    final_diff = `${parseInt(standard_diff/60)}분 전`
  } else if(standard_diff < 60* 60 * 24){
    final_diff = `${parseInt(standard_diff/(60*60))}시간 전`
  } else if(standard_diff < 60* 60 * 24 * 30){
    final_diff = `${parseInt(standard_diff/(60*60*24))}일 전`
  } else if(standard_diff < 60* 60 * 24 * 30 * 12){
    final_diff = `${parseInt(standard_diff/(60*60*24*30))}개월 전`
  } else{
    final_diff = `${parseInt(standard_diff/(60*60*24*30*12))}년 전`
  }
  return final_diff
}

function get_posts() {
  $(".error_note_container").empty()
  $.ajax({
    type: "GET",
    url: `/get_posts`,
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
        let posts = response["posts"]
        user_state = response['user_state']
        posts.sort((a,b) => {
          return b['created_at'] - a['created_at']
        })

        for (let i = 0; i < posts.length; i++) {
          let post = posts[i]
          let user_id = post["user_id"]
          let created_at = parseInt(post["created_at"])
          const diff_time = get_diff_time(created_at)

          if(!my_error_btn.classList.contains('is-light') && user_id !== user_state){
            continue
          }
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
                  <span class="paint_red"> ${error_msg} </span> <span>@${user_id}</span> <span>${diff_time}</span>
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

// 디테일 화면 연결하기
const error_note_container = document.querySelector('.error_note_container');
error_note_container.addEventListener('click',(e) => {
  const box = e.target.closest('.box');
  if(!box){
    return
  }
  errorId = box.dataset.id
  show_detail(errorId)
})


const my_error_btn = document.querySelector('.btn_container > .button ');
my_error_btn.addEventListener('click',(e) => {
  const btn = e.target;
  btn.classList.toggle('is-light')
  get_posts()
})