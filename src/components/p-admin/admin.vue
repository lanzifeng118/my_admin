<template>
<div class="admin">
    <v-header></v-header>
    <div class="content">
      <div class="content-left">
        <v-nav :items="navItems"></v-nav>
      </div>
      <div class="content-right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import vHeader from 'components/c-header/header'
import vNav from 'components/c-nav/nav'

let navItems = [{
  src: '/admin/home',
  name: '首页',
  style: 'home'
}, {
  src: '/admin/product',
  name: '产品管理',
  style: 'cart'
}, {
  src: '/admin/experience',
  name: '项目经验',
  style: 'experience'
}, {
  src: '/admin/aboutus',
  name: '关于我们',
  style: 'evaluate'
}, {
  src: '/admin/news',
  name: '新闻管理',
  style: 'notification'
}, {
  src: '/admin/feedback',
  name: '客户反馈',
  style: 'feedback'
}, {
  src: '/admin/link',
  name: '友情链接',
  style: 'share'
}, {
  src: '/admin/config',
  name: '系统设置',
  style: 'config'
}]

export default {
  data() {
    return {
      navItems
    }
  },
  created() {
    this.$store.state.user.name = '管理员'
    this.$store.state.user.avatar = 'static/images/avatar.png'
    this.$store.state.user.lastlogintime = new Date().toLocaleString()
    // let _this = this
    // _this.axios.post('/api/admin/user', {
    //   method: 'get'
    // }).then((response) => {
    //   let data = response.data
    //   if (data.code === '200') {
    //     _this.$store.state.user.name = data.data.name
    //     _this.$store.state.user.avatar = data.data.avatar
    //     _this.$store.state.user.lastlogintime = data.data.lastlogintime
    //   }
    // })
  },
  components: {
    vHeader,
    vNav
  }
}
</script>

<style>

.content {
  width: 1400px;
  margin: 0 auto;
}
.content-left {
  position: fixed;
  top: 65px;
  z-index: 1;
  width: 150px;
  border-radius: 3px;
  overflow: hidden;
  background-color: #363f46;
}
.content-right {
  padding-top: 130px;
  margin-left: 164px;
  width: 1236px;
}
</style>
