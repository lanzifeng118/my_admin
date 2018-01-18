<template>
  <div class="support">
    <tab :items="tabData"></tab>
    <div class="content-detail" :style="{height: detailHeigth + 'px'}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import tab from 'components/c-tab/tab'
  import { detailHeigth } from 'components/tools/global'

  export default {
    data() {
      return {
        detailHeigth,
        tabData: [
          {text: '服务支持列表', href: '/admin/support/list', icon: 'search_list'},
          {text: '话题列表', href: '/admin/support/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/support/banner', icon: 'pic'},
          {text: 'Topic', href: '/admin/support/classifyen', icon: 'classify'},
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
