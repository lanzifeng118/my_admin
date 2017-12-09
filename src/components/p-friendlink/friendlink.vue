<template>
  <div class="friendlink">
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
          {text: '友情链接列表', href: '/admin/friendlink', icon: 'search_list'},
          {text: 'Friend Link List', href: '/admin/friendlink/en', icon: 'search_list'}
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
