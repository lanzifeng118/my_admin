<script>
import api from './api.vue'

function myFileReader(file, callback) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function(e) {
    console.log(file)
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

function uploadBigFile(file, percent) {
  // this.toase.submitCancleShow = true
  // _this.toase.submitShow = true
  let formData = new FormData()
  formData.append('upload', file)
  // xhr
  let xhr = new XMLHttpRequest()
  // 上传中
  xhr.upload.addEventListener('progress', function(e) {
    percent = Math.floor(e.loaded / e.total * 100)
    console.log(percent)
  }, false)
  // 文件上传成功或是失败
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText)
        if (data.code === '200') {
          // 发add请求
          console.log(data.url)
          // _this.sendInfo(data.url)
        } else {
          // _this.showFailure()
        }
      }
    }
  }
  // 开始上传
  xhr.open('POST', '/api/admin/upload', true)
  xhr.send(formData)
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

export default {
  isNum,
  myFileReader,
  uploadFile,
  uploadBigFile,
  toast,
  req
}
</script>
