<template>
  <div class="support-list">
    <div class="f-clearfix">
      <!-- 未回复 -->
      <button class="f-left button" @click="queryToggle">
        <span v-if="reply !== 'N'">查看未回复</span>
        <span v-if="reply === 'N'">查看所有</span>
      </button>

      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
    </div>
    <div class="list-table-wrap">
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
            <th>姓名</th>
            <th width="180">话题</th>
            <th width="350">信息</th>
            <th width="80">来源</th>
            <th width="80">回复</th>
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
            <!-- classify -->
            <td>{{item.classify}}</td>
            <td class="message"><p>{{item.message}}</p></td>
            <td class="message">
              <span :class="[item.lang === 'cn' ? 'icon-chinese' : 'icon-english']"></span>
            </td>
            <!-- message -->
            <!-- reply -->
            <td
              class="pointer"
              @click="toggleReply(index)"
            >
              <span :class="[item.reply === 'Y' ? 'icon-square_check' : 'icon-square']"></span>
            </td>
            <!-- time -->
            <td>{{item.createtime}}</td>
            <td class="link">
              <router-link :to="'/admin/support/detail/' + item.id">查看</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void(0)" @click="deleteItem(index)">删除</a>
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
  import paging from 'components/c-paging/paging'
  import pop from 'components/pop/pop'
  import toast from 'components/toast/toast'
  import util from 'components/tools/util'
  import api from 'components/tools/api'

  export default {
    data() {
      return {
        // items
        items: [],
        msg: '加载中...',
        // notRelay
        reply: '',
        // classify
        classify: [],

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
        thSelect: false,
        // paging
        paging: {
          size: 15,
          no: 0,
          list: []
        }
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      queryToggle() {
        if (this.reply === 'N') {
          this.reply = ''
        } else {
          this.reply = 'N'
        }
        this.getItems()
      },
      getItems() {
        this.items = []
        this.msg = '加载中...'
        let pageData = {
          page_size: this.paging.size,
          page_no: this.paging.no,
          reply: this.reply
        }
        let apiList = api.support
        this.axios(apiList.query(pageData)).then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            let list = data.data.list
            if (list.length > 0) {
              this.msg = ''
              this.items = this.handleData(list)
              this.paging.list = new Array(Math.ceil(data.data.total / this.paging.size))
            } else {
              this.msg = '还没有相关信息'
            }
          } else {
            this.msg = '出错了，请稍后再试'
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
        this.axios(api.support.update({id: item.id, reply: item.reply})).then((res) => {
          let data = res.data
          if (data.code === '200') {
            this.showSuccess()
          } else {
            util.req.changeError(this.toast)
          }
        }).catch((err) => {
          if (err) {
            util.req.changeError(this.toast)
          }
        })
      },
      deleteItem(index) {
        let arr = []
        let item = this.items[index]
        arr.push(item.id)
        this.deleteIds = arr
        this.pop.text = '确定删除[' + item.firstName +']'
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
        this.axios(api.support.delete(deleteIds)).then((res) => {
          let data = res.data
          if (data.code === '200') {
            util.toast.fade(this.toast, '删除成功', 'check')
            this.paging.no = 0
            this.getItems()
          }
        })
      },
      showSuccess() {
        util.toast.fade(this.toast, '修改成功！', 'appreciate')
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
.support-list td.message p{
  word-break: break-all;
  max-height: 40px;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
