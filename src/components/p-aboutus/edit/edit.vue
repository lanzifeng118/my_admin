
<template>
  <div class="info-edit">
    <h2 class="edit-h2" v-if="!typeAdd">编辑关于我们</h2>
    <h2 class="edit-h2" v-if="typeAdd">添加关于我们</h2>
    <router-link to="/admin/aboutus" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
    <div class="edit-table-wrap">
      <table>
        <tbody>
          <tr>
            <td width="90">标题</td>
            <td><input type="text" v-model="item.title"></td>
          </tr>
          <!-- 顺序 -->
          <tr>
            <td>顺序</td>
            <td><input type="text" v-model="item.sort"></td>
          </tr>
          <!-- 显示 -->
          <tr>
            <td>显示</td>
            <td class="show">
              <span
                :class="[item.display === 'Y' ? 'icon-square_check_fill' : 'icon-square']"
                @click="toggleDisplay"
              >
              </span>
            </td>
          </tr>
          <tr>
            <td class="vertical-top">摘要</td>
            <td><textarea name="name" rows="3" cols="100" v-model="item.brief"></textarea></td>
          </tr>
          <tr>
            <td>内容</td>
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
            <td><button class="button" @click="submit">提交</button></td>
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
import util from 'components/tools/util'
import api from 'components/tools/api'

export default {
  data() {
    return {
      typeAdd: true,
      // item
      item: {
        title: '',
        sort: '',
        display: 'Y',
        brief: '',
        detail: ''
      },
      // editor
      editorOption: { // 编辑器的配置
        placeholder: '输入内容...',
        modules: {
          toolbar: this.$store.state.quillEditor.nomal
        }
      },
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
      if (this.$route.path === '/admin/aboutus/add') {
        return
      }
      this.typeAdd = false
      let _this = this
      let id = this.$route.params.id
      this.axios(api.aboutus.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此文章不存在', 'close')
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
    submit() {
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendData()
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = api.aboutus.insert(this.item)
      } else {
        obj = api.aboutus.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '产品名称已存在', 'close')
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
      if (!this.item.title) {
        util.toast.fade(this.toast, '标题不能为空')
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
        _this.$router.push('/admin/aboutus')
      }, 700)
    },
    queryErrorGoBack() {
      util.req.queryError(this.toast)
      this.goBack()
    }
  },
  components: {
    quillEditor,
    toast
  }
}
</script>

<style>
  .info-edit {
    position: relative;
  }
</style>
