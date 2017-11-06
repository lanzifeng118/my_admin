<template>
  <div class="search">
    <input class="search-input" v-model="searchText" name="" placeholder="输入查找内容">
    <span class="search-icon icon-search" @click="search"></span>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        text: ''
      }
    },
    props: ['searchText'],
    methods: {
      search() {
        console.log(this.searchText)
      }
    }
  }
</script>

<style>
.search input {
  width: 180px;
  padding-right: 30px;
}
.search-icon {
  cursor: pointer;
  display: inline-block;
  color: #ccc;
  width: 30px;
  line-height: 30px;
  margin-left: -30px;
}
.search-icon:hover {
  color: #00d0bc;
}
</style>
