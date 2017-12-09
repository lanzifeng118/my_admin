<template>
<div class="edit experience-classify-edit">
  <h2 class="edit-h2" v-if="!typeAdd">Add Classify</h2>
  <h2 class="edit-h2" v-if="typeAdd">Edit Classify</h2>
  <router-link to="/admin/experience/classifyen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td width="100"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">Submit</button></td>
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
import util from 'components/tools/util'
import api from 'components/tools/api-en'

export default {
  data() {
    return {
      typeAdd: true,
      item: {
        logo: '',
        name: '',
        sort: '',
        img: '',
        banner_img: '',
        banner_ling: ''
      },
      // file
      fileLogo: null,
      fileImg: null,
      fileBanner: null,
      // toastA
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
  watch: {
    '$route' (to, from) {
      this.getItem()
    }
  },
  methods: {
    getItem() {
      if (this.$route.path === '/admin/experience/classifyadden') {
        return
      }
      this.typeAdd = false
      let _this = this
      let id = this.$route.params.id
      this.axios(api.experienceClassify.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此分类不存在', 'close')
            this.goBack()
          }
        }
      })
    },
    submit() {
      // 验证
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendData()
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = api.experienceClassify.insert(_this.item)
      } else {
        obj = api.experienceClassify.update(_this.item)
      }
      _this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '分类名称已存在', 'close')
        } else {
          util.req.changeError(_this.toast)
        }
      }).catch((err) => {
        if (err) {
          util.req.changeError(_this.toast)
        }
      })
    },
    verify() {
      if (!this.item.name) {
        util.toast.fade(this.toast, '分类名称不能为空')
        return false
      }
      if (this.item.sort && !/^\d+$/.test(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为数字')
        return false
      }
      return true
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      this.goBack()
    },
    goBack() {
      let _this = this
      setTimeout(() => {
        _this.$router.push('/admin/experience/classifyen')
      }, 700)
    },
    uploadFile(file, callback) {
      let _this = this
      util.uploadFile(this, file, callback, () => {
        util.req.changeError(_this.toast)
      })
    },
    sendPic(file, key, callback) {
      let _this = this
      if (file) {
        this.uploadFile(file, (url) => {
          _this.item[key] = url
          callback()
        })
      } else {
        callback()
      }
    }
  },
  components: {
    toast
  }
}
</script>

<style>
.experience-classify-edit-link {
  width: 500px;
}
</style>
