<template>
  <div class="info">
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
          {text: '关于我们列表', href: '/admin/aboutus', icon: 'search_list'},
          {text: '广告图', href: '/admin/aboutus/banner', icon: 'pic'},
          {text: 'About Us List', href: '/admin/aboutus/en', icon: 'search_list'},
          {text: 'Banner', href: '/admin/aboutus/banner/en', icon: 'pic'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .info {
  }
</style>
