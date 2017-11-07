<template>
<div class="product-video">
  <div class="f-clearfix">
    <button class="f-right button" @click="deleteAll">
      <span class="icon icon-delete"></span>一键删除
    </button>
    <router-link to="/admin/product/videoadd" class="f-right button list-btn-add">
      <span class="icon icon-round_add"></span>添加视频
    </router-link >
    <!-- <label for="inputVideo" class="button f-right list-btn-add">
      <span class="icon icon-round_add"></span>添加视频
    </label>
    <input type="file" id="inputVideo" accept="video/mp4"
      @change="chooseVideo"> -->
  </div>
  <div class="list-table-wrap">
    <div v-if="items.length <= 0" class="list-table-wrap-none">
      还没有相关信息，请添加
    </div>
    <table v-if="items.length > 0">
      <thead>
        <tr>
          <th width="100" @click="toggleSelectAll">
            <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
          </th>
          <th>名称</th>
          <th width="280">预览图</th>
          <th width="190">分类</th>
          <th width="200">修改时间</th>
          <th width="200">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items">
          <td
            class="pointer"
            @click="toggleSelect(index)"
            :class="{show: item.select}"
          >
            <span :class="[item.select ? 'icon-square_check_fill' : 'icon-square']"></span>
          </td>
          <!-- name -->
          <td>{{item.name}}</td>
          <!-- img -->
          <td class="product-video-img">
            <img :src="item.img" alt="">
          </td>
          <!-- classify -->
          <td class="classify">
            <p><span>{{item.classify}}</span></p>
          </td>
          <td>{{item.createTime}}</td>
          <td class="link">
            <router-link :to="'/admin/product/videoedit/' + item.id">编辑</router-link>
            <span class="icon-cutting_line"></span>
            <a href="javascipt: void(0)" @click="deleteItem(index)">删除</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <pop
    type="warning"
    :text="pop.text"
    v-show="pop.show"
    @confirm="confirmPop"
    @close="closePop"
  >
  </pop>
  <toast
    v-show="toast.show"
    :text="toast.text"
    :icon="toast.icon"
  >
  </toast>
</div>
</template>

<script>
import toast from 'components/toast/toast'
import pop from 'components/pop/pop'
import util from 'components/tools/util'

export default {
  data() {
    return {
      // items
      items: [{id: '5412', name: '02', img: '', createTime: '2017', select: false}],
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      },
      // pop
      pop: {
        text: '',
        show: false
      },
      thSelect: false
    }
  },
  created() {
    this.getItems()
  },
  methods: {
    getItems() {

    },
    // toggleSelect
    toggleSelectAll() {
      this.thSelect = !this.thSelect
      this.items.forEach((value, index) => {
        value.select = this.thSelect
      })
    },
    toggleSelect(index) {
      let item = this.items[index]
      item.select = !item.select
    },
    deleteItem(index) {
      let arr = []
      let item = this.items[index]
      arr.push(item.id)
      this.deleteIds = arr
      this.pop.text = '确定删除[' + item.name +']'
      this.pop.show = true
    },
    deleteAll() {
      let arr = []
      this.items.forEach((v) => {
        if (v.select) {
          arr.push(v.id)
        }
      })
      if (arr.length <= 0) {
        util.toast.fade(this.toast, '请选择需要删除的项目')
        return
      }
      this.deleteIds = arr
      this.pop.text = '确定删除所选项目'
      this.pop.show = true
    },
    closePop() {
      this.pop.show = false
    },
    confirmPop() {

    },
    playVideo() {

    }
  },
  components: {
    toast,
    pop
  }
}
</script>

<style>
.product-video-img {
  max-width: 260px;
  max-height: 200px;
}
</style>
