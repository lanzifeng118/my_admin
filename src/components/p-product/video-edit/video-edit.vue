<template>
<div class="edit product-classify-edit">
  <h2 class="edit-h2" v-if="!typeAdd">编辑视频</h2>
  <h2 class="edit-h2" v-if="typeAdd">添加视频</h2>
  <router-link to="/admin/product/video" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td width="100"><span class="icon-nessisary"></span>视频名称</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- 分类 -->
        <tr>
          <td>分类</td>
          <td>
            <select v-model="item.classify">
              <option disabled value="">选择分类</option>
              <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
            </select>
          </td>
        </tr>
        <!-- img -->
        <tr>
          <td class="vertical-top">预览图<span class="separate"></span></td>
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
        <!-- 视频 -->
        <tr>
          <td>视频</td>
          <td class="pdf">
            <label for="inputVideo" class="button button-second">
              <span class=" icon icon-round_add"></span>选择视频
            </label>
            <input type="file" id="inputVideo" accept="video/mp4" @change="chooseVideo">
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
      // classify
      classify: [],
      // file
      fileImg: null,
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
    this.getClassiy()
  },
  methods: {
    getItem() {
      if (this.$route.path === '/admin/product/videoadd') {
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
    getClassiy() {
      let _this = this
      this.axios(api.productClassify.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.classify = data.data.list
        } else {
          _this.queryErrorGoBack()
        }
      }).catch((err) => {
        if (err) {
          _this.queryErrorGoBack()
        }
      })
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
    chooseVideo(e) {

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
