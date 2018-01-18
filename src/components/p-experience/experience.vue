<template>
  <div class="experience">
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
          {text: 'Logo列表', href: '/admin/experience/list', icon: 'search_list'},
          {text: '品牌列表', href: '/admin/experience/brand', icon: 'evaluate'},
          {text: '分类列表', href: '/admin/experience/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/experience/banner', icon: 'pic'},
          {text: 'Logo List', href: '/admin/experience/listen', icon: 'search_list'},
          {text: 'Brand List', href: '/admin/experience/branden', icon: 'evaluate'},
          {text: 'Classify', href: '/admin/experience/classifyen', icon: 'classify'},
          {text: 'Banner', href: '/admin/experience/banneren', icon: 'pic'}
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
