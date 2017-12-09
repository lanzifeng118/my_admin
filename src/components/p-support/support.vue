<template>
  <div class="support">
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
          {text: '服务支持列表', href: '/admin/support/list', icon: 'search_list'},
          {text: '广告图', href: '/admin/support/banner', icon: 'pic'},
          {text: 'Service & Support List', href: '/admin/support/listen', icon: 'search_list'},
          {text: 'Banner', href: '/admin/support/banneren', icon: 'pic'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .support {
  }
</style>
