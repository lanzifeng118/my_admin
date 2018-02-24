<template>
<div class="news-edit edit">
  <!-- cn -->
  <div v-if="lang === 'cn'">
    <h2 class="edit-h2" v-if="!typeAdd">编辑新闻</h2>
    <h2 class="edit-h2" v-if="typeAdd">添加新闻</h2>
    <router-link to="/admin/news/list" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
  </div>
  <!-- en -->
  <div v-if="lang === 'en'">
    <h2 class="edit-h2" v-if="!typeAdd">Edit News</h2>
    <h2 class="edit-h2" v-if="typeAdd">Add News</h2>
    <router-link to="/admin/news/listen" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
  </div>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- 新闻标题 -->
        <tr>
          <td v-if="lang === 'cn'" width="100"><span class="icon-nessisary"></span>新闻标题</td>
          <td v-if="lang === 'en'" width="100"><span class="icon-nessisary"></span>Title</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td v-if="lang === 'cn'" class="vertical-top">预览图<span class="separate"></span></td>
          <td v-if="lang === 'en'" class="vertical-top">Preview Pic<span class="separate"></span></td>
          <td>
            <edit-pic
              logo="true"
              boxWidth="240"
              boxHeight="200"
              :img="item.img"
              id="inputImg"
              note="（宽度307px，高度156px）"
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
          <td><input type="text" v-model.trim="item.sort"></td>
        </tr>
        <!-- 分类 -->
        <tr>
          <td v-if="lang === 'cn'">分类</td>
          <td v-if="lang === 'en'">Classify</td>
          <td>
            <select v-model="item.classify">
              <option disabled value="" v-if="lang === 'cn'">选择分类</option>
              <option disabled value="" v-if="lang === 'en'">Choose Classify</option>
              <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
            </select>
          </td>
        </tr>
        <!-- 简要描述 -->
        <tr>
          <td v-if="lang === 'cn'" class="vertical-top">简要描述</td>
          <td v-if="lang === 'en'" class="vertical-top">Breif</td>
          <td><textarea rows="3" type="text" v-model.trim="item.brief"></textarea></td>
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
</div>
</template>

<script>
import editor from 'components/c-editor/editor'
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
        name: '',
        display: 'Y',
        img: '',
        sort: '1',
        brief: '',
        classify: '', // 读取接口
        detail: '',
        createdTime: '',
        modifyTime: ''
      },
      // classify
      classify: [],
      // editor
      editorOption: { // 编辑器的配置
        placeholder: '输入内容...',
        modules: {
          toolbar: this.$store.state.quillEditor.nomal
        }
      },
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
      let addLink = this.lang === 'cn' ? '/admin/news/add' : '/admin/news/adden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.newsList.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此新闻不存在', 'close')
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
      this.axios(this.api.newsClassify.query()).then((res) => {
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
        obj = this.api.newsList.insert(this.item)
      } else {
        obj = this.api.newsList.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '新闻标题已存在', 'close')
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
        util.toast.fade(this.toast, '新闻标题不能为空')
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
        let link = this.lang === 'cn' ? '/admin/news/list' : '/admin/news/listen'
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
    editPic
  }
}
</script>

<style>
</style>
