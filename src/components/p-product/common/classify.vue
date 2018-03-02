<template>
  <div class="product-classify">
    <div class="f-clearfix">
      <!-- cn -->
      <router-link v-if="lang === 'cn'" to="/admin/product/classifyadd" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link >
      <!-- en -->
      <router-link v-else to="/admin/product/classifyadden" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>Add
      </router-link >
    </div>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <!-- cn -->
          <tr>
            <th width="120">{{lang === 'cn' ? '排序' : 'Order'}}</th>
            <th>{{lang === 'cn' ? '名称' : 'Name'}}</th>
            <th width="140">{{lang === 'cn' ? 'Logo图' : 'Logo Pic'}}</th>
            <th width="180">{{lang === 'cn' ? '预览图' : 'Preview Pic'}}</th>
            <th width="210">{{lang === 'cn' ? '广告图' : 'Banner Pic'}}</th>
            <th width="170">{{lang === 'cn' ? '修改时间' : 'Edit Time'}}</th>
            <th width="120">{{lang === 'cn' ? '操作' : 'Operate'}}</th>
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
              <router-link v-if="lang === 'cn'" :to="'/admin/product/classifyedit/' + item.id">编辑</router-link>
              <router-link v-else :to="'/admin/product/classifyediten/' + item.id">Edit</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void 0" @click="deleteItem(index)">{{lang === 'cn' ? '删除' : 'Delete'}}</a>
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
  import apiEn from 'components/tools/api-en'

  export default {
    props: {
      lang: {
        type: String,
        default: 'cn'
      }
    },
    data() {
      return {
        // items
        items: [],
        msg: '加载中...',
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
    computed: {
      api() {
        return this.lang === 'en' ? apiEn : api
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      getItems() {
        this.axios(this.api.productClassify.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            let list = data.data.list
            if (list.length > 0) {
              this.msg = ''
              data.data.list.forEach((v) => {
                v.select = false
                this.items.push(v)
              })
            } else {
              this.msg = '还没有相关信息，请添加'
            }
          } else {
            this.msg = '出错了，请稍后再试'
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
        let deleteIds = this.deleteIds
        this.pop.show = false
        this.axios(this.api.productClassify.delete(deleteIds)).then((res) => {
          let data = res.data
          if (data.code === '200') {
            deleteIds.forEach((id) => {
              for (let i = 0; i <= this.items.length - 1; i++) {
                if (this.items[i].id === id) {
                  this.items.splice(i, 1)
                  break
                }
              }
            })
            util.toast.fade(this.toast, '删除成功', 'check')
          } else {
            util.req.changeError(this.toast)
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
