<template>
  <div class="experience-edit edit">
    <!-- cn -->
    <h2 class="edit-h2" v-if="!typeAdd">{{lang === 'cn' ? '编辑Logo' : 'Edit Logo'}}</h2>
    <h2 class="edit-h2" v-if="typeAdd">{{lang === 'cn' ? '添加Logo' : 'Add Logo'}}</h2>
    <router-link v-if="lang === 'cn'" to="/admin/experience/list" class="edit-close-btn">
      <span class="icon-round_close_fill"></span>
    </router-link>
    <router-link v-else to="/admin/experience/listen" class="edit-close-btn">
      <span class="icon-round_close_fill"></span>
    </router-link>
    <div class="edit-table-wrap">
      <table>
        <tbody>
          <tr>
            <td>
              <span class="icon-nessisary"></span>{{lang === 'cn' ? '名称' : 'Name'}}</td>
            <td><input type="text" v-model.trim="item.name"></td>
          </tr>
          <tr>
            <td width="100">
              <span class="icon-nessisary"></span>Logo</td>
            <td>
              <edit-pic boxWidth="211" boxHeight="87" :img="item.img" id="inputImg" note="（宽度209px，高度85px）" @choosePic="chooseImg" @deletePic="deleteImg">
              </edit-pic>
            </td>
          </tr>
          <tr>
            <td>{{lang === 'cn' ? '顺序' : 'Order'}}</td>
            <td><input type="text" v-model.trim.number="item.sort"></td>
          </tr>
          <tr>
            <td>
              <span class="icon-nessisary"></span>{{lang === 'cn' ? '品牌' : 'Brand'}}</td>
            <td>
              <select v-model.lazy="item.brand">
                <option value="" disabled>{{lang === 'cn' ? '选择品牌' : 'Choose Brand'}}</option>
                <option v-for="brandItem in brand">{{brandItem.name}}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <span class="icon-nessisary"></span>{{lang === 'cn' ? '分类' : 'Classify'}}</td>
            <td>
              <select v-model.lazy="item.classify">
                <option value="" disabled>{{lang === 'cn' ? '选择分类' : 'Choose Classify'}}</option>
                <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
              </select>
            </td>
          </tr>
          <!-- 简要描述 -->
          <tr>
            <td class="vertical-top">{{lang === 'cn' ? '描述' : 'Breif'}}</td>
            <td>
              <textarea rows="3" type="text" v-model.trim="item.brief"></textarea>
              <p class="experience-edit-words" :class="{warn: wordsLength < 0}">还可以输入{{wordsLength}}个{{lang === 'cn' ? '汉字' : '字母'}}</p>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button type="button" class="button" @click="submit">{{lang === 'cn' ? '提交' : 'Submit'}}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon">
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
        img: '',
        brand: '',
        classify: '',
        brief: '',
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
  computed: {
    api() {
      return this.lang === 'cn' ? api : apiEn
    },
    wordsLength() {
      let len = 0
      let total = this.lang === 'cn' ? 68 : 153
      let str = this.item.brief
      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
          this.lang === 'cn' ? len++ : (len += 2)
        } else {
          this.lang === 'cn' ? (len += 0.5) : len++
        }
      }
      return total - len
    }
  },
  created() {
    this.getBrand()
  },
  watch: {
    $route(to, from) {
      this.getBrand()
    }
  },
  methods: {
    getItem() {
      let addLink =
        this.lang === 'cn' ? '/admin/experience/add' : '/admin/experience/adden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.experienceList.queryById(id))
        .then(res => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            if (data.data) {
              this.item = data.data
              this
            } else {
              util.toast.show(this.toast, '此Logo图不存在', 'close')
              this.goBack()
            }
          }
        })
        .catch(err => {
          if (err) {
            console.log(err)
            this.queryErrorGoBack()
          }
        })
    },
    getBrand() {
      this.axios(this.api.experienceBrand.query()).then(res => {
        let data = res.data
        if (data.code === '200') {
          this.brand = data.data.list
          this.getClassiy()
        }
      })
    },
    getClassiy() {
      this.axios(this.api.experienceClassify.query()).then(res => {
        let data = res.data
        // console.log(res.data)
        if (data.code === '200') {
          this.classify = data.data.list
          this.getItem()
        }
      })
    },
    chooseImg(e) {
      this.file = e.target.files[0]
      util.myFileReader(this.file, result => {
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
        obj = this.api.experienceList.insert(this.item)
      } else {
        obj = this.api.experienceList.update(this.item)
      }
      console.log(obj)
      this.axios(obj)
        .then(res => {
          let data = res.data
          if (data.code === '200') {
            this.showSuccess()
          } else {
            util.req.changeError(this.toast)
          }
        })
        .catch(err => {
          if (err) {
            util.req.changeError(this.toast)
          }
        })
    },
    verify() {
      if (!this.item.name) {
        util.toast.fade(this.toast, '名称不能为空')
        return false
      }
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
        let link =
          this.lang === 'cn'
            ? '/admin/experience/list'
            : '/admin/experience/listen'
        this.$router.push(link)
      }, 700)
    },
    uploadFile(file, callback) {
      util.uploadFile(this, file, callback, () => {
        this.showError()
      })
    },
    sendPic(file, key, callback) {
      if (file) {
        this.uploadFile(file, url => {
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
.experience-edit-words {
  margin-top: 10px;
  font-size: 12px;
  color: #666;
}
.experience-edit-words.warn {
  color: #e29800;
}
</style>
