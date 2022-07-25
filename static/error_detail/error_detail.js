

const get_detaill = async() => {
  const url = window.location.href.split('/');
  const errorId = url[url.length-1];

  const res = await fetch(`/get_post/${errorId}`,{
    method: "GET",
  })
  if(res.ok){
    const data = await res.json();
    if (data["result"] == "success") {
      const detail = data["detail"]
      const error_container = document.querySelector('.error_container');
      error_container.innerHTML = `
      <section class="box">
        <label class="label">오류메세지</label>
            <span>${detail.message}</span>
        <label class="label">사용언어</label>
            <span>${detail.language}</span>
        <label class="label">오류 상황</label>
            <span>${detail.status}</span>
        <label class="label">오류 해결 방법</label>
            <span>${detail.solution}</span>
        <label class="label">관련 개념</label>
            <span>${detail.note === '' ? "-----" : detail.note}</span>
        <label class="label">참고 링크</label>
            <a href='${detail.link}' >${detail.link}</a>
      </section>
      `;
    }
    return
  }
  throw new Error('Error in post with fetch');
}
window.onload = get_detaill

const page_btn = document.querySelector('.page_btn');
page_btn.addEventListener('click', () => {
  window.location.href = '/'
})