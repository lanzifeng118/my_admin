<template>
  <div class="friendlink">
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
          {text: '友情链接列表', href: '/admin/friendlink/list', icon: 'search_list'},
          {text: 'Friend Link List', href: '/admin/friendlink/listen', icon: 'search_list'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .friendlink {
  }
</style>
