<template>
  <div class="paging">
    <ul class="paging-ul noselect" v-if="paging.list.length > 0">
      <li
        :class="{grey: paging.no === 0}"
        @click="pagingPreClick"
      >
        <span class="icon-back"></span>
      </li>
      <li
        v-for="(item, index) in paging.list"
        :class="{active: index === paging.no}"
        @click="pagingChange(index)"
      >
        {{index + 1}}
      </li>
      <li
        :class="{grey: paging.no ===  paging.list.length - 1}"
        @click="pagingNextClick"
      >
        <span class="icon-right"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['paging'],
  data() {
    return {
    }
  },
  methods: {
    pagingPreClick() {
      if (this.paging.no === 0) {
        return
      }
      this.$emit('pagingPreClick')
    },
    pagingNextClick() {
      if (this.paging.no === this.paging.list.length - 1) {
        return
      }
      this.$emit('pagingNextClick')
    },
    pagingChange(index) {
      if (this.paging.no === index) {
        return
      }
      this.$emit('pagingChange', index)
    }
  }

}
</script>

<style>
/*paging*/
.paging {
  margin: 35px 0;
}
.paging-ul {
  text-align: center;
}
.paging-ul li {
  display: inline-block;
  border: 1px solid #efefef;
  width: 28px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
  margin: 0 2px;
  color: #666;
  transition: all 0.2s;
}
.paging-ul li:hover {
  color: #00d0bc;
}
.paging-ul li.grey {
  color: #ccc;
  cursor: default;
}
.paging-ul li.active {
  cursor: default;
  background-color: #00d0bc;
  border-color: #00d0bc;
  color: #fff;
}
</style>
