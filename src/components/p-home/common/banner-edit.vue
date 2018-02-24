
<template>
  <div class="home-banner-edit">
    <div v-if="lang === 'cn'">
      <h2 class="edit-h2" v-if="!typeAdd">编辑广告图</h2>
      <h2 class="edit-h2" v-if="typeAdd">添加广告图</h2>
      <router-link to="/admin/home/banner" class="edit-close-btn" >
        <span class="icon-round_close_fill"></span>
      </router-link>
    </div>
    <div v-if="lang === 'en'">
      <h2 class="edit-h2" v-if="!typeAdd">Edit Banner</h2>
      <h2 class="edit-h2" v-if="typeAdd">Add Banner</h2>
      <router-link to="/admin/home/banneren" class="edit-close-btn" >
        <span class="icon-round_close_fill"></span>
      </router-link>
    </div>
    <div class="edit-table-wrap">
      <table>
        <tbody>
          <!-- logo -->
          <tr>
            <td v-if="lang === 'cn'" class="vertical-top" width="100">图片</td>
            <td v-if="lang === 'en'" class="vertical-top" width="100">Picture</td>
            <td>
              <edit-pic
                logo="true"
                boxWidth="460"
                boxHeight="225"
                :img="item.img"
                id="inputImg"
                note="（宽度925px，高度451px）"
                @choosePic="chooseImg"
                @deletePic="deleteImg"
              >
              </edit-pic>
            </td>
          </tr>
          <!-- 链接 -->
          <tr>
            <td v-if="lang === 'cn'">链接</td>
            <td v-if="lang === 'en'">Link</td>
            <td><input class="long" type="text" v-model.trim="item.link"></td>
          </tr>
          <!-- 顺序 -->
          <tr>
            <td v-if="lang === 'cn'">顺序</td>
            <td v-if="lang === 'en'">Order</td>
            <td><input type="text" v-model.trim="item.sort"></td>
          </tr>
          <!-- 显示 -->
          <tr>
            <td v-if="lang === 'cn'">显示</td>
            <td v-if="lang === 'en'">Display</td>
            <td class="show">
              <span
                :class="[item.display === 'Y' ? 'icon-square_check_fill' : 'icon-square']"
                @click="toggleDisplay"
              >
              </span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td v-if="lang === 'cn'"><button class="button" @click="submit">提交</button></td>
            <td v-if="lang === 'en'"><button class="button" @click="submit">Submit</button></td>
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
      typeAdd: true,
      // item
      item: {
        img: '',
        sort: '1',
        display: 'Y'
      },
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
    this.getItem()
  },
  watch: {
    '$route' (to, from) {
      this.getItem()
    }
  },
  methods: {
    editorChange(content) {
      this.item.detail = content
    },
    getItem() {
      let addLink = this.lang === 'cn' ? '/admin/home/banneradd' : '/admin/home/banneradden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.banner.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此广告不存在', 'close')
            this.goBack()
          }
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          this.queryErrorGoBack()
        }
      })
    },
    submit() {
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendImg()
    },
    sendImg() {
      this.sendPic(this.file, 'img', () => {
        this.sendData()
      })
    },
    sendData() {
      let obj = null
      if (this.typeAdd) {
        obj = this.api.banner.insert(this.item)
      } else {
        obj = this.api.banner.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
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
      if (!this.item.img) {
        util.toast.fade(this.toast, '图片不能为空')
        return false
      }
      if (this.item.sort && !util.isNum(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为数字')
        return false
      }
      return true
    },
    toggleDisplay() {
      if (this.item.display === 'Y') {
        this.item.display = 'N'
      } else {
        this.item.display = 'Y'
      }
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
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试!', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      this.goBack()
    },
    goBack() {
      setTimeout(() => {
        let link = this.lang === 'cn' ? '/admin/home/banner' : '/admin/home/banneren'
        this.$router.push(link)
      }, 700)
    },
    queryErrorGoBack() {
      util.req.queryError(this.toast)
      this.goBack()
    },
    uploadFile(file, callback) {
      util.uploadFile(this, file, callback, () => {
        this.showError()
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
    toast
  }
}
</script>

<style>
  .home-banner-edit {
    position: relative;
  }
</style>
