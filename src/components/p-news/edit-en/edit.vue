<template>
<div class="news-edit edit">
  <h2 class="edit-h2" v-if="!typeAdd">Edit News</h2>
  <h2 class="edit-h2" v-if="typeAdd">Add News</h2>
  <router-link to="/admin/news/listen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- 新闻标题 -->
        <tr>
          <td width="100"><span class="icon-nessisary"></span>Title</td>
          <td><input type="text" v-model="item.name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">Preview Pic<span class="separate"></span></td>
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
          <td width="90" class="vertical-middle">Display</td>
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
          <td>Order</td>
          <td><input type="text" v-model="item.sort"></td>
        </tr>
        <!-- 分类 -->
        <tr>
          <td>分类</td>
          <td>
            <select v-model="item.classify">
              <option disabled value="">Choose Classify</option>
              <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
            </select>
          </td>
        </tr>
        <!-- 简要描述 -->
        <tr>
          <td class="vertical-top">Breif</td>
          <td><textarea rows="3" type="text" v-model="item.brief"></textarea></td>
        </tr>
        <!-- 详细介绍 -->
        <tr>
          <td class="vertical-top">Detail</td>
          <td>
            <editor @input="editorChange" :value="item.detail"></editor>
          </td>
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
import editor from 'components/c-editor/editor'
import toast from 'components/toast/toast'
import editPic from 'components/c-edit-pic/edit-pic'
import util from 'components/tools/util'
import api from 'components/tools/api-en'

export default {
  data() {
    return {
      typeAdd: true,
      item: {
        name: '',
        display: 'Y',
        img: '',
        sort: 1,
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
      if (this.$route.path === '/admin/news/adden') {
        return
      }
      this.typeAdd = false
      let _this = this
      let id = this.$route.params.id
      this.axios(api.newsList.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此新闻不存在', 'close')
            this.goBack()
          }
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          _this.queryErrorGoBack()
        }
      })
    },
    getClassiy() {
      let _this = this
      this.axios(api.newsClassify.query()).then((res) => {
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
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        _this.item.img = result
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
      let _this = this
      this.sendPic(this.file, 'img', () => {
        _this.sendData()
      })
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = api.newsList.insert(this.item)
      } else {
        obj = api.newsList.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '新闻标题已存在', 'close')
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
      let _this = this
      setTimeout(() => {
        _this.$router.push('/admin/news/listen')
      }, 700)
    },
    uploadFile(file, callback) {
      let _this = this
      util.uploadFile(this, file, callback, () => {
        _this.showError()
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
