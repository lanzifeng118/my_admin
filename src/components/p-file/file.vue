<template>
  <div class="file">
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
          {text: '文件列表', href: '/admin/file', icon: 'search_list'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .file {
  }
</style>
