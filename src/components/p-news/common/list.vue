<template>
  <div class="news-list">
    <div class="f-clearfix">
      <!-- 分类 -->
      <div class="f-left">
        <select v-model="classifySelect" @change="changeSelect">
          <option disabled>{{lang === 'cn' ? '选择分类' : 'Choose Classify'}}选择分类</option>
          <option value="">{{lang === 'cn' ? '所有分类' : 'All Classify'}}</option>
          <option
            v-for="classifyItem in classify"
            :value="classifyItem.name"
          >
            {{classifyItem.name}}
          </option>
        </select>
      </div>
      <!-- 删除 -->
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>{{lang === 'cn' ? '一键删除' : 'Delete All'}}
      </button>
      <router-link v-if="lang === 'cn'" to="/admin/news/add" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link >
      <router-link v-if="lang === 'en'" to="/admin/news/adden" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>Add
      </router-link >
    </div>
    <div class="list-table-wrap">
      <!-- msg -->
      <div class="list-table-wrap-none">{{msg}}</div>
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
            <th width="60">{{lang === 'cn' ? '顺序' : 'Order'}}</th>
            <th>{{lang === 'cn' ? '标题' : 'Title'}}</th>
            <th width="220">{{lang === 'cn' ? '预览图' : 'Preview Pic'}}</th>
            <th width="110">{{lang === 'cn' ? '显示' : 'Display'}}</th>
            <th width="190">{{lang === 'cn' ? '分类' : 'Classify'}}</th>
            <th width="170">{{lang === 'cn' ? '修改时间' : 'Edit Time'}}</th>
            <th width="140">{{lang === 'cn' ? '操作' : 'Operate'}}</th>
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
            <td class="news-list-img img"><img :src="item.img" alt=""></td>
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
              <p v-if="item.classify && item.classify.trim()"><span>{{item.classify}}</span></p>
            </td>
            <td>{{item.modifytime}}</td>
            <td class="link">
              <router-link v-if="lang === 'cn'" :to="'/admin/news/edit/' + item.id">编辑</router-link>
              <router-link v-else :to="'/admin/news/editen/' + item.id">Edit</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascript: void 0" @click="deleteItem(index)">{{lang === 'cn' ? '删除' : 'Delete'}}</a>
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
          total: 0
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
          classify: this.classifySelect
        }
        this.axios(this.api.newsList.query(pageData)).then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            let list = data.data.list
            if (list.length > 0) {
              this.msg = ''
              this.items = this.handleData(list)
              this.paging.total = data.data.total
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
        this.axios(this.api.newsClassify.query()).then((res) => {
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
        this.axios(this.api.newsList.updateForDisplay({id: item.id, display: item.display})).then((res) => {
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
        this.axios(this.api.newsList.delete(deleteIds)).then((res) => {
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
.news-list-img img{
  max-width: 200px;
  max-height: 120px;
  line-height: 0;
}
</style>
