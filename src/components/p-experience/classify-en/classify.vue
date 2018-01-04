<template>
  <div class="experience-classify">
    <div class="f-clearfix">
      <router-link to="/admin/experience/classifyadden" class="f-right button list-btn-add">
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
            <th>Classify Name</th>
            <th width="600">Edit Time</th>
            <th width="180">Operate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items">
            <!-- name -->
            <td>
              {{item.name}}
            </td>
            <!-- modifyTime -->
            <td>
              {{item.modifytime}}
            </td>
            <td class="link">
              <router-link :to="'/admin/experience/classifyediten/' + item.id">Edit</router-link>
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
  import pop from 'components/pop/pop'
  import toast from 'components/toast/toast'
  import util from 'components/tools/util'
  import api from 'components/tools/api-en'

  export default {
    data() {
      return {
        // items
        items: [],
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
    created() {
      this.getItems()
    },
    methods: {
      getItems() {
        this.axios(api.experienceClassify.query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            data.data.list.forEach((v) => {
              v.select = false
              this.items.push(v)
            })
            console.log(this.items)
          } else {
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
        this.axios(api.experienceClassify.delete(deleteIds)).then((res) => {
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
