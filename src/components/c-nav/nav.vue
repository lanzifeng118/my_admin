<template>
<div class="nav" :style="{height: navMinHeight + 'px'}">
  <div class="nav-avatar">
    <img :src="avatar" height="150" width="150" />
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
  props: ['items'],
  data() {
    return {
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
  background-color: #363f46;
}
.nav .icon {
  margin-right: 10px;
}
.nav-avatar {
  font-size: 0;
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
