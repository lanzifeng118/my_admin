
<template>
  <div class="support-detail">
    <h2 class="edit-h2">查看详情</h2>
    <router-link to="/admin/support/listen" class="edit-close-btn" >
      <span class="icon-round_close_fill"></span>
    </router-link>
    <div class="display-table-wrap">
      <table>
        <tbody>
          <!-- reply -->
          <tr>
            <td><b>Reply</b><span class="separate"></span></td>
            <td
            class="pointer"
            @click="toggleReply(index)"
            >
            <span :class="[item.reply === 'Y' ? 'icon-square_check' : 'icon-square']"></span>
          </td>
        </tr>
          <!-- topic -->
          <tr>
            <td>Topic<span class="separate"></span></td>
            <td>{{item.topic}}</td>
          </tr>
          <!-- message -->
          <tr>
            <td>Message<span class="separate"></span></td>
            <td class="message">{{item.message}}</td>
          </tr>
          <!-- salutation -->
          <tr>
            <td>Salutation<span class="separate"></span></td>
            <td class="message">{{item.salutation}}</td>
          </tr>
          <!-- name -->
          <tr>
            <td width="70">Name<span class="separate"></span></td>
            <td>{{item.firstName}} {{item.lastName}}</td>
          </tr>
          <!-- email -->
          <tr>
            <td>Email<span class="separate"></span></td>
            <td>{{item.email}}</td>
          </tr>
          <!-- Email -->
          <tr>
            <td>Tel<span class="separate"></span></td>
            <td>{{item.tel}}</td>
          </tr>
          <!-- country -->
          <tr>
            <td>Country<span class="separate"></span></td>
            <td>{{item.country}}</td>
          </tr>
          <!-- address -->
          <tr>
            <td>Address<span class="separate"></span></td>
            <td>{{item.address}}</td>
          </tr>
          <!-- time -->
          <tr>
            <td>Time<span class="separate"></span></td>
            <td>{{item.createtime}}</td>
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
import api from 'components/tools/api-en'

export default {
  data() {
    return {
      // item
      item: {
        name: '',
        sort: '',
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
      let _this = this
      let id = this.$route.params.id
      this.axios(api.support.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此服务支持不存在', 'close')
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
    toggleReply(index) {
      if (this.item.reply === 'Y') {
        this.item.reply = 'N'
      } else {
        this.item.reply = 'Y'
      }
      // ajax
      let _this = this
      this.axios(api.support.update({id: this.item.id, reply: this.item.reply})).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          util.req.changeError(_this.toast)
        }
      }).catch((err) => {
        if (err) {
          util.req.changeError(_this.toast)
        }
      })
    },
    sendData() {
      let _this = this
      let obj = api.support.update(this.item)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          util.req.changeError(_this.toast)
        }
      }).catch((err) => {
        if (err) {
          util.req.changeError(_this.toast)
        }
      })
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
        _this.$router.push('/admin/support/listen')
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
  .support-detail {
    position: relative;
  }
  .support-detail .icon-square {
    color: #999;
  }
  .support-detail td.message {
    line-height: 1.5em;
  }
</style>
