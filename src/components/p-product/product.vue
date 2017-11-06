<template>
  <div class="product">
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
          {text: '产品列表', href: '/admin/product/list', icon: 'search_list'},
          {text: '分类列表', href: '/admin/product/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/product/banner', icon: 'pic'},
          {text: '视频', href: '/admin/product/video', icon: 'video'},
          {text: 'Product List', href: '/admin/product/list/en', icon: 'search_list'},
          {text: 'Classify', href: '/admin/product/classify/en', icon: 'classify'},
          {text: 'Banner', href: '/admin/product/banner/en', icon: 'pic'},
          {text: 'Video', href: '/admin/product/video/en', icon: 'video'}

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
