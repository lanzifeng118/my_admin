<template>
  <div class="support">
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
          {text: '系统信息', href: '/admin/config', icon: 'search_list'},
          {text: '修改密码', href: '/admin/config/password', icon: 'lock'}
        ]
      }
    },
    components: {
      tab
    }
  }
</script>

<style>
  .support {
  }
</style>
