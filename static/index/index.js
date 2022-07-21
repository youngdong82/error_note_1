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

function get_posts(filters) {
  // 필터 확인
  if(filters.includes('My Error')){
    $.ajax({
      type: "GET",
      url: `/get_posts?my=true`,
      data: {},
      success: function (response) {
        if (response["result"] == "success") {
          posts = response["posts"]
          user_state = response['user_state']
          re_paint_errors(posts,user_state)
        }
      }
    })
  } else {
    $.ajax({
      type: "GET",
      url: `/get_posts?my=false`,
      data: {},
      success: function (response) {
        if (response["result"] == "success") {
          posts = response["posts"]
          user_state = response['user_state']
          re_paint_errors(posts,user_state)
        }
      }
    })
  }
}

const go_write = () => {
  window.location.href= '/write'
}

const show_detail = (errorId) => {
  window.location.href = `/error_detail/${errorId}`;
}

// 디테일 화면 연결하기
const error_container = document.querySelector('.error_container');
error_container.addEventListener('click',(e) => {
  const box = e.target.closest('.box');
  if(!box){
    return
  }
  errorId = box.dataset.id
  show_detail(errorId)
})


// -------------------------------------------- tag_btn 관련
let now_filter = ['Python', 'Java', 'JavaScript', 'React'];
let now_posts = []
let now_user = ''

const re_paint_errors = (posts, user_state) => {
  $(".error_container").empty()

  now_posts = posts;
  now_user = user_state;

  // now_filter에 'All'이 있다면 다른 언어들로 없애주기
  if(now_filter.includes('All')){
    now_filter = [...now_filter, 'Python', 'Java', 'JavaScript', 'React'],
    now_filter.filter((each) => each != 'All');
  }
  // 받아온 포스트 시간 순으로 정렬하기
  now_posts.sort((a,b) => {
    return b['created_at'] - a['created_at']
  })

  for (let i = 0; i < now_posts.length; i++) {
    let post = now_posts[i]
    let error_lang= post["language"];
    
    if(now_filter.includes(error_lang)){
      let user_id = post["user_id"]
      let created_at = parseInt(post["created_at"])
      const diff_time = get_diff_time(created_at)
      let errorId = post["_id"]
      let error_msg = post["message"]
      let error_lang= post["language"]
      let error_solu= post["solution"]
      const section = document.createElement('section');
      section.className = 'box'
      section.dataset.id = errorId
      section.innerHTML = 
        `
          <div class="section_title">
            <span class="section_title_big paint_red"> ${error_msg} </span> <span class="section_title_small">@${user_id}</span> <span class="section_title_small">${diff_time}</span>
          </div>
          <div class="section_lang"><span>${error_lang}</span></div>
          <p class="section_solution paint_green">
              ${error_solu}
          </p>
        `
      $(".error_container").append(section)
    }
  }
  empty_container_checker()
}

const collect_tag_btn_filter = () =>{
  // selected 된 애들 다 모아서
  // get_posts로 넣기
  const selected_array = [];
  const univ_btns = Array.from(document.querySelector('.univ_btn').children) 
  const lang_btns = Array.from(document.querySelector('.lang_btn').children)
  for(let i=0; i<univ_btns.length; i++){
    if(univ_btns[i].classList.contains('selected')){
      selected_array.push(univ_btns[i].textContent)
    }
  }
  for(let i=0; i<lang_btns.length; i++){
    if(lang_btns[i].classList.contains('selected')){
      selected_array.push(lang_btns[i].textContent)
    }
  }
  // MyError는 서버에서 필터링해서 가져오고,
  // lang 필터링은 프론트엔드에서 실시

  // My error가 이전과 다른가?
  if(now_filter.includes('My Error') === selected_array.includes('My Error')){
    //   같다면
    //   lang filter 적용하는 re_paint 함수 실행
    now_filter =  selected_array
    re_paint_errors(now_posts, now_user)
  }else{
    //   다르다면
    //   	ajax 요청
    now_filter =  selected_array
    get_posts(selected_array)
  }
}

const tag_btn_logic = (e) => {
  const classes = Array.from(e.target.classList);
  
  if(!classes.includes('tag_btn')){
    return
  }
  e.target.classList.toggle('selected')
  // All btn은 다른 버튼이 selected가 되면 꺼져야 한다.
  if(classes.includes('is-all') || classes.includes('is-mine')){
    if(classes.includes('is-all')){
      const lang_btns = Array.from(document.querySelector('.lang_btn').children);
      if(!classes.includes('selected')){
        // All btn의 selected가 꺼져있을 때
        // All btn이 selected가 되면 다른 버튼은 꺼져야 한다.
        lang_btns.forEach((lang_btn) => {
          lang_btn.classList.remove('selected')
        })
      } else {
        // All btn의 selected가 켜져있을 때
        // lang_btn에 selected가 없다면 무시
        let false_count = 0
        for(let i=0; i<lang_btns.length; i++){
          if(lang_btns[i].classList.contains('selected')){
            break
          } else{
            false_count ++
          }
        }
        if (false_count === 4){
          e.target.classList.toggle('selected')
        }
      }
    }
  } else{
    // 버튼 돌면서 전부 selected 없애.
    const all_btn = document.querySelector('.is-all');
    all_btn.classList.remove('selected')
  }
  collect_tag_btn_filter()
}

const tag_btn_container = document.querySelector('.tag_btn_container');
tag_btn_container.addEventListener('click',tag_btn_logic)


window.onload = get_posts(now_filter);


// --------------- 이전 링크 받아오기
const welcome_alert = () => {
  const right_before = document.referrer;
  let url_route;
  let splitted_url_route;
  
  url_route = right_before.split(window.location.href)[1];
  if (url_route !== undefined){
    splitted_url_route = url_route.split('/')[0]
    if(splitted_url_route === 'login'){
      show_alert('success','.🎉 로그인에 성공하셨습니다 🥳 환영합니다 🎉');
    }
  }else{
    show_alert('success','🙂 환영합니다 🙂');
  }
}
window.onload = welcome_alert();

const empty_container_checker = () => {
  const error_note_container = document.querySelector('.error_container');
  if(error_note_container.children.length === 0){
    error_note_container.innerHTML = 
    `
  <section class="box empty_box">
    <div>
      에러가 없습니다
    </div>
  </section>
    `
  }

} 