<template>
  <div class="experience">
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
          {text: '项目列表', href: '/admin/experience/list', icon: 'search_list'},
          {text: '分类列表', href: '/admin/experience/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/experience/banner', icon: 'pic'},
          {text: 'Experience List', href: '/admin/experience/list/en', icon: 'search_list'},
          {text: 'Classify', href: '/admin/experience/classify/en', icon: 'classify'},
          {text: 'Banner', href: '/admin/experience/banner/en', icon: 'pic'}
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
