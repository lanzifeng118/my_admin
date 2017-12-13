<script>
import api from './api.vue'

function myFileReader(file, callback) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function(e) {
    callback(e.target.result)
  }
}

function uploadFile(_this, file, success, error) {
  let formData = new FormData()
  formData.append('upload', file)
  _this.axios(api.uploadFile(formData))
    .then((res) => {
      let data = res.data
      if (data.code === '200') {
        success(data.url)
      } else {
        error()
      }
    }).catch((err) => {
      console.log(err)
      error()
    })
}

function uploadBigFile(file, percent, success, error) {
  percent.show = 'true'
  percent.progress = 0
  let formData = new FormData()
  formData.append('upload', file)
  // xhr
  let xhr = new XMLHttpRequest()

  // 上传中
  xhr.upload.addEventListener('progress', function(e) {
    percent.progress = Math.floor(e.loaded / e.total * 100)
  }, false)
  // 文件上传成功或是失败
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText)
        if (data.code === '200') {
          let lastIndexOf = file.name.lastIndexOf('.')
          // size
          let size = file.size / 1024
          if (size < 1024) {
            size = Math.ceil(size) + 'Kb'
          } else {
            size = Math.ceil((size / 102.4)) / 10 + 'Mb'
          }
          let obj = {
            name: file.name.slice(0, lastIndexOf),
            type: file.name.slice(lastIndexOf + 1),
            size: size,
            url: data.url
          }
          success(obj)
          percent.show = 'false'
        } else {
          error()
        }
      }
    }
  }
  // 开始上传
  xhr.open('POST', '/api/admin/upload', true)
  xhr.send(formData)
  return xhr
}

function isNum(str) {
  return /^\d+$/.test(str)
}

let toast = {
  show(obj, text, icon) {
    if (!icon) {
      icon = 'warn'
    }
    obj.text = text
    obj.icon = icon
    obj.show = true
  },
  hide(obj) {
    setTimeout(() => {
      obj.show = false
    }, 800)
  },
  fade(obj, text, icon) {
    this.show(obj, text, icon)
    this.hide(obj)
  }
}

let req = {
  queryError(obj) {
    toast.fade(obj, '获取信息失败，请稍后再试')
  },
  changeError(obj) {
    toast.fade(obj, '出错了，请稍后再试!', 'sad')
  }
}

function getCookie() {
  let cookie = document.cookie.replace(/ /g, '')
  console.log(cookie)
  let arr = cookie.split(';')
  let obj = {}
  arr.forEach((v, i) => {
    let arrV = v.split('=')
    obj[arrV[0]] = arrV[1]
  })
  return obj
}
export default {
  isNum,
  myFileReader,
  uploadFile,
  uploadBigFile,
  toast,
  req,
  getCookie
}
</script>
