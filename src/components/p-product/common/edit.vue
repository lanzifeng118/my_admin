<template>
<div class="product-edit edit">
  <!-- cn -->
  <h2 class="edit-h2" v-if="lang === 'cn' && !typeAdd">编辑产品</h2>
  <h2 class="edit-h2" v-if="lang === 'cn' && typeAdd">添加产品</h2>
  <router-link v-if="lang === 'cn'" to="/admin/product/list" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <!-- en -->
  <h2 class="edit-h2" v-if="lang === 'en' && !typeAdd">Edit Product</h2>
  <h2 class="edit-h2" v-if="lang === 'en' && typeAdd">Add Product</h2>
  <router-link v-if="lang === 'en'" to="/admin/product/listen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- 产品名称 -->
        <tr>
          <td width="100" v-if="lang === 'cn'"><span class="icon-nessisary"></span>产品名称</td>
          <td width="100" v-if="lang === 'en'"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model="item.name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td v-if="lang === 'cn'" class="vertical-top">预览图</td>
          <td v-if="lang === 'en'" class="vertical-top">Preview Pic</td>
          <td>
            <edit-pic
              boxWidth="240"
              boxHeight="200"
              :img="item.img"
              id="inputImg"
              note="（宽度240px，高度180px）"
              @choosePic="chooseImg"
              @deletePic="deleteImg"
            >
            </edit-pic>
          </td>
        </tr>
        <!-- 显示 -->
        <tr>
          <td v-if="lang === 'cn'" class="vertical-middle">显示</td>
          <td v-if="lang === 'en'" class="vertical-middle">Display</td>
          <td class="show">
            <span
              :class="[item.display === 'Y' ? 'icon-square_check_fill' : 'icon-square']"
              @click="toggleDisplay"
            >
            </span>
          </td>
        </tr>
        <!-- 顺序 -->
        <tr>
          <td v-if="lang === 'cn'">顺序</td>
          <td v-if="lang === 'en'">Order</td>
          <td><input type="text" v-model="item.sort"></td>
        </tr>
        <!-- 品牌 -->
        <tr>
          <td v-if="lang === 'cn'">品牌</td>
          <td v-if="lang === 'en'">Brand</td>
          <td>
            <select v-model="item.classify">
              <option v-if="lang === 'cn'" disabled value="">选择品牌</option>
              <option v-if="lang === 'en'" disabled value="">Choose Brand</option>
              <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
            </select>
          </td>
        </tr>
        <!-- PDF -->
        <tr>
          <td v-if="lang === 'cn'">资源</td>
          <td v-if="lang === 'en'">Resource</td>
          <td class="pdf">
            <label for="inputResources" class="button button-second">
              <span class=" icon icon-round_add"></span>添加文件
            </label>
            <input type="file" id="inputResources" accept="application/pdf, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="chooseResources">
            <ul>
              <li class="pdf-box" v-for="(resource, resourceIndex) in item.resources" :title="resource.name">
                <span v-if="resource.type === 'pdf'" class="icon icon-pdf"></span>
                <span v-if="resource.type === 'doc'" class="icon icon-word"></span>
                <span v-if="resource.type === 'xlsx' || resource.type === 'xls'" class="icon icon-excel"></span>
                {{resource.name}}
                <span class="icon-round_close_fill" @click="deleteResources(resourceIndex)"></span>
              </li>
            </ul>
          </td>
        </tr>
        <!-- 简要描述 -->
        <tr>
          <td v-if="lang === 'cn'" class="vertical-top">简要描述</td>
          <td v-if="lang === 'en'" class="vertical-top">Brief</td>
          <td><textarea rows="3" type="text" v-model="item.brief"></textarea></td>
        </tr>
        <!-- 详细介绍 -->
        <tr>
          <td v-if="lang === 'cn'" class="vertical-top">详细介绍</td>
          <td v-if="lang === 'en'" class="vertical-top">Detail</td>
          <td>
              <editor @input="editorChange" :value="item.detail"></editor>
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
  <percent
    :show="percent.show"
    :progress="percent.progress"
    @cancle="cancleResources"
  >
  </percent>
</div>
</template>

<script>
import editor from 'components/c-editor/editor'
import toast from 'components/toast/toast'
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
        name: '',
        display: 'Y',
        img: '',
        sort: '1',
        resources: [],
        brief: '',
        classify: '', // 读取接口
        detail: '',
        createdTime: '',
        modifyTime: ''
      },
      // classify
      classify: [],
      // file
      file: null,
      // toast
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
      this.getClassiy()
      let addLink = this.lang === 'cn' ? '/admin/product/add' : '/admin/product/adden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.productList.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此产品不存在', 'close')
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
    getClassiy() {
      this.axios(this.api.productClassify.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.classify = data.data.list
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
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        this.item.img = result
      })
    },
    deleteImg() {
      this.item.img = ''
      this.file = null
    },
    toggleDisplay() {
      if (this.item.display === 'Y') {
        this.item.display = 'N'
      } else {
        this.item.display = 'Y'
      }
    },
    chooseResources(e) {
      let file = e.target.files[0]
      this.xhr = util.uploadBigFile(file, this.percent, (obj) => {
        this.item.resources.push(obj)
      }, () => {
        util.req.changeError(this.toast)
      })
    },
    deleteResources(index) {
      this.item.resources.splice(index, 1)
    },
    cancleResources() {
      this.xhr.abort()
      this.percent.show = 'false'
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
        obj = this.api.productList.insert(this.item)
      } else {
        obj = this.api.productList.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '产品名称已存在', 'close')
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
        util.toast.fade(this.toast, '产品名称不能为空')
        return false
      }
      if (this.item.sort && !util.isNum(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为整数')
        return false
      }
      this.item.sort = parseInt(this.item.sort)
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
        let link = this.lang === 'en' ? '/admin/product/listen' : '/admin/product/list'
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
    editor,
    toast,
    editPic,
    percent
  }
}
</script>

<style>
</style>
