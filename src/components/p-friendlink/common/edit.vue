
<template>
  <div class="friend-link-edit">
    <!-- cn -->
    <div v-if="lang === 'cn'">
      <h2 class="edit-h2" v-if="!typeAdd">编辑友情链接</h2>
      <h2 class="edit-h2" v-if="typeAdd">添加友情链接</h2>
      <router-link to="/admin/friendlink" class="edit-close-btn" >
        <span class="icon-round_close_fill"></span>
      </router-link>
    </div>
    <div v-if="lang === 'en'">
      <h2 class="edit-h2" v-if="!typeAdd">Edit Friend Link</h2>
      <h2 class="edit-h2" v-if="typeAdd">Add Friend Link</h2>
      <router-link to="/admin/friendlink/listen" class="edit-close-btn" >
        <span class="icon-round_close_fill"></span>
      </router-link>
    </div>
    <div class="edit-table-wrap">
      <table>
        <tbody>
          <tr>
            <td v-if="lang === 'cn'" width="90"><span class="icon-nessisary"></span>名称</td>
            <td v-if="lang === 'en'" width="90"><span class="icon-nessisary"></span>Name</td>
            <td><input type="text" v-model.trim="item.name"></td>
          </tr>
          <!-- 顺序 -->
          <tr>
            <td v-if="lang === 'cn'">顺序</td>
            <td v-if="lang === 'en'">Order</td>
            <td><input type="text" v-model.trim="item.sort"></td>
          </tr>
          <!-- 链接 -->
          <tr>
            <td v-if="lang === 'cn'" class="vertical-top"><span class="icon-nessisary"></span>链接</td>
            <td v-if="lang === 'en'" class="vertical-top"><span class="icon-nessisary"></span>Link</td>
            <td><textarea type="text" v-model.trim="item.link"></textarea></td>
          </tr>
          <tr>
            <td></td>
            <td v-if="lang === 'cn'"><button class="button" @click="submit">提交</button></td>
            <td v-if="lang === 'en'"><button class="button" @click="submit">Submit</button></td>
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
      // item
      item: {
        name: '',
        sort: '1',
        link: ''
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
      let addLink = this.lang === 'cn' ? '/admin/friendlink/add' : '/admin/friendlink/adden'
      if (this.$route.path === addLink) {
        return
      }
      this.typeAdd = false
      let id = this.$route.params.id
      this.axios(this.api.friendlink.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            this.item = data.data
          } else {
            util.toast.show(this.toast, '此友情链接不存在', 'close')
            this.goBack()
          }
        }
      }).catch((err) => {
        if (err) {
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
        obj = this.api.friendlink.insert(this.item)
      } else {
        obj = this.api.friendlink.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '名称已存在', 'close')
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
        util.toast.fade(this.toast, '名称不能为空')
        return false
      }
      if (this.item.sort && !util.isNum(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为数字')
        return false
      }
      if (!this.item.link) {
        util.toast.fade(this.toast, '链接不能为空')
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
        let link = this.lang === 'cn' ? '/admin/friendlink/list' : '/admin/friendlink/listen'
        this.$router.push(link)
      }, 700)
    },
    queryErrorGoBack() {
      util.req.queryError(this.toast)
      this.goBack()
    }
  },
  components: {
    toast
  }
}
</script>

<style>
  .friend-link-edit {
    position: relative;
  }
</style>
