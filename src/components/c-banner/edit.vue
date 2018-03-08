<template>
<div class="edit banner-edit">
  <h2 class="edit-h2">{{eidtText}}</h2>
  <router-link :to="listUrl" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- img -->
        <tr>
          <td width="90">{{LinkText}}</td>
          <td><input type="text" v-model.trim="item.link" style="width: 500px"></td>
        </tr>
        <tr>
          <td class="vertical-top">{{BannerText}}<span class="separate"></span></td>
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
          <td><button type="button" class="button" @click="submit">{{SubmitText}}</button></td>
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
import apiEn from 'components/tools/api-en'
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
  computed: {
    listUrl() {
      let url = '/admin/' + this.page +'/banner'
      if (this.lang === 'en') {
        url += 'en'
      }
      return url
    },
    apiCal() {
      let key = this.page + 'Banner'
      let apiCal = null
      if (this.lang === 'en') {
        apiCal = apiEn[key]
      } else {
        apiCal = api[key]
      }
      return apiCal
    },
    eidtText() {
      if (this.lang === 'en') {
        return 'Edit Banner'
      } else {
        return '编辑广告图'
      }
    },
    LinkText() {
      if (this.lang === 'en') {
        return 'Link'
      } else {
        return '链接'
      }
    },
    BannerText() {
      if (this.lang === 'en') {
        return 'Banner'
      } else {
        return '广告图'
      }
    },
    SubmitText() {
      if (this.lang === 'en') {
        return 'Submit'
      } else {
        return '提交'
      }
    }
  },
  created() {
    this.getItem()
  },
  methods: {
    getItem() {
      this.axios(this.apiCal.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.item = data.data
        } else {
          util.req.queryError(this.toast)
          this.goback()
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          util.req.queryError(this.toast)
          this.goback()
        }
      })
    },
    chooseImg(e) {
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        this.item.img = result
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
      if (this.file) {
        util.uploadFile(this, this.file, (url) => {
          this.item.img = url
          this.sendData()
        }, () => {
          this.showError()
        })
      } else {
        this.sendData()
      }
    },
    sendData() {
      this.axios(this.apiCal.update(this.item)).then((res) => {
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
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      this.goback()
    },
    goback() {
      setTimeout(() => {
        this.$router.push(this.listUrl)
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
