<template>
<div class="nav" :style="{height: navMinHeight + 'px'}">
  <div class="nav-avatar">
    <img :src="avatar"/>
  </div>
  <ul class="nav-ul">
    <li
      v-for="item in items"
      class="nav-item"
    >
      <router-link :to="item.src">
        <span
          class="icon"
          :class="'icon-' + item.style"
        >
        </span>{{item.name}}
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
import { navMinHeight } from 'components/tools/global'

export default {
  data() {
    return {
      items: [{
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
        src: '/admin/support',
        name: '服务支持',
        style: 'feedback'
      }, {
        src: '/admin/friendlink',
        name: '友情链接',
        style: 'share'
      }, {
        src: '/admin/file',
        name: '文件管理',
        style: 'folder'
      }, {
        src: '/admin/config',
        name: '系统设置',
        style: 'config'
      }],
      isActive: false,
      navMinHeight
    }
  },
  computed: {
    avatar() {
      return this.$store.state.user.avatar
    }
  }
}
</script>

<style>
.nav {
  width: 150px;
  float: left;
  min-height:  600px;
  border-radius: 3px;
  overflow: hidden;
  background-color: #363f46;
}
.nav .icon {
  margin-right: 10px;
}
.nav-avatar {
  font-size: 0;
  width: 150px;
  height: 150px;
  overflow: hidden;
}
.nav-avatar img {
  max-width: 150px;
  max-height: 150px;
}
.nav-item {
  height: 45px;
  line-height: 45px;
  border-bottom: 1px solid #4a4a4a;
}

.nav-item a {
  display: block;
  color: #fff;
  padding-left: 20px;
  transition: all 0.2s;
}
.nav-item a:hover {
  color: #07efd9;
}
.nav-item a.active {
  background: #07efd9;
  color: #363f46;
}
</style>
