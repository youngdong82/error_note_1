const url = window.location.href.split('/')
const errorId = url[url.length-1]

const get_detaill = () => {
  $.ajax({
    type: "GET",
    url: `/get_post/${errorId}`,
    data: {},
    success: function (response) {
      if (response["result"] == "success") {
        const detail = response["detail"]
        const error_detail_box = document.querySelector('.error_detail_box');
        console.log(detail)
        error_detail_box.innerHTML = `
        <div class="field">
            <label class="label">오류메세지</label>
            <div class="box">
              ${detail.message}
            </div>
        </div>

        <div class="field">
            <label class="label">사용언어</label>
            <div class="box">
            ${detail.language}
            </div>
        </div>

        <div class="field">
            <label class="label">오류 상황</label>
            <div class="box">
            ${detail.status}
            </div>
        </div>
        <div class="field">
            <label class="label">오류 해결 방법</label>
            <div class="box">
            ${detail.solution}
            </div>
        </div>
        <div class="field">
            <label class="label">관련 개념</label>
            <div class="box">
            ${detail.note}
            </div>
        </div>
        <div class="field">
            <label class="label">참고 링크</label>
            <div class="box">
              <a href='${detail.link}' >${detail.link}</a>
            </div>
        </div>
        `;
      }
    }
  })
}
window.onload = get_detaill