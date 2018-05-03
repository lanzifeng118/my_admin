<template>
<div class="edit product-classify-edit">
  <!-- cn -->
  <h2 class="edit-h2" v-if="!typeAdd">{{lang === 'cn' ? '编辑视频' : 'Edit Video'}}</h2>
  <h2 class="edit-h2" v-else>{{lang === 'cn' ? '添加视频' : 'Add Video'}}</h2>
  <router-link v-if="lang === 'cn'" to="/admin/product/video" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <router-link v-else to="/admin/product/listen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>

  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td width="100"><span class="icon-nessisary"></span>{{lang === 'cn' ? '视频名称' : 'Name'}}</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- 品牌 -->
        <tr>
          <td>{{lang === 'cn' ? '品牌' : 'Brand'}}</td>
          <td>
            <select v-model="item.classify">
              <option disabled>{{lang === 'cn' ? '选择品牌' : 'Choose Brand'}}</option>
              <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
            </select>
          </td>
        </tr>
        <!-- img -->
        <tr>
          <td class="vertical-top">{{lang === 'cn' ? '预览图' : 'Preview Pic'}}<span class="separate"></span></td>
          <td>
            <edit-pic
              boxWidth="294"
              boxHeight="147"
              :img="item.img"
              id="inputImg"
              note="(宽度232px，高度141px)"
              @choosePic="chooseImg"
              @deletePic="deleteImg"
            >
            </edit-pic>
          </td>
        </tr>
        <!-- 视频 -->
        <tr>
          <td>{{lang === 'cn' ? '视频' : 'Video'}}</td>
          <td class="pdf">
            <label for="inputVideo" class="button button-second">
              <span class=" icon icon-round_add"></span>{{lang === 'cn' ? '选择视频' : 'Choose Video'}}
            </label>
            <input type="file" id="inputVideo" accept="video/mp4" @change="chooseVideo">
            <div class="pdf-box" v-if="item.video" :title="item.name">
              <span class="icon icon-video">
              {{item.name}}</span>
              <span class="icon-round_close_fill" @click="deleteVideo"></span>
            </div>
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
  <percent
    :show="percent.show"
    :progress="percent.progress"
    @cancle="cancleVideo"
  >
  </percent>
</div>
</template>

<script>

import percent from 'components/c-percent/percent'
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
        classify: '',
        name: '',
        img: '',
        video: ''
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
      },
      // percent
      percent: {
        show: 'false',
        progress: 0
      }
    }
  },
  computed: {
    api() {
      return this.lang === 'cn' ? api : apiEn
    }
  },
  created() {
    this.getClassiy()
  },
  watch: {
    '$route' (to, from) {
      this.getClassiy()
    }
  },
  methods: {
    getItem() {
      let addLink = this.lang === 'cn' ? '/admin/product/videoadd' : '/admin/product/videoadden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.productVideo.queryById(id)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
            console.log(this.item.classify)
            this.item.classify = this.item.classify.trim()
          } else {
            util.toast.show(this.toast, '此视频不存在', 'close')
            this.goBack()
          }
        }
      })
    },
    getClassiy() {
      this.axios(this.api.productClassify.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.classify = data.data.list
          this.getItem()
        } else {
          this.queryErrorGoBack()
        }
      }).catch((err) => {
        if (err) {
          this.queryErrorGoBack()
        }
      })
    },
    chooseImg(e) {
      this.fileImg = e.target.files[0]
      util.myFileReader(this.fileImg, (result) => {
        this.item.img = result
        console.log(this.item)
      })
    },
    deleteImg() {
      this.item.img = ''
      this.fileImg = null
    },
    chooseVideo(e) {
      let file = e.target.files[0]
      this.xhr = util.uploadBigFile(file, this.percent, (obj) => {
        this.item.video = obj.url
        if (!this.item.name) {
          this.item.name = obj.name
        }
      }, () => {
        this.cancleVideo()
        util.req.changeError(this.toast)
      })
    },
    deleteVideo() {
      this.item.video = ''
    },
    cancleVideo() {
      this.xhr.abort()
      this.percent.show = 'false'
    },
    submit() {
      // 验证
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      console.log(this.item)
      this.sendImg()
    },
    sendImg() {
      if (this.fileImg) {
        this.sendPic(this.fileImg, 'img', () => {
          this.sendData()
        })
      } else {
        this.sendData()
      }
    },
    sendData() {
      let obj = null
      let apiVideo = this.api.productVideo
      if (this.typeAdd) {
        obj = apiVideo.insert(this.item)
      } else {
        obj = apiVideo.update(this.item)
      }
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '视频名称已存在', 'close')
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
        util.toast.fade(this.toast, '视频名称不能为空')
        return false
      }
      if (!this.item.video) {
        util.toast.fade(this.toast, '请上传视频')
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
        let link = this.lang === 'cn' ? '/admin/product/video' : '/admin/product/videoen'
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
    editPic,
    percent
  }
}
</script>

<style>
.product-classify-edit-link {
  width: 500px;
}
</style>
