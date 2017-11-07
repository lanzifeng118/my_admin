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
        <!-- name -->
        <tr>
          <td width="100"><span class="icon-nessisary"></span>分类名称</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- sort -->
        <tr>
          <td>顺序</td>
          <td><input type="text" v-model.trim="item.sort"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">LOGO<span class="separate"></span></td>
          <td>
            <edit-pic
              logo="true"
              boxWidth="300"
              boxHeight="80"
              :img="item.logo"
              id="inputLogo"
              note="(宽度200px以内，高度60px)"
              @choosePic="chooseLogo"
              @deletePic="deleteLogo"
            >
            </edit-pic>
          </td>
        </tr>
        <!-- img -->
        <tr>
          <td class="vertical-top">缩略图<span class="separate"></span></td>
          <td>
            <edit-pic
              boxWidth="294"
              boxHeight="147"
              :img="item.img"
              id="inputImg"
              note="(宽度292px，高度145px)"
              @choosePic="chooseImg"
              @deletePic="deleteImg"
            >
            </edit-pic>
          </td>
        </tr>
        <!-- banner_img -->
        <tr>
          <td class="vertical-top">广告图<span class="separate"></span></td>
          <td>
            <edit-pic
              boxWidth="650"
              boxHeight="100"
              :img="item.banner_img"
              id="inputBanner"
              note="(宽度1226px，高度130px)"
              @choosePic="chooseBanner"
              @deletePic="deleteBanner"
            >
            </edit-pic>
          </td>
        </tr>
        <!-- banner_link -->
        <tr>
          <td>广告链接</td>
          <td>
            <input class="product-classify-edit-link" type="text" v-model.trim="item.banner_link">
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
  methods: {
    getItem() {
      if (this.$route.path === '/admin/product/classifyadd') {
        return
      }
      this.typeAdd = false
      let _this = this
      let id = this.$route.params.id
      this.axios(api.productClassify.queryById(id)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此分类不存在', 'close')
            this.goBack()
          }
          console.log(data)
        }
      })
    },
    chooseLogo(e) {
      let _this = this
      this.fileLogo = e.target.files[0]
      util.myFileReader(this.fileLogo, (result) => {
        _this.item.logo = result
      })
    },
    deleteLogo() {
      this.item.logo = ''
      this.fileLogo = null
    },
    chooseImg(e) {
      let _this = this
      this.fileImg = e.target.files[0]
      util.myFileReader(this.fileImg, (result) => {
        _this.item.img = result
      })
    },
    deleteImg() {
      this.item.img = ''
      this.fileImg = null
    },
    chooseBanner(e) {
      let _this = this
      this.fileBanner = e.target.files[0]
      util.myFileReader(this.fileBanner, (result) => {
        _this.item.banner_img = result
      })
    },
    deleteBanner() {
      this.item.banner_img = ''
      this.fileBanner = null
    },
    submit() {
      // 验证
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendLogo()
    },
    sendLogo() {
      let _this = this
      this.sendPic(this.fileLogo, 'logo', () => {
        _this.sendImg()
      })
    },
    sendImg() {
      let _this = this
      this.sendPic(this.fileImg, 'img', () => {
        _this.sendBanner()
      })
    },
    sendBanner() {
      let _this = this
      this.sendPic(this.fileBanner, 'banner_img', () => {
        _this.sendData()
      })
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = api.productClassify.insert(_this.item)
      } else {
        obj = api.productClassify.update(_this.item)
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
        _this.$router.push('/admin/product/classify')
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
    toast,
    editPic
  }
}
</script>

<style>
.product-classify-edit-link {
  width: 500px;
}
</style>
