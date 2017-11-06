<template>
<div class="basic-info">
  <h2 class="basic-info-welcome">Hello，{{user.name}}！<span>The last time you login is {{user.lastlogintime}}</span></h2>
  <router-link to="/admin/home/enedit" class="basic-info-btn button" >
    <span class="icon icon-edit"></span>Edit
  </router-link>
  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100">Co. Name<span class="separate"></span></td>
          <td>{{basicInfo.name}}</td>
        </tr>
        <tr>
          <td class="vertical-middle">LOGO<span class="separate"></span></td>
          <td><img class="basic-info-img" :src="basicInfo.logo" alt=""></td>
        </tr>
        <tr>
          <td>Address<span class="separate"></span></td>
          <td>{{basicInfo.address}}</td>
        </tr>
        <tr>
          <td>Email<span class="separate"></span></td>
          <td>{{basicInfo.email}}</td>
        </tr>
        <tr>
          <td>Telephone<span class="separate"></span></td>
          <td>{{basicInfo.telephone}}</td>
        </tr>
        <tr>
          <td>Brief<span class="separate"></span></td>
          <td v-html="basicInfo.brief" class="basic-info-breif"></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      basicInfo: {
        name: '',
        address: '',
        email: '',
        telephone: '',
        logo: '',
        brief: ''
      }
    }
  },
  computed: {
    user() {
      return {
        name: this.$store.state.user.name,
        lastlogintime: this.$store.state.user.lastlogintime
      }
    }
  },
  created() {
    let _this = this
    _this.axios({
      method: 'post',
      url: '/api/admin/basicinfo',
      headers: {'content-type': 'application/json'},
      data: {
        method: 'get',
        language: 'en'
      }
    }).then((response) => {
      let data = response.data
      if (data.code === '200') {
        _this.basicInfo = data.data
      } else {
        console.log('出错了')
      }
    })
  }
}
</script>

<style>
@import "../common/basicInfo.css";
</style>
