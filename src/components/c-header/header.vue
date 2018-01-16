<template>
  <div class="header">
    <div class="header-wrap f-clearfix">
      <div class="header-info f-left">
        <img :src="logoSrc" class="header-logo" alt="">
        <span>Aressci 管理后台</span>
      </div>
      <ul class="header-operate f-right">
        <li class="header-operate-item">
          <a href="/en" target="_blank"><span class="icon icon-english"></span>英文前台</a>
        </li>
        <li class="header-operate-item">
          <a href="/" target="_blank"><span class="icon icon-chinese"></span>中文前台</a>
        </li>
        <li class="header-operate-item">
          <a href="javascrip: void 0" @click="logout"><span class="icon icon-exit"></span>退出登陆</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import logoSrc from 'src/common/images/logo.png'
  export default {
    data() {
      return {
        logoSrc
      }
    },
    methods: {
      logout() {
        this.axios({
          method: 'post',
          url: '/api/admin/logout'
        }).then((res) => {
          let data = res.data
          if (data.code === '200') {
            let redirect = this.$route.path
            this.$router.push({path: '/login', query: { redirect: redirect }})
          }
        })
      }
    }
  }
</script>

<style>
  .header {
    height: 50px;
    margin-bottom: 15px;
    background-color: #363f46;
    color: #fff;
  }
  .header-wrap {
    width: 1400px;
    padding: 0 75px;
    margin: 0 auto;
  }
  .header-info {
    font-size: 0
  }
  .header-logo {
    height: 30px;
    margin-top: 10px;
  }
  .header-info span {
    line-height: 50px;
    margin-left: 15px;
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
  }
  .header-operate-item {
    display: inline-block;
    margin-right: 20px;
    line-height: 50px;
  }
  .header-operate-item a {
    display: inline-block;
    transition: all 0.2s;
    color: #fff;
  }
  .header-operate-item a:hover {
    color: #07efd9;
  }
</style>
