<template>
  <div class="file-list">
    <div class="f-clearfix">
      <div class="f-left">
        <select v-model="typeSelect" @change="changeSelect">
          <option disabled>选择类型</option>
          <option value="">所有类型</option>
          <option value="1">图片</option>
          <option value="2">文档</option>
          <option value="3">多媒体</option>
          <option value="4">其他</option>
        </select>
      </div>
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
            <th width="80" @click="toggleSelectAll" class="pointer">
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="310">文件名</th>
            <th>文件预览</th>
            <th width="100">文件类型</th>
            <th width="100">文件大小</th>
            <th width="170">上传时间</th>
            <th width="120">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <!-- select -->
            <td class="pointer" @click="toggleSelect(index)">
              <span :class="[item.select ? 'icon-square_check_fill' : 'icon-square']"></span>
            </td>
            <td class="file-name">{{item.file_name}}</td>

            <td class="img">
              <img v-if="item.file_type == 1" :src="item.file_url" style="max-width: 200px; max-height: 40px;">
            </td>

            <!-- type -->
            <td>
              {{item.type}}
              <span v-if="item.file_type == 1">图片</span>
              <span v-if="item.file_type == 2">文档</span>
              <span v-if="item.file_type == 3">多媒体</span>
              <span v-if="item.file_type == 4">其他</span>
            </td>
            <td class="file_size">
              <p>{{item.file_size}}</p>
            </td>
            <!-- time -->
            <td>{{item.upload_time}}</td>
            <td class="link">
              <a :href="item.file_url" :download="item.file_name">下载</a>
              <span class="icon-cutting_line"></span>
              <a href="javascript: void(0)" @click="deleteItem(index)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <paging v-if="paging.total > 0" :paging="paging" @pagingNextClick="pagingNextClick" @pagingPreClick="pagingPreClick" @pagingChange="pagingChange">
    </paging>
    <pop type="warning" :text="pop.text" v-show="pop.show" @confirm="confirmPop" @close="closePop">
    </pop>
    <toast v-show="toast.show" :text="toast.text" :icon="toast.icon">
    </toast>
  </div>
</template>

<script>
import paging from 'components/c-paging/paging'
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
      typeSelect: '',
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
        total: 0
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
      this.paging.total = 0
      let pageData = {
        page_size: this.paging.size,
        page_no: this.paging.no,
        file_type: this.typeSelect
      }
      let apiList = api.fileList
      this.axios(apiList.query(pageData)).then(res => {
        let data = res.data
        // console.log(data)
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
    changeSelect() {
      this.getItems()
    },
    handleData(data) {
      data.forEach(v => {
        v.select = false
        let size = v.file_size / 1024
        if (size < 1024) {
          size = Math.ceil(size) + 'Kb'
        } else {
          size = Math.ceil(size / 102.4) / 10 + 'Mb'
        }
        v.file_size = size
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
    deleteItem(index) {
      let arr = []
      let item = this.items[index]
      arr.push(item.id)
      this.deleteIds = arr
      this.pop.text = `确定永久删除[${item.file_name}]`
      this.pop.show = true
    },
    deleteAll() {
      let arr = []
      this.items.forEach(v => {
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
      this.axios(api.fileList.delete(deleteIds)).then(res => {
        let data = res.data
        if (data.code === '200') {
          util.toast.fade(this.toast, '删除成功', 'check')
          this.paging.no = 0
          this.getItems()
        }
      })
    },
    pagingPreClick() {
      this.paging.no--
      this.getItems()
    },
    pagingNextClick() {
      this.paging.no++
      this.getItems()
    },
    pagingChange(index) {
      this.paging.no = index
      this.getItems()
    }
  },
  components: {
    paging
  }
}
</script>

<style>
.file-list td.file-name {
  word-break: break-all;
}
</style>
