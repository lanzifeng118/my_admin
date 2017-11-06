<template>
  <div class="info">
    <tab :items="tabData"></tab>
    <div class="content-detail" :style="{minHeight: contentDetailMinHeigth + 'px'}">
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
          {text: 'About Us List', href: '/admin/aboutus/en', icon: 'search_list'}
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
