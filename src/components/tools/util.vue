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
  myFileReader,
  uploadFile,
  toast,
  req
}
</script>
