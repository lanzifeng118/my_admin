<template>
<div class="basic-info">
  <h2 class="basic-info-welcome">你好，{{user.username}}！</h2>
  <router-link to="/admin/home/edit" class="basic-info-btn button" >
    <span class="icon icon-edit"></span>编辑
  </router-link>
  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100">公司名称<span class="separate"></span></td>
          <td>{{item.name}}</td>
        </tr>
        <tr>
          <td width="100">全称<span class="separate"></span></td>
          <td>{{item.full_name}}</td>
        </tr>
        <tr>
          <td class="vertical-middle">LOGO<span class="separate"></span></td>
          <td><img class="basic-info-img" :src="item.logo" alt=""></td>
        </tr>
        <tr>
          <td>地址<span class="separate"></span></td>
          <td>{{item.address}}</td>
        </tr>
        <tr>
          <td>邮箱<span class="separate"></span></td>
          <td>{{item.email}}</td>
        </tr>
        <tr>
          <td>电话<span class="separate"></span></td>
          <td>{{item.telephone}}</td>
        </tr>
        <tr>
          <td>联系人<span class="separate"></span></td>
          <td>{{item.linkman}}</td>
        </tr>
        <tr>
          <td>工作时间<span class="separate"></span></td>
          <td>{{item.worktime}}</td>
        </tr>
        <tr>
          <td>简介<span class="separate"></span></td>
          <td v-html="item.brief" class="basic-info-breif"></td>
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
import api from 'components/tools/api'
import util from 'components/tools/util'

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
  computed: {
    user() {
      return {
        username: this.$store.state.user.username
      }
    }
  },
  created() {
    console.log('aaa')
    this.getItem()
  },
  watch: {
    '$route' (to, from) {
      this.getItem()
    }
  },
  methods: {
    getItem() {
      this.axios(api.basicInfo.query()).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          this.item = data.data
        } else {
          util.req.queryError(this.toast)
        }
      }).catch((error) => {
        if (error) {
          util.req.queryError(this.toast)
        }
      })
    }
  },
  components: {
    toast
  }
}
</script>

<style>
@import "../common/basicInfo.css";
</style>
