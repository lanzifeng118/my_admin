<template>
<div class="product-video">
  <div class="f-clearfix">
    <!-- 品牌 -->
    <div class="f-left">
      <select v-model="classifySelect" @change="changeSelect">
        <option disabled>{{lang === 'cn' ? '选择品牌' : 'Choose Brand'}}</option>
        <option value="">{{lang === 'cn' ? '所有品牌' : 'All Brands'}}</option>
        <option
          v-for="classifyItem in classify"
          :value="classifyItem.name"
        >
          {{classifyItem.name}}
        </option>
      </select>
    </div>
    <button class="f-right button" @click="deleteAll">
      <span class="icon icon-delete"></span>{{lang === 'cn' ? '一键删除' : 'Delete All'}}
    </button>
    <!-- cn -->
    <router-link v-if="lang === 'cn'" to="/admin/product/videoadd" class="f-right button list-btn-add">
      <span class="icon icon-round_add"></span>添加
    </router-link>
    <!-- en -->
    <router-link v-else to="/admin/product/videoadden" class="f-right button list-btn-add">
      <span class="icon icon-round_add"></span>Add
    </router-link>
  </div>
  <div class="list-table-wrap">
    <!-- msg -->
    <div class="list-table-wrap-none">{{msg}}</div>
    <table v-if="items.length > 0">
      <thead>
        <!-- cn -->
        <tr>
          <th width="100" @click="toggleSelectAll">
            <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
          </th>
          <th>{{lang === 'cn' ? '名称' : 'Name'}}</th>
          <th width="280">{{lang === 'cn' ? '预览图' : 'Preview Pic'}}</th>
          <th width="190">{{lang === 'cn' ? '品牌' : 'Brand'}}</th>
          <th width="200">{{lang === 'cn' ? '修改时间' : 'Edit Time'}}</th>
          <th width="200">{{lang === 'cn' ? '操作' : 'Operate'}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items">
          <td
            class="pointer"
            @click="toggleSelect(index)"
            :class="{show: item.select}"
          >
            <span :class="[item.select ? 'icon-square_check_fill' : 'icon-square']"></span>
          </td>
          <!-- name -->
          <td>{{item.name}}</td>
          <!-- img -->
          <td class="img">
            <img :src="item.img" style="max-width: 200px; max-height: 100px;">
          </td>
          <!-- classify -->
          <td class="classify">
            <p v-if="item.classify && item.classify.trim()"><span>{{item.classify}}</span></p>
          </td>
          <td>{{item.modifytime}}</td>
          <td class="link">
            <router-link v-if="lang === 'cn'" :to="'/admin/product/videoedit/' + item.id">编辑</router-link>
            <router-link v-else :to="'/admin/product/videoediten/' + item.id">Edit</router-link>
            <span class="icon-cutting_line"></span>
            <a href="javascript: void 0" @click="deleteItem(index)">{{lang === 'cn' ? '删除' : 'Delete'}}</a>
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
    getItems(byWhat) {
      this.items = []
      this.msg = '加载中...'
      let obj = null
      let apiList = this.api.productVideo
      switch (byWhat) {
        case 'byClassify':
          obj = apiList.queryByClassify(this.classifySelect)
          break
        default:
          obj = apiList.query()
      }
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          let list = data.data.list
          if (list.length > 0) {
            this.msg = ''
            list.forEach((v) => {
              v.select = false
            })
            this.items = list
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
    changeSelect() {
      if (this.classifySelect) {
        this.getItems('byClassify')
      } else {
        this.getItems()
      }
    },
    // toggleSelect
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
      this.axios(this.api.productVideo.delete(deleteIds)).then((res) => {
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
    }
  },
  components: {
  }
}
</script>

<style>
.product-video-img img{
  max-width: 260px;
  max-height: 180px;
}
</style>
