<template>
  <div class="news">
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
          {text: '新闻列表', href: '/admin/news/list', icon: 'search_list'},
          {text: '分类列表', href: '/admin/news/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/news/banner', icon: 'pic'},
          {text: 'Product List', href: '/admin/news/list/en', icon: 'search_list'},
          {text: 'Classify', href: '/admin/news/classify/en', icon: 'classify'},
          {text: 'Banner', href: '/admin/news/banner/en', icon: 'pic'}
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
