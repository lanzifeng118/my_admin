<template>
<div class="basic-info">
  <h2 class="basic-info-welcome">Hello，{{user.username}}！</h2>
  <router-link to="/admin/home/edit/en" class="basic-info-btn button" >
    <span class="icon icon-edit"></span>Edit
  </router-link>
  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100">CO. Name<span class="separate"></span></td>
          <td>{{item.name}}</td>
        </tr>
        <tr>
          <td width="100">Full Name<span class="separate"></span></td>
          <td>{{item.full_name}}</td>
        </tr>
        <tr>
          <td class="vertical-middle">Logo<span class="separate"></span></td>
          <td><img class="basic-info-img" :src="item.logo" alt=""></td>
        </tr>
        <tr>
          <td>Address<span class="separate"></span></td>
          <td>{{item.address}}</td>
        </tr>
        <tr>
          <td>Email<span class="separate"></span></td>
          <td>{{item.email}}</td>
        </tr>
        <tr>
          <td>Tel<span class="separate"></span></td>
          <td>{{item.telephone}}</td>
        </tr>
        <tr>
          <td>Linkman<span class="separate"></span></td>
          <td>{{item.linkman}}</td>
        </tr>
        <tr>
          <td>Work Time<span class="separate"></span></td>
          <td>{{item.worktime}}</td>
        </tr>
        <tr>
          <td>Ad<span class="separate"></span></td>
          <td>
            <ul class="basic-info-banner-ul f-clearfix">
              <li class="basic-info-banner-li" v-for="banner in item.banner">
                <img :src="banner.img" alt="">
                <a :href="banner.link" v-if="banner.link" target="_blank">{{banner.link}}</a>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>Breif<span class="separate"></span></td>
          <td v-html="item.brief" class="basic-info-breif"></td>
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
import api from 'components/tools/api-en'
import util from 'components/tools/util'

export default {
  data() {
    return {
      item: {},
      toast: {
        show: false,
        text: '',
        icon: ''
      }
    }
  },
  computed: {
    user() {
      return {
        username: this.$store.state.user.username
      }
    }
  },
  created() {
    this.axios(api.basicInfo.query()).then((res) => {
      let data = res.data
      if (data.code === '200') {
        this.item = data.data
      } else {
        util.req.queryError(this.toast)
      }
    }).catch((error) => {
      if (error) {
        util.req.queryError(this.toast)
      }
    })
  },
  components: {
    toast
  }
}
</script>

<style>
@import "../common/basicInfo.css";
</style>
