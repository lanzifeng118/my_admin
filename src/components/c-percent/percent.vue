<template>
  <div class="percent" v-show="show === 'true'">
    <div class="percent-progress">
      <span :style="'width:'+ progress +'%'"></span>
    </div>
    <div class="percent-btn" @click="cancle">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['show', 'progress'],
    created() {
    },
    methods: {
      cancle() {
        this.$emit('cancle')
      }
    },
    components: {
    }
  }
</script>

<style>
.percent {
  position: fixed;
  z-index: 9;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
}
.percent button {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 350px;
  margin-left: -175px;
  margin-top: 50px;
  background-color: #e29800;
}
.percent-btn {
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
  cursor: pointer;
}
.percent-btn span {
  line-height: 40px;
}
.percent-progress {
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
.percent-progress span {
  display: block;
  width: 0;
  height: 20px;
  background: #07efd9;
}
</style>
