<template>
  <div class="experience-list">
    <div class="f-clearfix">
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>Delete All
      </button>
      <router-link to="/admin/experience/adden" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>Add
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
              width="100"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="80">Order</th>
            <th>Logo</th>
            <th width="200">Brand</th>
            <th width="200">Classify</th>
            <th width="200">Edit Time</th>
            <th width="120">Operate</th>
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
            <!-- logo -->
            <td><img style="max-width: 130px;" :src="item.img"></td>
            <!-- show -->
            <td>{{item.brand}}</td>
            <td>{{item.classify}}</td>
            <td>{{item.modifytime}}</td>
            <td class="link">
              <router-link :to="'/admin/experience/editen/' + item.id">Edit</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void(0)" @click="deleteItem(index)">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <paging
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
  import toast from 'components/toast/toast'
  import paging from 'components/c-paging/paging'
  import util from 'components/tools/util'
  import api from 'components/tools/api-en'

  export default {
    data() {
      return {
        // items
        items: [],
        // brand
        brandSelect: '',
        brand: [],

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
        thSelect: false,
        // paging
        paging: {
          size: 10,
          no: 0,
          list: []
        }
      }
    },
    created() {
      this.getItems()
      this.getBrand()
    },
    methods: {
      getItems() {
        let pageData = {
          page_size: this.paging.size,
          page_no: this.paging.no,
          brand: this.brandSelect,
          name: this.searchText
        }
        this.axios(api.experienceList.query(pageData)).then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            this.items = this.handleData(data.data.list)
            this.paging.list = new Array(Math.ceil(data.data.total / this.paging.size))
          } else {
            util.req.queryError(this.toast)
          }
        })
      },
      getBrand() {
        this.axios(api.experienceBrand.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            this.brand = data.data.list
          } else {
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
      changeSelect() {
        this.getItems()
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
        this.axios(api.experienceList.updateForDisplay({id: item.id, display: item.display})).then((res) => {
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
        this.pop.text = '确定删除该项目'
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
        this.axios(api.experienceList.delete(deleteIds)).then((res) => {
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

</style>
