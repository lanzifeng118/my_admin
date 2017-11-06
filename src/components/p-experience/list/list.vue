<template>
  <div class="experience-list">
    <div class="f-clearfix">
      <!-- search -->
      <div class="search f-left">
        <input class="search-input" v-model="searchText" placeholder="输入查找内容">
        <span class="search-icon icon-search" @click="searchSubmit"></span>
      </div>
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
      <router-link to="/admin/experience/add" class="f-right button list-btn-add">
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
            <th width="120">排序</th>
            <th>名称</th>
            <th width="110">显示</th>
            <th width="320">分类</th>
            <th width="135">创建时间</th>
            <th width="140">操作</th>
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
              <input type="text" v-model.lazy="orderValue[index]" @change="changeOrder(index)">
            </td>
            <!-- name -->
            <td>{{item.title}}</td>
            <!-- show -->
            <td
              class="pointer"
              :class="[item.display ? 'show' : 'not-show']"
              @click="toggleShow(index)"
            >
              <span class="icon-check"></span>
            </td>
            <!-- classify -->
            <td class="classify">
              <p v-for="itemC in item.classify">
                <span>{{itemC}}</span>
              </p>
            </td>
            <td>{{item.createTime}}</td>
            <td class="link">
              <router-link :to="'/admin/experience/edit/' + item.id">编辑</router-link><span class="icon-cutting_line"></span><a href="javascipt: void(0)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pop
      text="确定要删除所选项目？"
      type="warning"
      v-show="popDeleteAll.show"
      @confirm="confirmDeleteAll"
      @close="closeDeleteAll"
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

  export default {
    data() {
      return {
        // items
        items: [],
        searchText: '',
        thSelect: false,
        // order
        orderValue: [],
        // toast
        toast: {
          show: false,
          text: '',
          icon: ''
        },
        popDeleteAll: {
          show: false,
          items: []
        }
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      searchSubmit() {
        this.getItems(this.searchText)
      },
      toggleSelectAll() {
        this.thSelect = !this.thSelect
        this.items.forEach((value, index) => {
          value.select = this.thSelect
        })
      },
      toggleSelect(index) {
        this.items[index].select = !this.items[index].select
      },
      toggleShow(index) {
        // ajax
        this.items[index].display = !this.items[index].display
      },
      deleteAll() {
        let _this = this
        _this.popDeleteAll.items = []
        // 检查是否选中选项
        _this.items.forEach((value, index) => {
          if (value.select === true) {
            _this.popDeleteAll.items.push(index)
          }
        })
        if (_this.popDeleteAll.items.length <=0) {
          this.showToast('请选择需要删除的项目', 'warn')
          return
        }
        this.popDeleteAll.show = true
      },
      confirmDeleteAll() {
        // ajax
        this.popDeleteAll.show = false
        this.showToast('删除成功', 'check')
      },
      closeDeleteAll() {
        this.popDeleteAll.show = false
      },
      // 顺序
      changeOrder(index) {
        let value = this.orderValue[index]
        if (this.isNum(value)) {
          if (value !== this.items[index].order) {
            // ajax
          }
        } else {
          this.showToast('请输入数字', 'close')
          this.$set(this.orderValue, index, this.items[index].order)
        }
      },
      getItems(keyword) {
        let _this = this
        this.axios({
          method: 'post',
          url: '/api/admin/experienceList',
          data: {
            method: 'get',
            language: 'cn',
            keyword: keyword || ''
          }
        }).then((res) => {
          let data = res.data
          if (data.code === '200') {
            let list = data.data.list
            if (list.length > 0) {
              list.forEach((v, i) => {
                v.select = false
              })
              _this.items = list
              _this.items.forEach((v, i) => {
                _this.orderValue.push(v.order)
              })
              console.log(_this.order)
            }
          } else {
            console.log('系统繁忙')
          }
        }).catch(error => {
          if (error) {
            _this.$router.push('/error')
          }
        })
      },
      showToast(text, icon, time) {
        let _this = this
        time = time || 650
        _this.toast.show = true
        _this.toast.text = text
        _this.toast.icon = icon
        setTimeout(() => {
          _this.toast.show = false
        }, time)
      },
      isNum(obj) {
        return /^\d+$/.test(obj)
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
