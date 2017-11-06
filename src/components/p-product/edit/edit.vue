<template>
<div class="product-edit edit">
  <h2 class="edit-h2" v-if="!typeAdd">编辑产品</h2>
  <h2 class="edit-h2" v-if="typeAdd">添加产品</h2>
  <router-link to="/admin/product/list" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- 产品名称 -->
        <tr>
          <td width="90"><span class="icon-nessisary"></span>产品名称</td>
          <td><input type="text" v-model="item.name"></td>
        </tr>
        <!-- logo -->
        <tr>
          <td class="vertical-top">预览图<span class="separate"></span></td>
          <td>
            <edit-pic
              logo="true"
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
          <td width="90" class="vertical-middle">显示</td>
          <td class="show">
            <span :class="[item.display ? 'icon-square_check_fill' : 'icon-square']"></span>
          </td>
        </tr>
        <!-- 顺序 -->
        <tr>
          <td>顺序</td>
          <td><input type="text" v-model="item.sort"></td>
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
        <!-- PDF -->
        <tr>
          <td>资源</td>
          <td class="pdf">
            <label for="inputResources" class="button button-second">
              <span class=" icon icon-round_add"></span>添加文件
            </label>
            <input type="file" id="inputResources" accept="application/pdf" @change="chooseResources">
            <ul>
              <li class="pdf-box" v-for="(pdf, indexPdf) in item.pdf">
                <span class="icon icon-pdf"></span>
                {{pdf.name}}
                <span class="icon-round_close_fill" @click="deleteResources(indexPdf)"></span>
              </li>
            </ul>
          </td>
        </tr>
        <!-- 简要描述 -->
        <tr>
          <td class="vertical-top">简要描述</td>
          <td><textarea rows="3" type="text" v-model="item.brief"></textarea></td>
        </tr>
        <!-- 详细介绍 -->
        <tr>
          <td class="vertical-top">详细介绍</td>
          <td>
            <quill-editor
              v-model="item.detail"
              :options="editorOption"
              >
            </quill-editor>
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
import { quillEditor } from 'vue-quill-editor'
import toast from 'components/toast/toast'
import editPic from 'components/c-edit-pic/edit-pic'
import util from 'components/tools/util'
import api from 'components/tools/api'

export default {
  data() {
    return {
      typeAdd: true,
      item: {
        name: '',
        display: true,
        img: '',
        sort: '',
        pdf: [],
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
    this.getClassiy()
  },
  methods: {
    getItem() {
      if (this.$route.path === '/admin/product/add') {
        return
      }
      this.typeAdd = false
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
      this.file = e.target.files[0]
      util.myFileReader(this.file, (result) => {
        _this.item.img = result
      })
    },
    deleteImg() {
      this.item.img = ''
      this.file = null
    },
    chooseResources(e) {
      let file = e.target.files[0]
      let nameArr = file.name.split('.')
      let _this = this
      util.uploadFile(this, file, (url) => {
        _this.item.pdf.push({
          name: nameArr[0],
          type: nameArr[1],
          size: file.size,
          url: url
        })
        console.log(_this.item.pdf)
      }, () => {
        util.req.changeError(_this.toast)
      })
    },
    deleteResources(index) {
      this.item.pdf.splice(index, 1)
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
        obj = {}
      } else {
        obj = {
          method: 'post',
          url: '/api/admin/basicinfo',
          data: {
            method: 'modify',
            language: 'cn',
            data: _this.item
          }
        }
      }
      console.log(obj)
      console.log(this.item)
      // _this.axios(obj).then((response) => {
      //   let data = response.data
      //   if (data.code === '200') {
      //     _this.showSuccess()
      //   } else {
      //     _this.showError()
      //   }
      // }).catch(() => {
      //   _this.showError()
      // })
    },
    verify() {
      if (!this.item.name) {
        util.toast.fade(this.toast, '产品名称不能为空')
        return false
      }
      if (this.item.sort && !/^\d+$/.test(this.item.sort)) {
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
      let _this = this
      setTimeout(() => {
        _this.$router.push('/admin/product/list')
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
    quillEditor,
    toast,
    editPic
  }
}
</script>

<style>
.product-edit .edit-img {

}
.product-edit .edit-img img {

}
</style>
