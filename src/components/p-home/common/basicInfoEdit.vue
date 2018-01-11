<template>
<div class="basic-info-edit">
  <!-- cn -->
  <h2 v-if="lang === 'cn'" class="edit-h2">编辑基础信息</h2>
  <router-link v-if="lang === 'cn'" to="/admin/home" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <!-- en -->
  <h2 v-if="lang === 'en'" class="edit-h2">Edit Basic Information</h2>
  <router-link v-if="lang === 'en'" to="/admin/home/en" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>

  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td v-if="lang === 'cn'" width="100">公司名称</td>
          <td v-if="lang === 'en'" width="100">CO. Name</td>
          <td><input type="text" v-model="basicInfo.name"></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">全称</td>
          <td v-if="lang === 'en'">Full Name</td>
          <td><input style="width: 400px;" type="text" v-model="basicInfo.full_name"></td>
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
          <td v-if="lang === 'cn'" class="vertical-middle">地址</td>
          <td v-if="lang === 'en'" class="vertical-middle">Address</td>
          <td><textarea type="text" rows="2" v-model="basicInfo.address"></textarea></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">邮箱</td>
          <td v-if="lang === 'en'">Email</td>
          <td><input type="text" v-model="basicInfo.email"></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">电话</td>
          <td v-if="lang === 'en'">Tel</td>
          <td><input type="text" v-model="basicInfo.telephone"></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">联系人</td>
          <td v-if="lang === 'en'">Linkman</td>
          <td><input type="text" v-model="basicInfo.linkman"></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">工作时间</td>
          <td v-if="lang === 'en'">Work Time</td>
          <td><input type="text" v-model="basicInfo.worktime"></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">简介</td>
          <td v-if="lang === 'en'">Profile</td>
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
          <td v-if="lang === 'cn'"><button type="button" class="button" @click="submit">提交</button></td>
          <td v-if="lang === 'en'"><button type="button" class="button" @click="submit">提交</button></td>
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
import apiEn from 'components/tools/api-en'

export default {
  props: {
    lang: {
      type: String,
      default: 'cn'
    }
  },
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
  computed: {
    api() {
      return this.lang === 'cn' ? api : apiEn
    }
  },
  created() {
    this.axios(this.api.basicInfo.query()).then((res) => {
      let data = res.data
      if (data.code === '200') {
        this.basicInfo = data.data
      } else {
        util.req.queryError(this.toast)
      }
    })
  },
  methods: {
    chooseLogo(e) {
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        this.basicInfo.logo = result
      })
    },
    deleteLogo() {
      this.basicInfo.logo = ''
      this.file = null
    },
    submit() {
      // 如果上传了图片
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendLogo()
    },
    sendLogo() {
      if (this.file) {
        this.uploadFile(this.file, (url) => {
          this.basicInfo.logo = url
          this.sendBasicInfo()
        })
      } else {
        this.sendBasicInfo()
      }
    },
    sendBasicInfo() {
      this.axios(this.api.basicInfo.update(this.basicInfo)).then((response) => {
        let data = response.data
        if (data.code === '200') {
          this.showSuccess()
        } else {
          this.showError()
        }
      })
    },
    uploadFile(file, callback) {
      util.uploadFile(this, file, callback, () => {
        this.showError()
      })
    },
    showError() {
      util.req.changeError(this.toast)
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      setTimeout(() => {
        let link = this.lang === 'cn' ? '/admin/home' : '/admin/home/en'
        this.$router.push(link)
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
.basic-info-edit {
  position: relative;
}
.basic-info-edit .quill-editor .ql-container {
  height: 180px;
}
</style>
