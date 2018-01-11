<template>
<div class="edit product-classify-edit">
  <!-- cn -->
  <h2 class="edit-h2" v-if="lang === 'cn' && !typeAdd">编辑品牌</h2>
  <h2 class="edit-h2" v-if="lang === 'cn' && typeAdd">添加品牌</h2>
  <router-link v-if="lang === 'cn'" to="/admin/product/classify" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <!-- en -->
  <h2 class="edit-h2" v-if="lang === 'en' && !typeAdd">Edit Brand</h2>
  <h2 class="edit-h2" v-if="lang === 'en' && typeAdd">Add Brand</h2>
  <router-link v-if="lang === 'en'" to="/admin/product/classifyen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>

  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td v-if="lang === 'cn'" width="100"><span class="icon-nessisary"></span>品牌名称</td>
          <td v-if="lang === 'en'" width="100"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- fullName -->
        <tr>
          <td v-if="lang === 'cn'"><span class="icon-nessisary"></span>品牌全称</td>
          <td v-if="lang === 'en'"><span class="icon-nessisary"></span>Full Name</td>
          <td><input type="text" class="product-classify-edit-link" v-model.trim="item.full_name"></td>
        </tr>
        <!-- sort -->
        <tr>
          <td v-if="lang === 'cn'">顺序</td>
          <td v-if="lang === 'en'">Order</td>
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
          <td v-if="lang === 'cn'" class="vertical-top">缩略图<span class="separate"></span></td>
          <td v-if="lang === 'en'" class="vertical-top">Preview Pic<span class="separate"></span></td>
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
          <td v-if="lang === 'cn'" class="vertical-top">广告图<span class="separate"></span></td>
          <td v-if="lang === 'en'" class="vertical-top">Banner Pic<span class="separate"></span></td>
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
          <td v-if="lang === 'cn'">广告链接</td>
          <td v-if="lang === 'en'">Banner Link</td>
          <td>
            <input class="product-classify-edit-link" type="text" v-model.trim="item.banner_link">
          </td>
        </tr>
        <tr>
          <td></td>
          <td v-if="lang === 'cn'"><button type="button" class="button" @click="submit">提交</button></td>
          <td v-if="lang === 'en'"><button type="button" class="button" @click="submit">Submit</button></td>
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
    lang: {
      type: String,
      default: 'cn'
    }
  },
  data() {
    return {
      typeAdd: true,
      item: {
        logo: '',
        name: '',
        sort: '1',
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
  computed: {
    api() {
      return this.lang === 'cn' ? api : apiEn
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
      let addLink = this.lang === 'cn' ? '/admin/product/classifyadd' : '/admin/product/classifyadden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.productClassify.queryById(id)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此品牌不存在', 'close')
            this.goBack()
          }
          console.log(data)
        }
      })
    },
    chooseLogo(e) {
      this.fileLogo = e.target.files[0]
      util.myFileReader(this.fileLogo, (result) => {
        this.item.logo = result
      })
    },
    deleteLogo() {
      this.item.logo = ''
      this.fileLogo = null
    },
    chooseImg(e) {
      this.fileImg = e.target.files[0]
      util.myFileReader(this.fileImg, (result) => {
        this.item.img = result
      })
    },
    deleteImg() {
      this.item.img = ''
      this.fileImg = null
    },
    chooseBanner(e) {
      this.fileBanner = e.target.files[0]
      util.myFileReader(this.fileBanner, (result) => {
        this.item.banner_img = result
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
      this.sendPic(this.fileLogo, 'logo', () => {
        this.sendImg()
      })
    },
    sendImg() {
      this.sendPic(this.fileImg, 'img', () => {
        this.sendBanner()
      })
    },
    sendBanner() {
      this.sendPic(this.fileBanner, 'banner_img', () => {
        this.sendData()
      })
    },
    sendData() {
      let obj = null
      if (this.typeAdd) {
        obj = this.api.productClassify.insert(this.item)
      } else {
        obj = this.api.productClassify.update(this.item)
      }
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '品牌名称已存在', 'close')
        } else {
          util.req.changeError(this.toast)
        }
      }).catch((err) => {
        if (err) {
          util.req.changeError(this.toast)
        }
      })
    },
    verify() {
      if (!this.item.name) {
        util.toast.fade(this.toast, '品牌名称不能为空')
        return false
      }
      if (!this.item.full_name) {
        util.toast.fade(this.toast, '品牌全称不能为空')
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
      setTimeout(() => {
        let link = this.lang === 'cn' ? '/admin/product/classify' : '/admin/product/classifyen'
        this.$router.push(link)
      }, 700)
    },
    uploadFile(file, callback) {
      util.uploadFile(this, file, callback, () => {
        util.req.changeError(this.toast)
      })
    },
    sendPic(file, key, callback) {
      if (file) {
        this.uploadFile(file, (url) => {
          this.item[key] = url
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
