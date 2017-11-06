<template>
  <div class="tab">
    <ul class="tab-ul">
      <li v-for="item in items" class="tab-item">
        <router-link :to="item.href"><span class="icon" :class="'icon-'+item.icon"></span>{{item.text}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['items']
  }

</script>

<style>
  .tab {
    position: fixed;
    top: 50px;
    z-index: 99;
    width: 1236px;
    padding: 15px 0;
    background-color: #f0f6f6;
  }
  .tab-ul {
    border-radius: 3px;
    padding-left: 30px;
    background-color: #fff;
  }
  .tab-item {
    display: inline-block;
    margin-right: 30px;
  }
  .tab-item a {
    display: block;
    line-height: 50px;
    border-bottom: 1px solid #fff;
    margin-bottom: -1px;
    transition: all 0.2s;
  }
  .tab-item a.router-link-exact-active {
    color: #00d0bc;
    border-bottom: 1px solid #00d0bc;
  }
  .tab-item a:hover {
    color: #00d0bc;
  }
</style>
