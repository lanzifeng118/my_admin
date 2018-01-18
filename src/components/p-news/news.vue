<template>
  <div class="news">
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
          {text: '新闻列表', href: '/admin/news/list', icon: 'search_list'},
          {text: '分类列表', href: '/admin/news/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/news/banner', icon: 'pic'},
          {text: 'News List', href: '/admin/news/listen', icon: 'search_list'},
          {text: 'Classify', href: '/admin/news/classifyen', icon: 'classify'},
          {text: 'Banner', href: '/admin/news/banneren', icon: 'pic'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .news {
  }
</style>
