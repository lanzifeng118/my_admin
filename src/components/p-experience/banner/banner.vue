<template>
  <div class="product-banner">
    <div class="f-clearfix">
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
    </div>
    <div class="list-table-wrap">
      <div v-if="items.length <= 0" class="list-table-wrap-none">
        还没有相关信息，请添加
      </div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <!-- selectAll -->
            <th
              width="80"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th>所属分类</th>
            <th width="550">图片</th>
            <th width="300">超链接</th>
            <th width="140">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <!-- select -->
            <td
              class="pointer"
              @click="toggleSelect(index)"
            >
              <span :class="[item.select ? 'icon-square_check_fill' : 'icon-square']"></span>
            </td>
            <!-- classify -->
            <td>
              {{item.classify}}
            </td>
            <!-- img -->
            <td class="product-banner-logo">
              <img :src="item.img" alt="">
            </td>
            <!-- link -->
            <td width="300">
              <a :href="item.link" target="_blank">{{item.link}}</a>
            </td>
            <td class="link">
              <router-link :to="'/admin/product/banneredit/' + item.id">编辑</router-link><span class="icon-cutting_line"></span><a href="javascipt: void(0)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pop
      text="确定要删除所选项目？"
      type="warning"
      v-show="popDeleteAll.show"
      @confirm="confirmDeleteAll"
      @close="closeDeleteAll"
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
  import pop from 'components/pop/pop'
  import toast from 'components/toast/toast'

  export default {
    data() {
      return {
        // items
        items: [],
        // toast
        toast: {
          show: false,
          text: '',
          icon: ''
        },

        popDeleteAll: {
          show: false,
          items: []
        }
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      getItems() {
        this.items = [
          {id: '4', classify: '首页', img: '/static/images/product-banner-all.jpg', link: '/admin/product/banner'},
          {id: '1', classify: 'Phoenix', img: '/static/images/product-banner-phoenix.jpg'},
          {id: '2', classify: 'drager', img: '/static/images/product-banner-drager.jpg'},
          {id: '3', classify: 'aircuity', img: '/static/images/product-banner-aircuity.jpg'}
        ]
      }
    },
    components: {
      pop,
      toast
    }
  }
</script>

<style>
.product-banner-logo img {
  max-height: 50px;
  max-width: 510px;
}
</style>
