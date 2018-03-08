<template>
  <div class="aboutus-edit">
    <!-- cn -->
    <div v-if="lang === 'cn'">
      <h2 class="edit-h2" v-if="!typeAdd">编辑关于我们</h2>
      <h2 class="edit-h2" v-if="typeAdd">添加关于我们</h2>
      <router-link to="/admin/aboutus" class="edit-close-btn" >
        <span class="icon-round_close_fill"></span>
      </router-link>
    </div>
    <!-- en -->
    <div v-if="lang === 'en'">
      <h2 class="edit-h2" v-if="!typeAdd">Edit About Us</h2>
      <h2 class="edit-h2" v-if="typeAdd">Add About Us</h2>
      <router-link to="/admin/aboutus/listen" class="edit-close-btn" >
        <span class="icon-round_close_fill"></span>
      </router-link>
    </div>
    <div class="edit-table-wrap">
      <table>
        <tbody>
          <tr>
            <td v-if="lang === 'cn'" width="90">标题</td>
            <td v-if="lang === 'en'" width="90">Title</td>
            <td><input type="text" v-model.trim="item.title"></td>
          </tr>
          <!-- 顺序 -->
          <tr>
            <td>{{lang === 'cn' ? '顺序' : 'Order'}}</td>
            
            <td><input type="text" v-model.trim="item.sort"></td>
          </tr>
          <!-- 显示 -->
          <tr>
            <td class="vertical-middle">{{lang === 'cn' ? '显示' : 'Display'}}
            <td class="show">
              <span
                :class="[item.display === 'Y' ? 'icon-square_check_fill' : 'icon-square']"
                @click="toggleDisplay"
              >
              </span>
            </td>
          </tr>
          <tr>
            <td v-if="lang === 'cn'" class="vertical-top">摘要</td>
            <td v-if="lang === 'en'" class="vertical-top">Breif</td>
            <td><textarea name="name" rows="3" cols="100" v-model.trim="item.brief"></textarea></td>
          </tr>
          <tr>
            <td v-if="lang === 'cn'">内容</td>
            <td v-if="lang === 'en'">Detail</td>
            <td>
              <editor @input="editorChange" :value="item.detail"></editor>
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
  </div>
</template>

<script>
import editor from 'components/c-editor/editor'
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
        title: '',
        sort: '1',
        display: 'Y',
        brief: '',
        detail: ''
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
      let addLink = this.lang === 'cn' ? '/admin/aboutus/add' : '/admin/aboutus/adden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.aboutus.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此文章不存在', 'close')
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
      this.sendData()
    },
    sendData() {
      let obj = null
      if (this.typeAdd) {
        obj = this.api.aboutus.insert(this.item)
      } else {
        obj = this.api.aboutus.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '标题已存在', 'close')
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
      setTimeout(() => {
        let link = this.lang === 'cn' ? '/admin/aboutus/list' : '/admin/aboutus/listen'
        this.$router.push(link)
      }, 700)
    },
    queryErrorGoBack() {
      util.req.queryError(this.toast)
      this.goBack()
    }
  },
  components: {
    editor,
    toast
  }
}
</script>

<style>
.aboutus-edit {
  position: relative;
}
.aboutus-edit .quill-editor {
  width: 993px;
}
</style>
