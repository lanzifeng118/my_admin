<template>
<div class="basic-info-edit">
  <h2 class="edit-h2">编辑基础信息</h2>
  <router-link to="/admin/home" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90">公司名称</td>
          <td><input type="text" v-model="basicInfo.name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">LOGO<span class="separate"></span></td>
          <td>
            <div class="basic-info-edit-img">
              <img class="" :src="basicInfo.logo" alt="">
              <span>（400px × 120px，100kb以内）</span>
            </div>
            <div class="basic-info-edit-upload">
              <label for="inputLogo" class="button">选择图片</label>
              <input type="file" id="inputLogo" accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="chooseLogo">
              <button type="button" class="button basic-info-edit-delete" @click="deleteLogo">删除图片</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>地址</td>
          <td><input type="text" v-model="basicInfo.address"></td>
        </tr>
        <tr>
          <td>邮箱</td>
          <td><input type="text" v-model="basicInfo.email"></td>
        </tr>
        <tr>
          <td>电话</td>
          <td><input type="text" v-model="basicInfo.telephone"></td>
        </tr>
        <tr>
          <td>简介</td>
          <td>
            <quill-editor
              v-model="basicInfo.brief"
              :options="editorOption"
              >
            </quill-editor>
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
    v-show="toastLogoErrorShow"
    text="图片太大啦！"
  >
  </toast>
  <toast
    v-show="toase.submitShow"
    :text="toase.submitText"
    :icon="toase.submitIcon"
  >
  </toast>
</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import toast from 'components/toast/toast'
export default {
  data() {
    return {
      basicInfo: {
        name: '',
        address: '',
        email: '',
        telephone: '',
        logo: '',
        brief: ''
      },
      // quill
      editorOption: {
        placeholder: '输入内容...',
        modules: {
          toolbar: [
            ['bold', 'italic'], // toggled buttons
            [{'color': []}, {'background': []}], // dropdown with defaults from theme
            ['clean'] // remove formatting button
          ]
        }
      },
      // file
      file: null,
      toastLogoErrorShow: false,
      // submit
      toase: {
        submitShow: false,
        submitText: '正在提交...',
        submitIcon: 'upload'
      }
    }
  },
  created() {
    let _this = this
    _this.axios({
      method: 'post',
      url: '/api/admin/basicinfo',
      headers: {'content-type': 'application/json'},
      data: {
        method: 'get',
        language: 'cn'
      }
    }).then((response) => {
      let data = response.data.data
      _this.basicInfo = data
    })
  },
  methods: {
    chooseLogo(e) {
      let _this = this
      if (e.target.files[0].size > 102400) {
        _this.toastLogoErrorShow = true
        _this.file = null
        setTimeout(() => {
          _this.toastLogoErrorShow = false
        }, 500)
        return
      }
      _this.file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(_this.file)
      reader.onload = function(e) {
        _this.basicInfo.logo = e.target.result
      }
    },
    deleteLogo() {
      if (this.basicInfo.logo !== '') {
        this.basicInfo.logo = ''
      }
    },
    submit() {
      let _this = this
      // 如果上传了图片
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
            _this.basicInfo.logo = data.url
            // basicinfo
            _this.sendBasicInfo()
          } else {
            _this.showError()
          }
        })
      } else {
        _this.sendBasicInfo()
      }
    },
    sendBasicInfo() {
      let _this = this
      // basicinfo
      _this.axios({
        method: 'post',
        url: '/api/admin/basicinfo',
        headers: {'Content-Type': 'application/json'},
        data: {
          method: 'modify',
          language: 'cn',
          data: _this.basicInfo
        }
      }).then((response) => {
        let data = response.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          _this.showError()
        }
      })
    },
    showError() {
      let _this = this
      _this.toase.submitText = '出错了！'
      _this.toase.submitIcon = 'sad'
      setTimeout(() => {
        _this.toase.submitShow = false
      }, 500)
    },
    showSuccess() {
      let _this = this
      _this.toase.submitText = '提交成功！'
      _this.toase.submitIcon = 'appreciate'
      setTimeout(() => {
        _this.toase.submitShow = false
        _this.$router.push('/admin/home')
      }, 500)
    }
  },
  components: {
    quillEditor,
    toast
  }
}
</script>

<style>
@import "../common/basicInfoEdit.css";
</style>
