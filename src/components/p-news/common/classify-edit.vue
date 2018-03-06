<template>
<div class="edit news-classify-edit">
  <!-- cn -->
  <div v-if="lang === 'cn'">
    <h2 class="edit-h2" v-if="!typeAdd">编辑分类</h2>
    <h2 class="edit-h2" v-if="typeAdd">添加分类</h2>
    <router-link to="/admin/news/classify" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
  </div>
  <!-- en -->
  <div v-if="lang === 'en'">
    <h2 class="edit-h2" v-if="!typeAdd">Edit Classify</h2>
    <h2 class="edit-h2" v-if="typeAdd">Add Classify</h2>
    <router-link to="/admin/news/classifyen" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
  </div>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td v-if="lang === 'cn'" width="100"><span class="icon-nessisary"></span>分类名称</td>
          <td v-if="lang === 'en'" width="100"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- sort -->
        <tr>
          <td>{{lang === 'cn' ? '顺序' : 'Order'}}</td>
          
          <td><input type="text" v-model.trim="item.sort"></td>
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
        sort: '1'
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
    getItem() {
      let addLink = this.lang === 'cn' ? '/admin/news/classifyadd' : '/admin/news/classifyadden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.newsClassify.queryById(id)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此分类不存在', 'close')
            this.goBack()
          }
          console.log(data)
        }
      })
    },
    submit() {
      // 验证
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendData()
    },
    sendData() {
      let obj = null
      if (this.typeAdd) {
        obj = this.api.newsClassify.insert(this.item)
      } else {
        obj = this.api.newsClassify.update(this.item)
      }
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '分类名称已存在', 'close')
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
        util.toast.fade(this.toast, '分类名称不能为空')
        return false
      }
      if (this.item.sort && !/^\d+$/.test(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为数字')
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
        let link = this.lang === 'cn' ? '/admin/news/classify' : '/admin/news/classifyen'
        this.$router.push(link)
      }, 700)
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
