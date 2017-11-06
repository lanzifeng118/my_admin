<template>
  <div class="product-classify">
    <div class="f-clearfix">
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
      <router-link to="/admin/product/classifyadd" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link >
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
              width="60"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="120">排序</th>
            <th>名称</th>
            <th width="130">logo图</th>
            <th width="180">预览图</th>
            <th width="200">广告图</th>
            <th width="170">修改时间</th>
            <th width="120">操作</th>
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
            <!-- order -->
            <td class="order">
              <input v-model="item.sort">
            </td>
            <!-- name -->
            <td>
              {{item.name}}
            </td>
            <!-- logo -->
            <td class="product-classify-logo img">
              <img :src="item.logo">
            </td>
            <!-- img -->
            <td class="product-classify-img img">
              <img :src="item.img">
            </td>
            <!-- banner -->
            <td class="product-classify-banner img">
              <img :src="item.banner_img">
            </td>
            <!-- modifyTime -->
            <td>
              {{item.modifytime}}
            </td>
            <td class="link">
              <router-link :to="'/admin/product/classifyedit/' + item.id">编辑</router-link>
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
  import pop from 'components/pop/pop'
  import toast from 'components/toast/toast'
  import util from 'components/tools/util'
  import api from 'components/tools/api'

  export default {
    data() {
      return {
        // items
        items: [],
        deleteIds: [],
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
        let _this = this
        this.axios(api.productClassify.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            data.data.list.forEach((v) => {
              v.select = false
              _this.items.push(v)
            })
            console.log(this.items)
          } else {
            util.req.queryErr(this.toast)
          }
        })
      },
      toggleSelectAll() {
        this.thSelect = !this.thSelect
        this.items.forEach((v) => {
          v.select = this.thSelect
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
      confirmPop() {
        let _this = this
        let deleteIds = this.deleteIds
        this.pop.show = false
        this.axios(api.productClassify.delete(deleteIds)).then((res) => {
          let data = res.data
          if (data.code === '200') {
            deleteIds.forEach((id) => {
              for (let i = 0; i <= _this.items.length - 1; i++) {
                if (_this.items[i].id === id) {
                  _this.items.splice(i, 1)
                  break
                }
              }
            })
            util.toast.fade(this.toast, '删除成功', 'check')
          }
        })
      },
      closePop() {
        this.pop.show = false
      }
    },
    components: {
      pop,
      toast
    }
  }
</script>

<style>
.product-classify-logo img {
  max-height: 35px;
  max-width: 110px;
}
.product-classify-img img {
  max-height: 80px;
  max-width: 160px;
}
.product-classify-banner img{
  max-height: 50px;
  max-width: 180px;
}
</style>
