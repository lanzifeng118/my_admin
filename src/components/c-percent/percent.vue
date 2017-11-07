<template>
  <div class="ad-video-cancle" v-show="show">
    <div class="ad-video-progress">
      <span :style="'width:'+percent+'%'"></span>
    </div>
    <div class="ad-video-cancle-btn" @click="submitCancle">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  import toast from 'components/toast/toast'
  import api from 'components/tools/api'
  import util from 'components/tools/util'

  export default {
    props: ['show', 'percent'],
    data() {

    },
    created() {
    },
    methods: {

    },
    components: {
      toast
    }
  }
</script>

<style>
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
