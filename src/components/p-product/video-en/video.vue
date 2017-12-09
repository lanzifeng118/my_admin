<template>
<div class="product-video">
  <div class="f-clearfix">
    <button class="f-right button" @click="deleteAll">
      <span class="icon icon-delete"></span>Delete All
    </button>
    <router-link to="/admin/product/videoadden" class="f-right button list-btn-add">
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
          <th width="100" @click="toggleSelectAll">
            <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
          </th>
          <th>Name</th>
          <th width="280">Preview Pic</th>
          <th width="190">Brand</th>
          <th width="200">Edit Time</th>
          <th width="200">Operate</th>
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
          <td class="product-video-img">
            <img :src="item.img" alt="">
          </td>
          <!-- classify -->
          <td class="classify">
            <p v-if="item.classify"><span>{{item.classify}}</span></p>
          </td>
          <td>{{item.modifytime}}</td>
          <td class="link">
            <router-link :to="'/admin/product/videoediten/' + item.id">Edit</router-link>
            <span class="icon-cutting_line"></span>
            <a href="javascipt: void(0)" @click="deleteItem(index)">Delete</a>
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
import toast from 'components/toast/toast'
import pop from 'components/pop/pop'
import util from 'components/tools/util'
import api from 'components/tools/api-en'

export default {
  data() {
    return {
      // items
      items: [],
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
  created() {
    this.getItems()
    this.getClassiy()
  },
  methods: {
    getItems(byWhat) {
      let _this = this
      let obj = null
      let apiList = api.productVideo
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
      let _this = this
      let deleteIds = this.deleteIds
      this.pop.show = false
      this.axios(api.productVideo.delete(deleteIds)).then((res) => {
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
    toast,
    pop
  }
}
</script>

<style>
td.product-video-img {
  line-height: 0;
}
.product-video-img img{
  max-width: 260px;
  max-height: 180px;
}
</style>
