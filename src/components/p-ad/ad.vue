<template>
  <div class="ad">
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
        {text: '广告管理', href: '/admin/ad/list', icon: 'search_list'},
        {text: '视频管理', href: '/admin/ad', icon: 'search_list'},
        {text: 'Video Management', href: '/admin/ad/en', icon: 'search_list'}
      ]
    }
  },
  components: {
    tab
  }
}
</script>

<style>
.ad {
}
</style>
