<template>
  <div class="header">
    <div class="header-wrap f-clearfix">
      <div class="header-info f-left">
        <img :src="logoSrc"  height="50" alt="">
        <span>xx管理后台</span>
      </div>
      <ul class="header-operate f-right">
        <li class="header-operate-item">
          <a href="#"><span class="icon icon-look"></span>浏览前台</a>
        </li>
        <li class="header-operate-item">
          <a href="#"><span class="icon icon-people"></span>个人中心</a>
        </li>
        <li class="header-operate-item">
          <a href="#"><span class="icon icon-exit"></span>退出登陆</a>
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
    }
  }
</script>

<style>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
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
