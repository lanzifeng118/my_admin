<template>
  <div class="product">
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
          {text: '产品列表', href: '/admin/product/list', icon: 'search_list'},
          {text: '品牌列表', href: '/admin/product/classify', icon: 'classify'},
          {text: '广告图', href: '/admin/product/banner', icon: 'pic'},
          {text: '视频', href: '/admin/product/video', icon: 'video'},
          {text: 'Product List', href: '/admin/product/listen', icon: 'search_list'},
          {text: 'Brand', href: '/admin/product/classifyen', icon: 'classify'},
          {text: 'Banner', href: '/admin/product/banneren', icon: 'pic'},
          {text: 'Video', href: '/admin/product/videoen', icon: 'video'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .product .editor .quill-editor {
    color: #7d6666;
  }

</style>
