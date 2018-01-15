<template>
<div class="edit experience-brand-edit">
  <!-- cn -->
  <div v-if="lang === 'cn'">
    <h2 class="edit-h2" v-if="!typeAdd">编辑品牌</h2>
    <h2 class="edit-h2" v-if="typeAdd">添加品牌</h2>
    <router-link to="/admin/experience/brand" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
  </div>
  <div v-if="lang === 'en'">
    <h2 class="edit-h2" v-if="!typeAdd">Edit Brand</h2>
    <h2 class="edit-h2" v-if="typeAdd">Add Brand</h2>
    <router-link to="/admin/experience/branden" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
  </div>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td v-if="lang === 'cn'" width="100"><span class="icon-nessisary"></span>品牌名称</td>
          <td v-if="lang === 'en'" width="100"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <tr>
          <td v-if="lang === 'cn'">顺序</td>
          <td v-if="lang === 'en'">Order</td>
          <td><input type="text" v-model.trim="item.sort"></td>
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
      item: {
        name: '',
        sort: '1'
      },
      // toastA
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
      let addLink = this.lang === 'cn' ? '/admin/experience/brandadd' : '/admin/experience/brandadden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.experienceBrand.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此品牌不存在', 'close')
            this.goBack()
          }
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
        obj = this.api.experienceBrand.insert(this.item)
      } else {
        obj = this.api.experienceBrand.update(this.item)
      }
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '品牌名称已存在', 'close')
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
        util.toast.fade(this.toast, '品牌名称不能为空')
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
        let link = this.lang === 'cn' ? '/admin/experience/brand' : '/admin/experience/branden'
        this.$router.push(link)
      }, 700)
    }
  },
  components: {
    toast
  }
}
</script>

<style>
</style>
