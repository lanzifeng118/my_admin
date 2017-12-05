<template>
<div class="config-list">
  <div class="f-clearfix">
    <router-link to="/admin/config/edit" class="f-right button">
      <span class="icon icon-edit"></span>编辑
    </router-link>
  </div>
  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90">账号<span class="separate"></span></td>
          <td>{{item.account}}</td>
        </tr>
        <tr>
          <td>名称<span class="separate"></span></td>
          <td>{{item.name}}</td>
        </tr>
        <tr>
          <td>邮箱<span class="separate"></span></td>
          <td>{{item.email}}</td>
        </tr>
        <tr>
          <td class="vertical-top">头像<span class="separate"></span></td>
          <td class="avatar"><img v-if="item.avatar" :src="item.avatar"></td>
        </tr>
      </tbody>
    </table>
    <toast
      v-show="toast.show"
      :text="toast.text"
      :icon="toast.icon"
    >
    </toast>
  </div>

</div>
</template>

<script>
import toast from 'components/toast/toast'
// import api from 'components/tools/api'
// import util from 'components/tools/util'

export default {
  data() {
    return {
      item: {},
      toast: {
        show: false,
        text: '',
        icon: ''
      }
    }
  },
  created() {
    this.item = {
      account: 'lanzixxx',
      name: '管理员',
      email: 'xxx@163.com',
      avatar: 'static/images/avatar.png'
    }
    // let _this = this
    // _this.axios(api.basicInfo.query()).then((res) => {
    //   let data = res.data
    //   if (data.code === '200') {
    //     _this.basicInfo = data.data
    //   } else {
    //     util.req.queryError(this.toast)
    //   }
    // }).catch((error) => {
    //   if (error) {
    //     console.log(error)
    //     util.req.queryError(this.toast)
    //   }
    // })
  },
  methods: {
  },
  components: {
    toast
  }
}
</script>

<style>
.config-list .display-table-wrap {
  margin-top: 25px;
}
.config-list td.avatar img {
  max-height: 120px;
  max-width: 120px;
}
</style>
