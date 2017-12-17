<template>
<div class="edit support-classify-edit">
  <h2 class="edit-h2" v-if="!typeAdd">Edit Topic</h2>
  <h2 class="edit-h2" v-if="typeAdd">Add Topic</h2>
  <router-link to="/admin/support/classifyen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <!-- name -->
        <tr>
          <td width="100"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model.trim="item.name"></td>
        </tr>
        <!-- sort -->
        <tr>
          <td>Order</td>
          <td><input type="text" v-model.trim="item.sort"></td>
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
        sort: 1
      },
      // toastA
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
      if (this.$route.path === '/admin/support/classifyadden') {
        return
      }
      this.typeAdd = false
      let _this = this
      let id = this.$route.params.id
      this.axios(api.supportClassify.queryById(id)).then((res) => {
        let data = res.data
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此话题不存在', 'close')
            this.goBack()
          }
          console.log(data)
        }
      })
    },
    submit() {
      // 验证
      console.log(this.typeAdd)
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendData()
    },
    sendData() {
      let _this = this
      let obj = null
      console.log(api.supportClassify)
      if (this.typeAdd) {
        obj = api.supportClassify.insert(_this.item)
      } else {
        obj = api.supportClassify.update(_this.item)
      }
      _this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '话题名称已存在', 'close')
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
        util.toast.fade(this.toast, '话题名称不能为空')
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
      let _this = this
      setTimeout(() => {
        _this.$router.push('/admin/support/classifyen')
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
