<template>
<div class="edit banner-edit">
  <h2 class="edit-h2">编辑广告图</h2>
  <router-link :to="'/admin/' + type +'/banner'" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- img -->
        <tr>
          <td width="90">超链接</td>
          <td><input type="text" v-model="item.link" style="width: 500px"></td>
        </tr>
        <tr>
          <td class="vertical-top">广告图片<span class="separate"></span></td>
          <td>
            <edit-pic
              logo="true"
              boxWidth="850"
              boxHeight="120"
              :img="item.img"
              id="inputLogo"
              note="（宽度1226px，高度130px）"
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
  props: ['type'],
  data() {
    return {
      item: {
        img: '',
        link: ''
      },
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
      let _this = this
      this.axios(api[this.type + 'Banner'].query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.item = data.data
        } else {
          util.req.queryError(this.toast)
          _this.goback()
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          util.req.queryError(this.toast)
          _this.goback()
        }
      })
    },
    chooseImg(e) {
      let _this = this
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        _this.item.img = result
      })
    },
    deleteImg() {
      this.item.img = ''
      this.file = null
    },
    submit() {
      // 如果上传了图片
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendImg()
    },
    sendImg() {
      let _this = this
      if (this.file) {
        util.uploadFile(this, this.file, (url) => {
          _this.item.img = url
          _this.sendData()
        }, () => {
          _this.showError()
        })
      } else {
        _this.sendData()
      }
    },
    sendData() {
      let _this = this
      this.axios(api[this.type + 'Banner'].update(this.item)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          _this.showError()
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          _this.showError()
        }
      })
    },
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      this.goback()
    },
    goback() {
      let _this = this
      setTimeout(() => {
        _this.$router.push('/admin/' + _this.type + '/banner')
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
