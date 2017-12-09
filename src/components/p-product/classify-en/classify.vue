<template>
  <div class="product-classify">
    <div class="f-clearfix">
      <router-link to="/admin/product/classifyadden" class="f-right button list-btn-add">
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
            <th width="120">Order</th>
            <th>Name</th>
            <th width="140">Logo Pic</th>
            <th width="180">Preview Pic</th>
            <th width="210">Banner Pic</th>
            <th width="170">Edit Time</th>
            <th width="120">Operate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <!-- order -->
            <td>
              {{item.sort}}
            </td>
            <!-- name -->
            <td>
              {{item.name}}
            </td>
            <!-- logo -->
            <td class="product-classify-logo img">
              <img v-if="item.logo" :src="item.logo">
            </td>
            <!-- img -->
            <td class="product-classify-img img">
              <img v-if="item.img" :src="item.img">
            </td>
            <!-- banner -->
            <td class="product-classify-banner img">
              <img v-if="item.banner_img" :src="item.banner_img">
            </td>
            <!-- modifyTime -->
            <td>
              {{item.modifytime}}
            </td>
            <td class="link">
              <router-link :to="'/admin/product/classifyediten/' + item.id">编辑</router-link>
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
  import api from 'components/tools/api-en'

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
        }
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
            util.req.queryError(this.toast)
          }
        })
      },
      deleteItem(index) {
        let arr = []
        let item = this.items[index]
        arr.push(item.id)
        this.deleteIds = arr
        this.pop.text = '确定删除[' + item.name +']'
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
