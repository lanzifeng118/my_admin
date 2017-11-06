<template>
  <div class="info-list">
    <div class="f-clearfix">
      <!-- search -->
      <div class="search">
        <input class="search-input" v-model="searchText" placeholder="输入查找内容">
        <span class="search-icon icon-search" @click="searchSubmit"></span>
      </div>
      <button class="f-right button" @click="deleteAll">
        <span class="icon icon-delete"></span>一键删除
      </button>
      <router-link to="/admin/aboutus/add" class="f-right button list-btn-add">
        <span class="icon icon-round_add"></span>添加
      </router-link >
    </div>
    <div class="list-table-wrap">
      <div v-if="!hasItems" class="list-table-wrap-none">
        还没有相关信息，请添加
      </div>
      <table v-if="hasItems">
        <thead>
          <tr>
            <!-- selectAll -->
            <th
              width="100"
              @click="toggleSelectAll"
              class="pointer"
            >
              <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
            </th>
            <th>名称</th>
            <th width="150">显示</th>
            <th width="220" class="list-th-time">
              <p>发布时间</p>
              <div class="list-th-time-triangle">
                <span
                  :class="{active: itemsOrder.createTime.asc}"
                  class="icon icon-triangle_up_fill" @click="getItems('aboutus_createtime', 'asc')">
                </span>
                <span
                  :class="{active: itemsOrder.createTime.desc}"
                  class="icon icon-triangle_down_fill"
                  @click="getItems('aboutus_createtime', 'desc')">
                </span>
              </div>
            </th>
            <th width="220" class="list-th-time">
              <p>修改时间</p>
              <div class="list-th-time-triangle">
                <span
                  class="icon icon-triangle_up_fill"
                  :class="{active: itemsOrder.modifyTime.asc}"
                  @click="getItems('aboutus_modifytime', 'asc')"
                >
                </span>
                <span
                  class="icon icon-triangle_down_fill"
                  :class="{active: itemsOrder.modifyTime.desc}"
                  @click="getItems('aboutus_modifytime', 'desc')"
                >
                </span>
              </div>
            </th>
            <th width="200">操作</th>
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
            <td>{{item.title}}</td>
            <!-- show -->
            <td
              class="pointer"
              :class="[item.show ? 'show' : 'not-show']"
              @click="toggleShow(index)"
            >
              <span class="icon-check"></span>
            </td>

            <td>{{item.createTime}}</td>
            <td>{{item.modifyTime}}</td>
            <td>
              <a href="#" target="_blank">浏览</a> | <router-link :to="'/admin/aboutus/edit/' + item.id">编辑</router-link> | <a href="javascipt: void(0)">删除</a>
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
      v-show="toastDeletAllShow"
      text="没有选择项目哦！"
    >
    </toast>
  </div>
</template>

<script>
  import search from 'components/search/search'
  import pop from 'components/pop/pop'
  import toast from 'components/toast/toast'

  export default {
    data() {
      return {
        // items
        hasItems: false,
        items: [],
        itemsOrder: {
          createTime: {
            desc: false,
            asc: false
          },
          modifyTime: {
            desc: false,
            asc: false
          }
        },
        searchText: '',

        thSelect: false,
        // delete
        toastDeletAllShow: false,
        popDeleteAll: {
          show: false,
          items: []
        }
      }
    },
    created() {
      this.getItems('aboutus_modifytime', 'desc')
    },
    components: {
      search,
      pop,
      toast
    },
    methods: {
      searchSubmit() {
        this.getItems('aboutus_modifytime', 'desc', this.searchText)
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
        this.items[index].show = !this.items[index].show
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
          _this.toastDeletAllShow = true
          setTimeout(() => {
            _this.toastDeletAllShow = false
          }, 600)
          return
        }
        this.popDeleteAll.show = true
      },
      confirmDeleteAll() {
        // ajax
        this.popDeleteAll.show = false
      },
      closeDeleteAll() {
        this.popDeleteAll.show = false
      },
      getItems(sortcolumn, sorttype, keyword) {
        let _this = this
        _this.axios({
          method: 'post',
          url: '/api/admin/aboutus',
          headers: {'content-type': 'application/json'},
          data: {
            method: 'get',
            language: 'cn',
            sortcolumn: sortcolumn,
            sorttype: sorttype,
            keyword: keyword || ''
          }
        }).then((res) => {
          let data = res.data
          if (data.code === '200') {
            _this.items = []
            data.data.forEach((value, index) => {
              let obj = {}
              obj.id = value.aboutus_id
              obj.title = value.aboutus_title
              obj.createTime = value.aboutus_createtime
              obj.modifyTime = value.aboutus_modifytime
              obj.select = false
              if (value.aboutus_diplay === 'Y') {
                obj.show = true
              } else {
                obj.show = false
              }
              _this.items.push(obj)
            })
            if (_this.items.length > 0) {
              _this.hasItems = true
              if (sortcolumn === 'aboutus_modifytime') {
                if (sorttype === 'desc') {
                  _this.itemsOrder.modifyTime.desc = true
                  _this.itemsOrder.modifyTime.asc = false
                  _this.itemsOrder.createTime.desc = false
                  _this.itemsOrder.createTime.asc = false
                } else {
                  _this.itemsOrder.modifyTime.desc = false
                  _this.itemsOrder.modifyTime.asc = true
                  _this.itemsOrder.createTime.desc = false
                  _this.itemsOrder.createTime.asc = false
                }
              } else {
                if (sorttype === 'desc') {
                  _this.itemsOrder.modifyTime.desc = false
                  _this.itemsOrder.modifyTime.asc = false
                  _this.itemsOrder.createTime.desc = true
                  _this.itemsOrder.createTime.asc = false
                } else {
                  _this.itemsOrder.modifyTime.desc = false
                  _this.itemsOrder.modifyTime.asc = false
                  _this.itemsOrder.createTime.desc = false
                  _this.itemsOrder.createTime.asc = true
                }
              }
            }
          } else {
            //
            console.log('系统繁忙')
          }
        })
        // .catch(error => {
        //   if (error) {
        //     _this.$router.push('/error')
        //   }
        // })
      }
    }
  }
</script>

<style>
.info-list {

}
</style>
