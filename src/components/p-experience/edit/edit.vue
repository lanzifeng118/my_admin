<template>
<div class="product-edit edit">
  <h2 class="edit-h2" v-if="!typeAdd">编辑产品</h2>
  <h2 class="edit-h2" v-if="typeAdd">添加产品</h2>
  <router-link to="/admin/product/list" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90"><span class="icon-nessisary"></span>经验名称</td>
          <td><input type="text" v-model="item.name"></td>
        </tr>
        <tr>
          <td>顺序</td>
          <td><input type="text" v-model="item.order"></td>
        </tr>
        <tr>
          <td>分类</td>
          <td>
            <select v-model="item.classify">
              <option disabled value="">选择分类</option>
              <option>Phoenix</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>图片</td>
          <td class="pdf">
            <button type="button" class="button button-second"><span class="icon icon-round_add"></span>添加PDF</button>
            <p class="pdf-box" v-for="pdf in item.pdf">
              {{pdf.name}}
              <span class="icon-round_close_fill"></span>
            </p>
        </td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">提交</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <toast
    v-show="toastA.show"
    :text="toastA.text"
    :icon="toastA.icon"
  >
  </toast>
  <toast
    v-show="toase.submitShow"
    text="正在提交..."
    icon="upload"
  >
  </toast>
  </toast>
</div>
</template>

<script>
import toast from 'components/toast/toast'
export default {
  data() {
    return {
      typeAdd: true,
      item: {
        name: '',
        pic: '',
        order: '',
        pdf: [],
        brief: '',
        classify: '',
        detail: ''
      },
      // file
      file: null,
      // toastA
      toastA: {
        show: false,
        text: '',
        icon: ''
      },
      // submit
      toase: {
        submitShow: false
      }
    }
  },
  created() {
    this.getItem()
  },
  methods: {
    getItem() {
      if (this.$route.path === '/admin/product/add') {
        return
      }
      this.typeAdd = false
      this.item = {id: '1', name: 'Phoenix', pic: '/static/images/prodct-phoenix-01.jpg', order: '1', classify: 'Phoenix', brief: 'Vantage solutions unify Phoenix Controls suite of scalable products for airflow control and system integration, monitoring, and management. The products range from precision valve controllers to network integration hardware and front-end displays of actionable data. Applications are standalone or implemented at the room, floor.', detail: '<p>Many times during an HVAC project implementation, the building management system (BMS) vendor suggests providing their generic controller for controlling third party devices such as air flow control valves. While this may reduce the upfront third party integration</p>', pdf: [{name: 'components.pdf'}, {name: 'toast.pdf'}]}
    },
    chooseLogo(e) {
      let _this = this
      _this.file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(_this.file)
      reader.onload = function(e) {
        _this.item.logo = e.target.result
      }
    },
    deleteLogo() {
      if (this.item.logo !== '') {
        this.item.logo = ''
      }
    },
    submit() {
      let _this = this
      // 如果上传了图片
      if (!this.verify()) {
        return
      }
      _this.toase.submitShow = true
      if (_this.file) {
        let formData = new FormData()
        formData.append('upload', this.file)
        _this.axios({
          method: 'post',
          url: '/api/admin/upload',
          headers: {'content-type': 'multipart/form-data'},
          data: formData
        }).then((response) => {
          let data = response.data
          if (data.code === '200') {
            _this.item.logo = data.url
            _this.sendData()
          } else {
            _this.showError()
          }
        }).catch(() => {
          _this.showError()
        })
      } else {
        _this.sendData()
      }
    },
    verify() {
      if (!this.item.name) {
        this.showToast('分类名称不能为空')
        return false
      }
      if (this.item.order && !/^\d+$/.test(this.item.order)) {
        this.showToast('顺序必须为数字')
        return false
      }
      return true
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = {
          method: 'post',
          url: '/api/admin/basicinfo'
        }
      } else {
        obj = {
          method: 'post',
          url: '/api/admin/basicinfo',
          data: {
            method: 'modify',
            language: 'cn',
            data: _this.item
          }
        }
      }
      _this.axios(obj).then((response) => {
        let data = response.data
        if (data.code === '200') {
          _this.showSuccess()
        } else {
          _this.showError()
        }
      }).catch(() => {
        _this.showError()
      })
    },
    showError() {
      this.toase.submitShow = false
      this.showToast('出错了，请稍后再试！', 'sad')
    },
    showSuccess() {
      this.toase.submitShow = false
      this.showToast('提交成功！', 'appreciate', 600, () => {
        this.$router.push('/admin/product/list')
      })
    },
    showToast(text, icon, time, callback) {
      let _this = this
      time = time || 600
      _this.toastA.show = true
      _this.toastA.text = text || ''
      _this.toastA.icon = icon || 'warn'
      setTimeout(() => {
        _this.toastA.show = false
        if (typeof (callback) === 'function') {
          callback()
        }
      }, time)
    }
  },
  components: {
    toast
  }
}
</script>

<style>
.product-edit .edit-img {

}
.product-edit .edit-img img {
  max-width: 240px;
  max-height: 180px;
}
.product-edit .edit-img span {
  left: 265px;
}
</style>
