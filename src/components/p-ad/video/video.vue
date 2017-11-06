<template>
<div class="ad-video">
  <div class="f-clearfix">
    <search class="f-left"></search>
    <button class="f-right button" @click="deleteAll">
      <span class="icon icon-delete"></span>一键删除
    </button>
    <label for="inputVideo" class="button f-right list-btn-add">
      <span class="icon icon-round_add"></span>添加视频
    </label>
    <input type="file" id="inputVideo" accept="video/mp4"
      @change="chooseVideo">
  </div>
  <div class="list-table-wrap">
    <div v-if="!hasItems" class="list-table-wrap-none">
      还没有相关信息，请添加
    </div>
    <table v-if="hasItems">
      <thead>
        <tr>
          <th width="150" @click="toggleSelectAll">
            <span :class="[thSelect ? 'icon-square_check_fill' : 'icon-square']"></span>
          </th>
          <th width="200">名称</th>
          <th>视频</th>
          <th width="200">上传时间</th>
          <th width="200">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items">
          <td
            class="pointer"
            @click="toggleSelect(index)"
            :class="{show: item.select}"
          >
            <span :class="[item.select ? 'icon-square_check_fill' : 'icon-square']"></span>
          </td>
          <td>{{item.title}}</td>
          <td class="ad-video-tdvideo">
            <video :src="item.url" width="320" height="180" class="pointer" @click="playVideo">
              浏览器不支持
            </video>
          </td>
          <td>{{item.createTime}}</td>
          <td>
            <a href="javascipt: void(0)" :data-index="index" @click="deleteOne">删除</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <pop
    text="确定要删除吗？"
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
  <toast
    v-show="toase.submitShow"
    :text="toase.submitText"
    :icon="toase.submitIcon"
  >
  </toast>
  <div class="ad-video-cancle" v-show="toase.submitCancleShow">
    <div class="ad-video-progress">
      <span :style="'width:'+percent+'%'"></span>
    </div>
    <div class="ad-video-cancle-btn" @click="submitCancle">
      <span class="icon-close"></span>
    </div>
  </div>
  <toast
    v-show="toase.chooseErrorShow"
    text="视频太大啦！"
  >
  </toast>
</div>
</template>

<script>
import toast from 'components/toast/toast'
import pop from 'components/pop/pop'
export default {
  data() {
    return {
      toastDeletAllShow: false,
      popDeleteAll: {
        show: false,
        items: []
      },
      // thSelect
      thSelect: false,

      // items
      items: [{id: '5412', title: '02', src: '', createTime: '2017', select: false}],
      hasItems: false,

      file: null,
      // toase
      toase: {
        chooseErrorShow: false,
        // submit
        submitCancleShow: false,
        submitShow: false,
        submitText: '正在上传...',
        submitIcon: 'upload'
      },
      // xhr
      xhr: null,
      percent: 0
    }
  },
  created() {
    this.getItems()
  },
  methods: {
    // toggleSelect
    toggleSelectAll() {
      this.thSelect = !this.thSelect
      this.items.forEach((value, index) => {
        value.select = this.thSelect
      })
    },
    toggleSelect(index) {
      this.items[index].select = !this.items[index].select
    },
    playVideo(e) {
      let video = e.target
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    getItems() {
      let _this = this
      _this.axios({
        method: 'post',
        url: '/api/admin/videoinfo',
        headers: {'content-type': 'application/json'},
        data: {
          method: 'get',
          language: 'cn'
        }
      }).then((response) => {
        let data = response.data
        if (data.code === '200') {
          _this.items = []
          data.data.forEach((value, index) => {
            let obj = {}
            obj.id = value.video_id
            obj.title = value.video_title
            obj.url = value.video_url
            obj.createTime = value.video_createtime
            obj.select = false
            _this.items.push(obj)
          })
          if (_this.items.length > 0) {
            _this.hasItems = true
          }
        }
      })
      // .catch(error => {
      //   if (error) {
      //     _this.$router.push('/error')
      //   }
      // })
    },
    deleteOne(e) {
      let index = e.target.getAttribute('data-index')
      let _this = this
      _this.popDeleteAll.items = []
      _this.popDeleteAll.items.push(_this.items[index].id)
      this.popDeleteAll.show = true
    },
    deleteAll() {
      let _this = this
      _this.popDeleteAll.items = []
      // 检查是否选中选项
      _this.items.forEach((value, index) => {
        if (value.select === true) {
          _this.popDeleteAll.items.push(value.id)
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
      let _this = this
      // ajax
      _this.sendDeletePost(_this.popDeleteAll.items)
    },
    sendDeletePost(arr) {
      let _this = this
      _this.popDeleteAll.show = false
      _this.setToaseSubmit('正在删除...', 'delete')
      _this.toase.submitShow = true
      _this.axios({
        method: 'post',
        url: '/api/admin/videoinfo',
        headers: {'content-type': 'application/json'},
        data: {
          method: 'delete',
          data: {
            language: 'cn',
            record: arr
          }
        }
      }).then((response) => {
        let data = response.data
        if (data.code === '200') {
          // 删除成功
          _this.showSuccess()
        } else {
          // 删除失败
          _this.showFailure()
        }
      })
    },
    closeDeleteAll() {
      this.popDeleteAll.show = false
    },
    chooseVideo(e) {
      let _this = this
      console.log('chooseVideo------')
      console.log(e.target.files)
      if (e.target.files[0]) {
        if (e.target.files[0].size <= 30*1024*1024) {
          _this.file = e.target.files[0]
          // submit
          _this.percent = 0
          _this.submit()
        } else {
          _this.toase.chooseErrorShow = true
          setTimeout(() => {
            _this.toase.chooseErrorShow = false
          }, 500)
        }
      }
    },
    submitCancle() {
      this.xhr.abort()
      this.toase.submitCancleShow = false
      this.toase.submitShow = false
      this.file = null
    },
    submit() {
      let _this = this
      if (_this.file) {
        _this.setToaseSubmit('正在上传...', 'upload')
        this.toase.submitCancleShow = true
        _this.toase.submitShow = true
        let formData = new FormData()
        formData.append('upload', this.file)
        // xhr
        _this.xhr = new XMLHttpRequest()
        // 上传中
        _this.xhr.upload.addEventListener('progress', function(e) {
          _this.percent = Math.floor(e.loaded / e.total * 100)
        }, false)
        // 文件上传成功或是失败
        _this.xhr.onreadystatechange = function() {
          if (_this.xhr.readyState === 4) {
            if (_this.xhr.status === 200) {
              let data = JSON.parse(_this.xhr.responseText)
              if (data.code === '200') {
                // 发add请求
                _this.sendInfo(data.url)
              } else {
                _this.showFailure()
              }
            }
          }
        }
        // 开始上传
        _this.xhr.open('POST', '/api/admin/upload', true)
        _this.xhr.send(formData)
      }
    },
    sendInfo(url) {
      let _this = this
      let title = _this.file.name.slice(0, -4)
      let obj = {
        title: title,
        url: url,
        language: 'cn'
      }
      _this.axios({
        method: 'post',
        url: '/api/admin/videoinfo',
        headers: {'Content-Type': 'application/json'},
        data: {
          method: 'add',
          data: obj
        }
      }).then((response) => {
        let data = response.data
        if (data.code === '200') {
          this.toase.submitCancleShow = false
          _this.showSuccess()
        } else {
          this.toase.submitCancleShow = false
          _this.showFailure()
        }
      })
    },
    showFailure() {
      let _this = this
      _this.setToaseSubmit('出错了！', 'sad')
      setTimeout(() => {
        _this.toase.submitShow = false
      }, 500)
    },
    showSuccess(cb) {
      let _this = this
      _this.setToaseSubmit('成功啦！', 'appreciate')
      setTimeout(() => {
        _this.toase.submitShow = false
        _this.$router.go(0)
      }, 500)
    },
    setToaseSubmit(txex, icon) {
      this.toase.submitText = txex
      this.toase.submitIcon = icon
    }
  },
  components: {
    toast,
    pop
  }
}
</script>

<style>
.ad-video .list-table-wrap td {
  vertical-align: middle;
}
.ad-video .list-table-wrap td.ad-video-tdvideo {
  line-height: 0;
}
.ad-video-cancle {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}
.ad-video-cancle button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px;
  margin-left: -175px;
  margin-top: 50px;
  background-color: #e29800;
}
.ad-video-cancle-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  text-align: center;
  margin-left: -20px;
  margin-top: 55px;
  background-color: #e29800;
  color: #fff;
  font-size: 20px;
}
.ad-video-cancle-btn span {
  line-height: 40px;
}
.ad-video-progress {
  position: absolute;
  width: 350px;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  top: 50%;
  left: 50%;
  margin-left: -175px;
  margin-top: 5px;
  background: #4f4f4f;
}
.ad-video-progress span {
  display: block;
  height: 20px;
  background: #07efd9;
  transition: all 0.2s;
}
</style>
