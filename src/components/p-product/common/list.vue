<template>
  <div class="product-list">
    <div class="f-clearfix">
      <!-- 品牌 -->
      <div class="f-left">
        <select v-model="classifySelect" @change="changeSelect">
          <option v-if="lang === 'cn'" disabled>选择品牌</option>
          <option v-if="lang === 'cn'" value="">所有品牌</option>
          <option v-if="lang === 'en'" disabled>Choose Brand</option>
          <option v-if="lang === 'en'" value="">All Brand</option>
          <option
            v-for="classifyItem in classify"
            :value="classifyItem.name"
          >
            {{classifyItem.name}}
          </option>
        </select>
      </div>
      <!-- search -->
      <div class="search f-left">
        <input class="search-input" v-model="searchText" placeholder="输入产品名称关键字">
        <span class="search-icon icon-search" @click="searchSubmit"></span>
      </div>
      <!-- 删除 -->
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span><span v-if="lang === 'cn'">一键删除</span><span v-if="lang === 'en'">Delete All</span>
      </button>
      <router-link v-if="lang === 'cn'" to="/admin/product/add" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link >
      <router-link v-if="lang === 'en'" to="/admin/product/adden" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>Add
      </router-link >
    </div>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <!-- cn -->
          <tr v-if="lang === 'cn'">
            <th
              width="80"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="60">排序</th>
            <th>产品名称</th>
            <th width="220">预览图</th>
            <th width="110">显示</th>
            <th width="190">品牌</th>
            <th width="170">修改时间</th>
            <th width="140">操作</th>
          </tr>
          <!-- en -->
          <tr v-if="lang === 'en'">
            <th
              width="80"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="60">Order</th>
            <th>Product Name</th>
            <th width="220">Preview Picture</th>
            <th width="110">Display</th>
            <th width="190">Brand</th>
            <th width="170">Edit Time</th>
            <th width="140">Operate</th>
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
              {{item.sort}}
            </td>
            <!-- name -->
            <td>{{item.name}}</td>
            <!-- picture -->
            <td class="product-list-img img"><img v-if="item.img" :src="item.img" alt=""></td>
            <!-- show -->
            <td
              class="pointer"
              :class="[item.display === 'Y' ? 'show' : 'not-show']"
              @click="toggleDisplay(index)"
            >
              <span class="icon-check"></span>
            </td>
            <!-- classify -->
            <td class="classify">
              <p v-if="item.classify.trim()"><span>{{item.classify}}</span></p>
            </td>
            <td>{{item.modifytime}}</td>
            <td class="link" v-if="lang === 'cn'">
              <router-link :to="'/admin/product/edit/' + item.id">编辑</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void(0)" @click="deleteItem(index)">删除</a>
            </td>
            <td class="link" v-if="lang === 'en'">
              <router-link :to="'/admin/product/editen/' + item.id">Edit</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void(0)" @click="deleteItem(index)">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <paging
      v-show="items.length > 0"
      :paging="paging"
      @pagingNextClick="pagingNextClick"
      @pagingPreClick="pagingPreClick"
      @pagingChange="pagingChange"
    >
    </paging>
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
  import paging from 'components/c-paging/paging'
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
        // classify
        classifySelect: '',
        classify: [],

        deleteIds: [],
        searchText: '',
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
        thSelect: false,
        // paging
        paging: {
          size: 10,
          no: 0,
          list: []
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
      this.getClassiy()
    },
    methods: {
      getItems() {
        this.items = []
        this.msg = '加载中...'
        let pageData = {
          page_size: this.paging.size,
          page_no: this.paging.no,
          classify: this.classifySelect,
          name: this.searchText
        }
        this.axios(this.api.productList.query(pageData)).then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            let list = data.data.list
            if (list.length > 0) {
              this.msg = ''
              this.items = this.handleData(list)
              this.paging.list = new Array(Math.ceil(data.data.total / this.paging.size))
            } else {
              this.msg = '还没有相关信息，请添加'
            }
          } else {
            this.msg = '出错了，请稍后再试'
            util.req.queryError(this.toast)
          }
        })
      },
      getClassiy() {
        this.axios(this.api.productClassify.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            this.classify = data.data.list
          } else {
            util.req.queryError(this.toast)
          }
        }).catch((err) => {
          if (err) {
            util.req.queryError(this.toast)
          }
        })
      },
      handleData(data) {
        data.forEach((v) => {
          v.select = false
        })
        return data
      },
      searchSubmit() {
        this.getItems()
      },
      changeSelect() {
        this.getItems()
      },
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
      toggleDisplay(index) {
        let item = this.items[index]
        if (item.display === 'Y') {
          item.display = 'N'
        } else {
          item.display = 'Y'
        }
        // ajax
        this.axios(this.api.productList.updateForDisplay({id: item.id, display: item.display})).then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            util.toast.fade(this.toast, '修改成功！', 'appreciate')
          } else {
            util.req.changeError(this.toast)
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
        let deleteIds = this.deleteIds
        this.pop.show = false
        this.axios(this.api.productList.delete(deleteIds)).then((res) => {
          let data = res.data
          if (data.code === '200') {
            util.toast.fade(this.toast, '删除成功', 'check')
            this.paging.no = 0
            this.getItems()
          }
        })
      },
      pagingPreClick() {
        this.paging.no --
        this.getItems()
      },
      pagingNextClick() {
        this.paging.no ++
        this.getItems()
      },
      pagingChange(index) {
        this.paging.no = index
        this.getItems()
      }
    },
    components: {
      pop,
      toast,
      paging
    }
  }
</script>

<style>
.product-list .search {
  margin-left: 10px;
}
.product-list-img img{
  max-width: 200px;
  max-height: 85px;
  line-height: 0;
}
</style>
