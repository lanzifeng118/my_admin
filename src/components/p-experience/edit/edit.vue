<template>
<div class="product-edit edit">
  <h2 class="edit-h2" v-if="!typeAdd">编辑Logo</h2>
  <h2 class="edit-h2" v-if="typeAdd">添加Logo</h2>
  <router-link to="/admin/experience/list" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100"><span class="icon-nessisary"></span>Logo图</td>
          <td>
            <edit-pic
              boxWidth="180"
              boxHeight="70"
              :img="item.img"
              id="inputImg"
              note="（宽度113px，高度50px）"
              @choosePic="chooseImg"
              @deletePic="deleteImg"
            >
            </edit-pic>
          </td>
        </tr>
        <tr>
          <td><span class="icon-nessisary"></span>品牌</td>
          <td>
            <select v-model="item.brand">
              <option disabled value="">选择品牌</option>
              <option v-for="brandItem in brand">{{brandItem.name}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td><span class="icon-nessisary"></span>分类</td>
          <td>
            <select v-model="item.classify">
              <option disabled value="">选择分类</option>
              <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>顺序</td>
          <td><input type="text" v-model="item.sort"></td>
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
        img: '',
        brand: '',
        classify: '',
        sort: '1'
      },
      // classify
      classify: [],
      // brand
      brand: [],
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
      this.getClassiy()
      this.getBrand()
      if (this.$route.path === '/admin/experience/add') {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(api.experienceList.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此Logo图不存在', 'close')
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
    getBrand() {
      this.axios(api.experienceBrand.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.brand = data.data.list
        }
      })
    },
    getClassiy() {
      this.axios(api.experienceClassify.query()).then((res) => {
        let data = res.data
        console.log(res.data)
        if (data.code === '200') {
          this.classify = data.data.list
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
        obj = api.experienceList.insert(this.item)
      } else {
        obj = api.experienceList.update(this.item)
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
        util.toast.fade(this.toast, 'Logo不能为空')
        return false
      }
      if (!this.item.brand) {
        util.toast.fade(this.toast, '品牌不能为空')
        return false
      }
      if (!this.item.classify) {
        util.toast.fade(this.toast, '分类不能为空')
        return false
      }
      if (this.item.sort && !util.isNum(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为数字')
        return false
      }
      return true
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
        this.$router.push('/admin/experience/list')
      }, 700)
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
    },
    queryErrorGoBack() {
      util.req.queryError(this.toast)
      this.goBack()
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
