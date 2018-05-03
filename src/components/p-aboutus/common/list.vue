<template>
  <div class="aboutus-list">
    <div class="f-clearfix">
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>{{lang === 'cn' ? '一键删除' : 'Delete All'}}
      </button>
      <router-link v-if="lang === 'cn'" to="/admin/aboutus/add" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link>
      <router-link v-if="lang === 'en'" to="/admin/aboutus/adden" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>Add
      </router-link>
    </div>
    <div class="list-table-wrap">
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <!-- selectAll -->
            <th
              width="120"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th width="120">{{lang === 'cn' ? '顺序' : 'Order'}}</th>
            <th>{{lang === 'cn' ? '名称' : 'Name'}}</th>
            <th width="180">{{lang === 'cn' ? '显示' : 'Display'}}</th>
            <th width="220">{{lang === 'cn' ? '修改时间' : 'Edit Time'}}</th>
            <th width="200">{{lang === 'cn' ? '操作' : 'Operate'}}</th>
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
            <td>{{item.title}}</td>
            <!-- show -->
            <td
              class="pointer"
              :class="[item.display === 'Y' ? 'show' : 'not-show']"
              @click="toggleDisplay(index)"
            >
              <span class="icon-check"></span>
            </td>
            <td>{{item.modifytime}}</td>
            <td class="link">
              <router-link  v-if="lang === 'cn'" :to="'/admin/aboutus/edit/' + item.id">编辑</router-link>
              <router-link  v-else :to="'/admin/aboutus/editen/' + item.id">Edit</router-link>
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
        return this.lang === 'cn' ? api : apiEn
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      getItems() {
        this.axios(this.api.aboutus.query()).then((res) => {
          let data = res.data
          console.log(data)
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
      toggleSelectAll() {
        this.thSelect = !this.thSelect
        this.items.forEach((v, i) => {
          v.select = this.thSelect
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
        this.axios(this.api.aboutus.updateForDisplay({id: item.id, display: item.display})).then((res) => {
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
        let deleteIds = this.deleteIds
        this.pop.show = false
        this.axios(this.api.aboutus.delete(deleteIds)).then((res) => {
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
      }
    },
    components: {
    }
  }
</script>

<style>
</style>
