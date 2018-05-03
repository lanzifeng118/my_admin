<template>
<div class="basic-info-edit">
  <!-- cn -->
  <h2 v-if="lang === 'cn'" class="edit-h2">{{lang === 'cn' ? '编辑基础信息' : 'Edit Basic Information'}}</h2>

  <router-link v-if="lang === 'cn'" to="/admin/home" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <router-link v-else to="/admin/home/en" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>

  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100">{{lang === 'cn' ? '公司名称' : 'CO. Name'}}</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '全称' : 'Full Name'}}</td>
          <td><input style="width: 400px;" type="text" v-model.trim="item.full_name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">LOGO<span class="separate"></span></td>
          <td>
            <edit-pic
              logo="true"
              boxWidth="402"
              boxHeight="122"
              :img="item.logo"
              id="inputLogo"
              note="（400px × 120px以内）"
              @choosePic="chooseLogo"
              @deletePic="deleteLogo"
              >
            </edit-pic>
          </td>
        </tr>
        <tr>
          <td class="vertical-middle">{{lang === 'cn' ? '地址' : 'Address'}}</td>
          <td><textarea type="text" rows="2" v-model.trim="item.address"></textarea></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '邮箱' : 'Email'}}</td>
          <td><input type="text" v-model.trim="item.email"></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '电话' : 'Tel'}}</td>
          <td><input type="text" v-model.trim.number="item.telephone"></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '联系人' : 'Linkman'}}</td>
          <td><input type="text" v-model.trim="item.linkman"></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '工作时间' : 'Work Time'}}</td>
          <td><input type="text" v-model.trim="item.worktime"></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '简介' : 'Breif'}}</td>
          <td>
            <quill-editor
              v-model.trim="item.brief"
              :options="editorOption"
              >
            </quill-editor>
          </td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">{{lang === 'cn' ? '提交' : 'Submit'}}</button></td>
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
      item: {},
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
        this.item = data.data
      } else {
        util.req.queryError(this.toast)
      }
    })
  },
  methods: {
    chooseLogo(e) {
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        this.item.logo = result
      })
    },
    deleteLogo() {
      this.item.logo = ''
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
          this.item.logo = url
          this.sendItem()
        })
      } else {
        this.sendItem()
      }
    },
    sendItem() {
      this.axios(this.api.basicInfo.update(this.item)).then(res => {
        let data = res.data
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
