<template>
  <div class="file-list">
    <div class="f-clearfix">
      <!-- <button class="f-left button" @click="queryToggle">
        <span v-if="reply !== 'N'">查看未回复</span>
        <span v-if="reply === 'N'">查看所有</span>
      </button> -->

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
            <th>文件名</th>
            <th width="300">文件</th>
            <th width="100">文件类型</th>
            <th width="100">文件大小</th>
            <th width="170">上传时间</th>
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
            <td>{{item.file_name}}</td>
            <!-- type -->
            <td>{{item.file_type}}</td>
            <td>{{item.file_type}}</td>
            <td class="file_size"><p>{{item.file_size}}</p></td>
            <!-- time -->
            <td>{{item.upload_time}}</td>
            <td class="link">
              <a :href="item.file_url" :donwload="item.file_name">下载</a>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void(0)" @click="deleteItem(index)">删除</a>
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
  import search from 'components/search/search'
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
        // notRelay
        reply: '',
        // classify
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
        let pageData = {
          page_size: this.paging.size,
          page_no: this.paging.no
        }
        let apiList = api.fileList
        this.axios(apiList.query(pageData)).then((res) => {
          let data = res.data
          console.log(data)
          if (data.code === '200') {
            this.items = this.handleData(data.data)
            this.paging.list = new Array(Math.ceil(data.data.total / this.paging.size))
          } else {
            util.req.queryError(this.toast)
          }
        })
      },
      handleData(data) {
        let dataH = []
        data.list.forEach((v) => {
          v.select = false
          let size = v.file_size / 1024
          if (size < 1024) {
            size = Math.ceil(size) + 'Kb'
          } else {
            size = Math.ceil((size / 102.4)) / 10 + 'Mb'
          }
          v.file_size = size
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
        this.pop.text = `确定永久删除${item.file_name}`
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
        this.pop.text = '确定永久删除所选项目'
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
      search,
      pop,
      toast,
      paging
    }
  }
</script>

<style>
</style>
