<template>
  <div class="banner">
    <div class="f-clearfix banner-top">
      <router-link :to="'/admin/' + type +'/banneredit'" class="f-right button" >
        <span class="icon icon-edit"></span>编辑
      </router-link>
    </div>
    <div class="display-table-wrap">
      <table>
        <tbody>
          <!-- link -->
          <tr>
            <td width="100">链接<span class="separate"></span></td>
            <td><a :href="item.link" target="_blank">{{item.link}}</a></td>
          </tr>
          <!-- img -->
          <tr>
            <td width="100" class="vertical-top">广告图<span class="separate"></span></td>
            <td><img v-if="item.img" :src="item.img" alt=""></td>
          </tr>
        </tbody>
      </table>
      <toast
        v-show="toast.show"
        :text="toast.text"
        :icon="toast.icon"
      >
      </toast>
    </div>
  </div>
</template>

<script>
  import toast from 'components/toast/toast'
  import api from 'components/tools/api'
  import util from 'components/tools/util'

  export default {
    props: ['type'],
    data() {
      return {
        // items
        item: {},
        // toast
        toast: {
          show: false,
          text: '',
          icon: ''
        }
      }
    },
    created() {
      this.getItems()
    },
    methods: {
      getItems() {
        let _this = this
        this.axios(api[this.type + 'Banner'].query()).then((res) => {
          let data = res.data
          if (data.code === '200') {
            _this.item = data.data
          } else {
            util.req.queryError(this.toast)
          }
        }).catch((err) => {
          if (err) {
            util.req.queryError(this.toast)
          }
        })
      }
    },
    components: {
      toast
    }
  }
</script>

<style>
.banner-top {
  margin-bottom: 20px;
}
.banner img {
  max-width: 800px;
  max-height: 180px;
}
</style>
