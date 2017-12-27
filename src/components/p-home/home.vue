<template>
  <div class="home">
    <tab :items="tabData"></tab>
    <div class="content-detail" :style="{height: contentDetailMinHeigth + 'px'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import tab from 'components/c-tab/tab'
import { contentDetailMinHeigth } from 'components/tools/global'

export default {
  data() {
    return {
      contentDetailMinHeigth,
      tabData: [
        {text: '基础信息', href: '/admin/home', icon: 'search_list'},
        {text: '广告图', href: '/admin/home/banner', icon: 'pic'},
        {text: 'Basic Information', href: '/admin/home/en', icon: 'search_list'},
        {text: 'Banner', href: '/admin/home/banneren', icon: 'pic'}
      ]
    }
  },
  components: {
    tab
  }
}
</script>
