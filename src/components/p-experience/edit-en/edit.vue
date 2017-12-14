<template>
<div class="product-edit edit">
  <h2 class="edit-h2" v-if="!typeAdd">Edit Experience</h2>
  <h2 class="edit-h2" v-if="typeAdd">Add Experience</h2>
  <router-link to="/admin/experience/listen" class="edit-close-btn" >
    <span class="icon-round_close_fill"></span>
  </router-link>
  <div class="edit-table-wrap">
    <table>
      <tbody>
        <tr>
          <td width="90"><span class="icon-nessisary"></span>Name</td>
          <td><input type="text" v-model="item.name"></td>
        </tr>
        <!-- 显示 -->
        <tr>
          <td width="90" class="vertical-middle">Display</td>
          <td class="show">
            <span
              :class="[item.display === 'Y' ? 'icon-square_check_fill' : 'icon-square']"
              @click="toggleDisplay"
            >
            </span>
          </td>
        </tr>
        <tr>
          <td>Order</td>
          <td><input type="text" v-model="item.sort"></td>
        </tr>
        <tr>
          <td>Logo</td>
          <td>
            <!-- add  -->
            <label for="addLogo" class="button button-second">添加图片</label>
            <input type="file" id="addLogo" accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="addLogo">
            <ul class="experience-eidt-logo-ul f-clearfix">
              <li class="experience-eidt-logo-li" v-for="(logo, index) in item.logo">
                <div class="experience-eidt-logo-img">
                  <img :src="logo.img">
                  <!-- changeLogo -->
                  <label :for="'logo' + index">选择图片</label>
                  <input type="file" :id="'logo' + index" accept="image/png, image/jpeg, image/gif, image/jpg"
                  @change="changeLogo(index, $event)">
                </div>
                <div class="experience-eidt-logo-input">
                  分类<select v-model="logo.classify">
                    <option disabled value="">Choose Classify</option>
                    <option v-for="classifyItem in classify">{{classifyItem.name}}</option>
                  </select>
                </div>
                <div class="experience-eidt-logo-input">
                  顺序<input type="text" v-model="logo.sort">
                </div>
                <!-- delete ad -->
                <span class="icon-round_close_fill" @click="deleteLogo(index)"></span>
              </li>
            </ul>
        </td>
        </tr>
        <tr>
          <td></td>
          <td><button type="button" class="button" @click="submit">Submit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  <toast
    v-show="toast.show"
    :text="toast.text"
    :icon="toast.icon"
  >
  </toast>
</div>
</template>

<script>
import toast from 'components/toast/toast'
import util from 'components/tools/util'
import api from 'components/tools/api-en'
export default {
  data() {
    return {
      typeAdd: true,
      item: {
        name: '',
        logo: [],
        sort: '',
        display: 'Y'
      },
      // classify
      classify: [],
      // editor
      editorOption: { // 编辑器的配置
        placeholder: '输入内容...',
        modules: {
          toolbar: this.$store.state.quillEditor.nomal
        }
      },
      // file
      file: null,
      // toast
      toast: {
        show: false,
        text: '',
        icon: ''
      },
      // percent
      percent: {
        show: 'false',
        progress: 0
      }
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
      this.getClassiy()
      if (this.$route.path === '/admin/experience/adden') {
        return
      }
      this.typeAdd = false
      let _this = this
      let id = this.$route.params.id
      this.axios(api.experienceList.queryById(id)).then((res) => {
        let data = res.data
        console.log(data)
        if (data.code === '200') {
          if (data.data) {
            _this.item = data.data
          } else {
            util.toast.show(_this.toast, '此产品不存在', 'close')
            this.goBack()
          }
        }
      }).catch((err) => {
        if (err) {
          console.log(err)
          _this.queryErrorGoBack()
        }
      })
    },
    getClassiy() {
      let _this = this
      this.axios(api.experienceClassify.query()).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.classify = data.data.list
        } else {
          // _this.queryErrorGoBack()
        }
      }).catch((err) => {
        if (err) {
          // _this.queryErrorGoBack()
        }
      })
    },
    // Logo
    addLogo(e) {
      let _this = this
      this.uploadFile(e.target.files[0], (url) => {
        _this.item.logo.push({img: url, link: '', sort: '', lang: 'cn'})
      })
    },
    changeLogo(index, e) {
      let _this = this
      console.log(index)
      this.uploadFile(e.target.files[0], (url) => {
        _this.item.logo[index].img = url
      })
    },
    deleteLogo(index) {
      this.item.logo.splice(index, 1)
    },
    toggleDisplay() {
      if (this.item.display === 'Y') {
        this.item.display = 'N'
      } else {
        this.item.display = 'Y'
      }
    },
    submit() {
      if (!this.verify()) {
        return
      }
      util.toast.show(this.toast, '正在提交', 'upload')
      this.sendData()
    },
    sendData() {
      let _this = this
      let obj = null
      if (this.typeAdd) {
        obj = api.experienceList.insert(this.item)
      } else {
        obj = api.experienceList.update(this.item)
      }
      console.log(obj)
      this.axios(obj).then((res) => {
        let data = res.data
        if (data.code === '200') {
          _this.showSuccess()
        } else if (data.code === '400') {
          util.toast.fade(this.toast, '项目经验名称已存在', 'close')
        } else {
          util.req.changeError(_this.toast)
        }
      }).catch((err) => {
        if (err) {
          util.req.changeError(_this.toast)
        }
      })
    },
    verify() {
      if (!this.item.name) {
        util.toast.fade(this.toast, '项目经验名称不能为空')
        return false
      }
      if (this.item.sort && !util.isNum(this.item.sort)) {
        util.toast.fade(this.toast, '顺序必须为数字')
        return false
      }
      return true
    },
    showError() {
      util.toast.fade(this.toast, '出错了，请稍后再试!', 'sad')
    },
    showSuccess() {
      util.toast.show(this.toast, '提交成功！', 'appreciate')
      this.goBack()
    },
    goBack() {
      let _this = this
      setTimeout(() => {
        _this.$router.push('/admin/experience/listen')
      }, 700)
    },
    uploadFile(file, callback) {
      let _this = this
      util.uploadFile(this, file, callback, () => {
        _this.showError()
      })
    },
    sendPic(file, key, callback) {
      let _this = this
      if (file) {
        this.uploadFile(file, (url) => {
          _this.item[key] = url
          callback()
        })
      } else {
        callback()
      }
    },
    queryErrorGoBack() {
      util.req.queryError(this.toast)
      this.goBack()
    }
  },
  components: {
    toast
  }
}
</script>

<style>
.experience-eidt-logo-li {
  border: 1px solid #f1f1f1;
  padding: 10px;
  line-height: 0;
  position: relative;
  margin-top: 13px;
  margin-right: 15px;
  float: left;
  width: 200px;
}
.experience-eidt-logo-img {
  position: relative;
  z-index: 9;
  height: 73px;
  overflow: hidden;

}
.experience-eidt-logo-li img {
  width: 100%;
}
.experience-eidt-logo-img label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 73px;
  line-height: 73px;
  text-align: center;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  opacity: 0;
  transition: all 0.2s;
}
.experience-eidt-logo-img:hover label{
  opacity: 1;
  font-size: 16px;
}

.experience-eidt-logo-li:nth-child(4n) {
  margin-right: 0;
}

.experience-eidt-logo-input {
  margin-top: 10px;
  text-align: center;
}
.experience-eidt-logo-input input,
.experience-eidt-logo-input select {
  margin-left: 8px;
  width: 125px;
}
.experience-eidt-logo-li .icon-round_close_fill {
  cursor: pointer;
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 10;
  font-size: 22px;
  transition: all 0.2s;
}
.experience-eidt-logo-li .icon-round_close_fill:hover {
  color: #00d0bc;
}
</style>
