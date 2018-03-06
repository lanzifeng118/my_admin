<template>
  <div class="support-classify">
    <div class="f-clearfix">
      <router-link v-if="lang === 'cn'" to="/admin/support/classifyadd" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link>
      <router-link v-if="lang === 'en'" to="/admin/support/classifyadden" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>Add
      </router-link>
    </div>
    <div class="list-table-wrap">
      <div class="list-table-wrap-none">{{msg}}</div>
      <table v-if="items.length > 0">
        <thead>
          <tr>
            <th width="150">{{lang === 'cn' ? '顺序' : 'Order'}}</th>
            <th>{{lang === 'cn' ? '名称' : 'Name'}}</th>
            <th width="250">{{lang === 'cn' ? '修改时间' : 'Edit Time'}}</th>
            <th width="180">{{lang === 'cn' ? '操作' : 'Operate'}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <!-- order -->
            <td>
              {{item.sort}}
            </td>
            <!-- name -->
            <td>
              {{item.name}}
            </td>
            <!-- modifyTime -->
            <td>
              {{item.modifytime}}
            </td>
            <td class="link">
              <router-link v-if="lang === 'cn'" :to="'/admin/support/classifyedit/' + item.id">编辑</router-link>
              <router-link v-else :to="'/admin/support/classifyediten/' + item.id">Edit</router-link>
              <span class="icon-cutting_line"></span>
              <a href="javascipt: void 0" @click="deleteItem(index)">{{lang === 'cn' ? '删除' : 'Delete'}}</a>
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
        }
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
        this.axios(this.api.supportClassify.query()).then((res) => {
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
      deleteItem(index) {
        let arr = []
        let item = this.items[index]
        arr.push(item.id)
        this.deleteIds = arr
        this.pop.text = '确定删除[' + item.name +']'
        this.pop.show = true
      },
      confirmPop() {
        let deleteIds = this.deleteIds
        this.pop.show = false
        this.axios(this.api.supportClassify.delete(deleteIds)).then((res) => {
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
      closePop() {
        this.pop.show = false
      }
    },
    components: {
      pop,
      toast
    }
  }
</script>

<style>
</style>
