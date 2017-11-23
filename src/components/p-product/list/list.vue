<template>
  <div class="product-list">
    <div class="f-clearfix">
      <!-- 分类 -->
      <div class="f-left">
        <select v-model="classifySelect" @change="changeSelect">
          <option disabled value="">选择分类</option>
          <option value="">所有分类</option>
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
        <input class="search-input" v-model="searchText" placeholder="输入查找内容">
        <span class="search-icon icon-search" @click="searchSubmit"></span>
      </div>
      <!-- 删除 -->
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
      <router-link to="/admin/product/add" class="f-right button list-btn-add">
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
              width="80"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="60">排序</th>
            <th>名称</th>
            <th width="220">图片</th>
            <th width="110">显示</th>
            <th width="190">分类</th>
            <th width="150">修改时间</th>
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
            <!-- order -->
            <td class="order">
              {{item.sort}}
            </td>
            <!-- name -->
            <td>{{item.name}}</td>
            <!-- picture -->
            <td class="product-list-img"><img :src="item.img" alt=""></td>
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
              <p v-if="item.classify"><span>{{item.classify}}</span></p>
            </td>
            <td>{{item.modifytime}}</td>
            <td class="link">
              <router-link :to="'/admin/product/edit/' + item.id">编辑</router-link>
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
        // classify
        classifySelect: '',
        classify: [],

        deleteIds: [],
        searchText: '',
        // order
        orderValue: [],
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
      this.getClassiy()
    },
    methods: {
      getItems(byWhat) {
        let _this = this
        let obj = null
        let apiList = api.productList
        switch (byWhat) {
          case 'bySearch':
            obj = apiList.queryBySearch(this.searchText, this.classifySelect)
            break
          default:
            obj = apiList.query()
        }
        this.axios(obj).then((res) => {
          let data = res.data
          if (data.code === '200') {
            _this.items = _this.handleData(data.data)
            console.log(_this.items)
          } else {
            util.req.queryError(this.toast)
          }
        })
      },
      getClassiy() {
        let _this = this
        this.axios(api.productClassify.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            _this.classify = data.data.list
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
        let dataH = []
        data.list.forEach((v) => {
          v.select = false
          dataH.push(v)
        })
        return dataH
      },
      searchSubmit() {
        this.getItems('bySearch')
      },
      changeSelect() {
        this.getItems('bySearch')
        // ajax
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
        let _this = this
        let deleteIds = this.deleteIds
        this.pop.show = false
        this.axios(api.productList.delete(deleteIds)).then((res) => {
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
      }
    },
    components: {
      pop,
      toast
    }
  }
</script>

<style>
.product-list .search {
  margin-left: 10px;
}
.product-list-img img{
  max-width: 200px;
  max-height: 120px;
  line-height: 0;
}
</style>
