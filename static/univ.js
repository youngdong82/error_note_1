const logo_img = document.querySelector('.logo_img');
logo_img.addEventListener('click', () => {
  window.location.href = '/'
})

const alert_box = document.querySelector('.alert_box');
const show_alert = (alert_type, alert_message,target) => {
  if(alert_type === 'success'){
    alert_box.classList.add('alert_good')
  } else if(alert_type === 'warning'){
    alert_box.classList.add('alert_warning')
  } else if(alert_type === 'danger'){
    alert_box.classList.add('alert_danger')
  }
  alert_box.innerHTML = 
  `
    <div>${alert_message}</div>
  `
  alert_box.classList.add('alert_live')
  if(target!== undefined){
    console.log(target)
    target.scrollIntoView({behavior: "smooth", block:"center"})
    target.focus({preventScroll: true})
  }

  setTimeout(() => {
    alert_box.className = 'alert_box'
  },2000)
}