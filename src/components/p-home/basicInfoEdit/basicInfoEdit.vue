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
        <tr>
          <td width="90">全称</td>
          <td><input type="text" v-model="basicInfo.full_name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">LOGO<span class="separate"></span></td>
          <td>
            <edit-pic
              logo="true"
              boxWidth="402"
              boxHeight="122"
              :img="basicInfo.logo"
              id="inputLogo"
              note="（400px × 120px，100kb以内）"
              @choosePic="chooseLogo"
              @deletePic="deleteLogo"
              >
            </edit-pic>
          </td>
        </tr>
        <tr>
          <td class="vertical-middle">地址</td>
          <td><textarea type="text" rows="2" v-model="basicInfo.address"></textarea></td>
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
          <td>联系人</td>
          <td><input type="text" v-model="basicInfo.linkman"></td>
        </tr>
        <tr>
          <td>工作时间</td>
          <td><input type="text" v-model="basicInfo.worktime"></td>
        </tr>
        <!-- ad -->
        <tr>
          <td>广告图</td>
          <td>
            <!-- add ad -->
            <label for="addAd" class="button button-second">添加图片</label>
            <input type="file" id="addAd" accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="addAd">
            <ul class="basic-info-edit-banner-ul f-clearfix">
              <li class="basic-info-edit-banner-li" v-for="(banner, index) in basicInfo.banner">
                <div class="basic-info-edit-banner-img">
                  <img :src="banner.img">
                  <!-- changeAd -->
                  <label :for="'ad' + index">选择图片</label>
                  <input type="file" :id="'ad' + index" accept="image/png, image/jpeg, image/gif, image/jpg"
                  @change="changeAd(index, $event)">
                </div>
                <div class="basic-info-edit-banner-input">
                  链接<input type="text" v-model="banner.link" placeholder="">
                </div>
                <div class="basic-info-edit-banner-input">
                  顺序<input type="text" v-model="banner.sort" placeholder="">
                </div>
                <!-- delete ad -->
                <span class="icon-round_close_fill" @click="deleteAd(index)"></span>
              </li>
            </ul>
          </td>
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
    v-show="toast.show"
    :text="toast.text"
    :icon="toast.icon"
  >
  </toast>
</div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import editPic from 'components/c-edit-pic/edit-pic'
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api'
export default {
  data() {
    return {
      basicInfo: {},
      // quill
      editorOption: {
        placeholder: '输入内容...',
        modules: {
          toolbar: this.$store.state.quillEditor.easy
        }
      },
      // file
      file: null,

      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      }
    }
  },
  created() {
    let _this = this
    _this.axios(api.basicInfo.query()).then((res) => {
      let data = res.data
      if (data.code === '200') {
        _this.basicInfo = data.data
      } else {
        util.req.queryError(this.toast)
      }
    })
  },
  methods: {
    chooseLogo(e) {
      let _this = this
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        _this.basicInfo.logo = result
      })
    },
    deleteLogo() {
      this.basicInfo.logo = ''
      this.file = null
    },
    // ad
    addAd(e) {
      let _this = this
      this.uploadFile(e.target.files[0], (url) => {
        _this.basicInfo.banner.push({img: url, link: '', sort: '', lang: 'cn'})
      })
    },
    changeAd(index, e) {
      let _this = this
      this.uploadFile(e.target.files[0], (url) => {
        _this.basicInfo.banner[index].img = url
      })
    },
    deleteAd(index) {
      this.basicInfo.banner.splice(index, 1)
    },
    submit() {
      // 如果上传了图片
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendLogo()
    },
    sendLogo() {
      let _this = this
      if (this.file) {
        _this.uploadFile(_this.file, (url) => {
          _this.basicInfo.logo = url
          _this.sendBasicInfo()
        })
      } else {
        _this.sendBasicInfo()
      }
    },
    sendBasicInfo() {
      let _this = this
      this.axios(api.basicInfo.update(this.basicInfo)).then((response) => {
        let data = response.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          _this.showError()
        }
      })
    },
    uploadFile(file, callback) {
      let _this = this
      util.uploadFile(this, file, callback, () => {
        _this.showError()
      })
    },
    showError() {
      util.req.changeError(this.toast)
    },
    showSuccess() {
      let _this = this
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      setTimeout(() => {
        _this.$router.push('/admin/home')
      }, 700)
    }
  },
  components: {
    quillEditor,
    toast,
    editPic
  }
}
</script>

<style>
@import "../common/basicInfoEdit.css";
</style>
