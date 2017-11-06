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
            <th>分类名称</th>
            <th width="680">图片</th>
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
            <!-- name -->
            <td class="product-banner-logo">
              <img :src="item.src" alt="">
            </td>
            <td class="link">
              <router-link :to="'/admin/product/classifyedit/' + item.id">编辑</router-link><span class="icon-cutting_line"></span><a href="javascipt: void(0)">删除</a>
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
          {id: '4', classify: '首页', src: '/static/images/product-banner-all.jpg', order: '1'},
          {id: '1', classify: 'Phoenix', src: '/static/images/product-banner-phoenix.jpg', order: '1'},
          {id: '2', classify: 'drager', src: '/static/images/product-banner-drager.jpg', order: '2'},
          {id: '3', classify: 'aircuity', src: '/static/images/product-banner-aircuity.jpg', order: '3'}
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
  max-height: 55px;
  max-width: 520px;
}
</style>
