<template>
  <div class="support-list">
    <div class="f-clearfix">
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
      <router-link to="/admin/support/add" class="f-right button list-btn-add">
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
            <th>姓名</th>
            <th width="180">话题</th>
            <th width="400">信息</th>
            <th width="100">回复</th>
            <th width="160">时间</th>
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
            <td>{{item.firstName}} {{item.lastName}}</td>
            <!-- topic -->
            <td>{{item.topic}}</td>
            <!-- message -->
            <td class="message"><p>{{item.message}}</p></td>
            <!-- reply -->
            <td
              class="pointer"
              @click="toggleReply(index)"
            >
              <span :class="[item.reply === 'Y' ? 'icon-square_check' : 'icon-square']"></span>
            </td>
            <!-- time -->
            <td>{{item.time}}</td>
            <td class="link">
              <router-link :to="'/admin/support/detail/' + item.id">查看</router-link>
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
  import search from 'components/search/search'
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
    },
    methods: {
      getItems() {
        let data = {}
        data.list = [
          {firstName: 'Yun', lastName: 'Chan', Email: 'lanzifeng@163.com', topic: 'aa', message: 'We appreciate your business and want to provide outstanding and excellent customer service! Please complete the form below. The boxes marked with * are required. We will respond as soon as possible.', tel: '1898402', company: 'xx', country: 'china', address: 'xxx', time: '2017.12.01 11:23:20', reply: 'Y'},
          {firstName: 'Yun', lastName: 'Chan', Email: 'lanzifeng@163.com', topic: 'aa', message: 'hello', tel: '1898402', company: 'xx', country: 'china', address: 'xxx', time: '2017.12.01', reply: 'N'},
          {firstName: 'Yun', lastName: 'Chan', Email: 'lanzifeng@163.com', topic: 'aa', message: 'hello', tel: '1898402', company: 'xx', country: 'china', address: 'xxx', time: '2017.12.01', reply: 'N'}
        ]
        this.items = this.handleData(data)
        // let _this = this
        // let apiList = api.support
        // this.axios(apiList.query()).then((res) => {
        //   let data = res.data
        //   console.log(data)
        //   if (data.code === '200') {
        //     _this.items = _this.handleData(data.data)
        //     console.log(_this.items)
        //   } else {
        //     util.req.queryError(this.toast)
        //   }
        // })
      },
      handleData(data) {
        let dataH = []
        data.list.forEach((v) => {
          v.select = false
          dataH.push(v)
        })
        return dataH
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
      toggleReply(index) {
        let item = this.items[index]
        if (item.reply === 'Y') {
          item.reply = 'N'
        } else {
          item.reply = 'Y'
        }
        // ajax
      },
      deleteItem(index) {
        let arr = []
        let item = this.items[index]
        arr.push(item.id)
        this.deleteIds = arr
        this.pop.text = '确定删除[' + item.title +']'
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
        this.axios(api.support.delete(deleteIds)).then((res) => {
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
      search,
      pop,
      toast
    }
  }
</script>

<style>
.support-list td.message p{
  word-break: break-all;
  max-height: 40px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
