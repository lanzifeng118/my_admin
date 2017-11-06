<script>
let winWidth = 0
let winHeigth = 0
let contentDetailMinHeigth = 0
let navMinHeight = 0

if (window.innerWidth) {
  winWidth = window.innerWidth
} else if ((document.body) && (document.body.clientWidth)) {
  winWidth = document.body.clientWidth
}
// 获取窗口高度
if (window.innerHeight) {
  winHeigth = window.innerHeight
} else if ((document.body) && (document.body.clientHeight)) {
  winHeigth = document.body.clientHeight
}
// 通过深入Document内部对body进行检测，获取窗口大小
if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
  winHeigth = document.documentElement.clientHeight
  winWidth = document.documentElement.clientWidth
}

contentDetailMinHeigth = winHeigth - 145
navMinHeight = winHeigth - 80

function getCookie() {
  // let cookie = document.cookie
  // console.log(cookie)
  return true
}

export default {
  winWidth,
  winHeigth,
  contentDetailMinHeigth,
  navMinHeight,
  getCookie
}
</script>
