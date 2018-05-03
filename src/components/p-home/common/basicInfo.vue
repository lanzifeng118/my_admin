<template>
<div class="basic-info">
  <!-- cn -->
  <h2 class="basic-info-welcome">
    {{lang === 'cn' ? '你好' : 'Hello'}}，{{user.username}}！</h2>
  <router-link v-if="lang === 'cn'" to="/admin/home/edit" class="basic-info-btn button" >
    <span class="icon icon-edit"></span>编辑
  </router-link>
  <router-link v-else to="/admin/home/editen" class="basic-info-btn button" >
    <span class="icon icon-edit"></span>Edit
  </router-link>

  <div class="display-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="100">{{lang === 'cn' ? '公司名称' : 'CO. Name'}}<span class="separate"></span></td>
          <td>{{item.name}}</td>
        </tr>
        <tr>
          <td width="100">{{lang === 'cn' ? '全称' : 'Full Name'}}<span class="separate"></span></td>
          <td>{{item.full_name}}</td>
        </tr>
        <tr>
          <td class="vertical-middle">LOGO<span class="separate"></span></td>
          <td><img class="basic-info-img" :src="item.logo" alt=""></td>
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '地址' : 'Address'}}<span class="separate"></span></td>
          <td>{{item.address}}</td>          
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '邮箱' : 'Email'}}<span class="separate"></span></td>
          <td>{{item.email}}</td>                    
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '电话' : 'Tel'}}<span class="separate"></span></td>
          <td>{{item.telephone}}</td>          
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '联系人' : 'Linkman'}}<span class="separate"></span></td>
          <td>{{item.linkman}}</td>                   
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '工作时间' : 'Work Time'}}<span class="separate"></span></td>
          <td>{{item.worktime}}</td>                   
        </tr>
        <tr>
          <td>{{lang === 'cn' ? '简介' : 'Breif'}}<span class="separate"></span></td>
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
    },
    api() {
      return this.lang === 'en' ? apiEn : api
    }
  },
  created() {
    this.getItem()
  },
  watch: {
    '$route' (to, from) {
      this.getItem()
    }
  },
  methods: {
    getItem() {
      this.axios(this.api.basicInfo.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          this.item = data.data
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
  }
}
</script>

<style>
.basic-info {
  position: relative;
}
.basic-info-welcome {
  text-align: right;
  font-size: 16px;
  color: #ccc;
  margin-bottom: 40px;
}
.basic-info-welcome span {
  font-size: 12px;
}
.basic-info-btn {
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
}
.basic-info-btn:hover {
  color: #fff;
}
.basic-info-breif {
  line-height: 1.8em;
}
.basic-info-img {
  max-width: 250px;
  max-height: 100px;
}
</style>
