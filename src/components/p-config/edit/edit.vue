<template>
<div class="edit">
  <h2 class="edit-h2">编辑系统配置</h2>
  <router-link to="/admin/config" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td width="100">账号</td>
          <td><input type="text" v-model="item.username"></td>
        </tr>
        <!-- email -->
        <tr>
          <td width="120">邮箱</td>
          <td><input type="text" v-model="item.email"></td>
        </tr>
        <tr>
          <td class="vertical-top">头像<span class="separate"></span></td>
          <td>
            <edit-pic
              boxWidth="160"
              boxHeight="160"
              :img="item.avatar"
              id="inputLogo"
              note="（宽度150px，高度150px）"
              @choosePic="chooseImg"
              @deletePic="deleteImg"
            >
            </edit-pic>
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
import toast from 'components/toast/toast'
import editPic from 'components/c-edit-pic/edit-pic'
import util from 'components/tools/util'
import api from 'components/tools/api'
export default {
  props: {
    page: String,
    lang: {
      type: String,
      default: 'cn'
    }
  },
  data() {
    return {
      item: {},
      // file
      file: null,

      toast: {
        show: false,
        text: '',
        icon: ''
      }

    }
  },
  created() {
    this.getItem()
  },
  methods: {
    getItem() {
      this.item = this.$store.state.user
    },
    chooseImg(e) {
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        this.item.avatar = result
      })
    },
    deleteImg() {
      this.item.avatar = ''
      this.file = null
    },
    submit() {
      if (!this.verify()) {
        return
      }
      // 如果上传了图片
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendImg()
    },
    sendImg() {
      if (this.file) {
        util.uploadFile(this, this.file, (url) => {
          this.item.avatar = url
          this.sendData()
        }, () => {
          this.showError()
        })
      } else {
        this.sendData()
      }
    },
    sendData() {
      this.axios(api.user.update(this.item)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else {
          this.showError()
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          this.showError()
        }
      })
    },
    verify() {
      if (!this.item.username) {
        util.toast.fade(this.toast, '用户名不能为空')
        return false
      }
      return true
    },
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      this.goback()
    },
    goback() {
      setTimeout(() => {
        this.$router.push('/admin/config')
      }, 700)
    }
  },
  components: {
    toast,
    editPic
  }
}
</script>

<style>

</style>
