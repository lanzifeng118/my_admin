<template>
<div class="edit product-classify-edit">
  <h2 class="edit-h2" v-if="!typeAdd">编辑分类</h2>
  <h2 class="edit-h2" v-if="typeAdd">添加分类</h2>
  <router-link to="/admin/product/classify" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90"><span class="icon-nessisary"></span>分类名称</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <tr>
          <td>顺序</td>
          <td><input type="text" v-model.trim="item.order"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">分类图片<span class="separate"></span></td>
          <td>
            <div class="edit-img f-clearfix">
              <div class="edit-img-box pic">
                <img class="" :src="item.logo" alt="">
              </div>
              <p class="edit-img-note">（宽度250px以内，高度50px，20kb以内）</p>
            </div>
            <div class="edit-upload">
              <label for="inputLogo" class="button button-second">选择图片</label>
              <input type="file" id="inputLogo" accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="chooseLogo">
              <button type="button" class="button button-second edit-delete" @click="deleteLogo">删除图片</button>
            </div>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">提交</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <toast
    v-show="toastA.show"
    :text="toastA.text"
    :icon="toastA.icon"
  >
  </toast>
  <toast
    v-show="toase.submitShow"
    text="正在提交..."
    icon="upload"
  >
  </toast>
</div>
</template>

<script>
import toast from 'components/toast/toast'
export default {
  data() {
    return {
      typeAdd: true,
      item: {
        name: '',
        order: '',
        logo: ''
      },
      // file
      file: null,
      // toastA
      toastA: {
        show: false,
        text: '',
        icon: ''
      },
      // submit
      toase: {
        submitShow: false
      }
    }
  },
  created() {
    this.getItem()
  },
  methods: {
    getItem() {
      if (this.$route.path === '/admin/product/classifyadd') {
        return
      }
      this.typeAdd = false
      this.item = {id: '1', name: 'Phoenix', logo: '/static/images/PhoenixControls-logo.png', order: '1'}
    },
    chooseLogo(e) {
      let _this = this
      if (e.target.files[0].size > 2048000) {
        _this.file = null
        _this.showToast('图片太大了', 'warn', 600)
        return
      }
      _this.file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(_this.file)
      reader.onload = function(e) {
        _this.item.logo = e.target.result
      }
    },
    deleteLogo() {
      if (this.item.logo !== '') {
        this.item.logo = ''
      }
    },
    submit() {
      let _this = this
      // 如果上传了图片
      if (!this.verify()) {
        return
      }
      _this.toase.submitShow = true
      if (_this.file) {
        let formData = new FormData()
        formData.append('upload', this.file)
        _this.axios({
          method: 'post',
          url: '/api/admin/upload',
          headers: {'content-type': 'multipart/form-data'},
          data: formData
        }).then((response) => {
          let data = response.data
          if (data.code === '200') {
            _this.item.logo = data.url
            _this.sendData()
          } else {
            _this.showError()
          }
        }).catch(() => {
          _this.showError()
        })
      } else {
        _this.sendData()
      }
    },
    verify() {
      if (!this.item.name) {
        this.showToast('分类名称不能为空')
        return false
      }
      if (this.item.order && !/^\d+$/.test(this.item.order)) {
        this.showToast('顺序必须为数字')
        return false
      }
      return true
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = {
          method: 'post',
          url: '/api/admin/basicinfo'
        }
      } else {
        obj = {
          method: 'post',
          url: '/api/admin/basicinfo',
          data: {
            method: 'modify',
            language: 'cn',
            data: _this.item
          }
        }
      }
      _this.axios(obj).then((response) => {
        let data = response.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          _this.showError()
        }
      }).catch(() => {
        _this.showError()
      })
    },
    showError() {
      this.toase.submitShow = false
      this.showToast('出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      this.toase.submitShow = false
      this.showToast('提交成功！', 'appreciate', 600, () => {
        this.$router.push('/admin/product/classifylist')
      })
    },
    showToast(text, icon, time, callback) {
      let _this = this
      time = time || 600
      _this.toastA.show = true
      _this.toastA.text = text || ''
      _this.toastA.icon = icon || 'warn'
      setTimeout(() => {
        _this.toastA.show = false
        if (typeof (callback) === 'function') {
          callback()
        }
      }, time)
    }
  },
  components: {
    toast
  }
}
</script>

<style>

</style>
