<template>
  <div class="support">
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
          {text: '服务支持列表', href: '/admin/support', icon: 'search_list'},
          {text: 'Service & Support List', href: '/admin/support/en', icon: 'search_list'}
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
