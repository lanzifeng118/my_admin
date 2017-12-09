<template>
  <div class="edit-pic">
    <div class="f-clearfix">
      <div
        class="edit-pic-box"
        :class="{logo : logo === 'true'}"
        :style="'width:' + boxWidth + 'px; height:' + boxHeight + 'px;line-height:' + boxHeightMin2 + 'px'"
      >
        <img
          v-show="img"
          :style="'max-width:' + boxWidthMin2 + 'px; max-height:' + boxHeightMin2 + 'px;'"
          :src="img"
        >
      </div>
      <p
        class="edit-pic-note"
        :style="'padding-top:' + paddingTop + 'px'"
      >
        {{note}}
      </p>
    </div>
    <div class="edit-upload">
      <label :for="id" class="button button-second">选择图片</label>
      <input type="file" :id="id" accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="choosePic">
      <button type="button" class="button button-second edit-delete" @click="deletePic">删除图片</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: String,
    note: String,
    id: String,
    boxWidth: {
      type: String,
      default: '400'
    },
    boxHeight: {
      type: String,
      default: '120'
    },
    logo: {
      type: String,
      default: 'false'
    }
  },
  computed: {
    boxHeightMin2() {
      return this.boxHeight - 2
    },
    boxWidthMin2() {
      return this.boxWidth - 2
    },
    paddingTop() {
      return this.boxHeight - 16
    }
  },
  methods: {
    choosePic(e) {
      this.$emit('choosePic', e)
    },
    deletePic() {
      this.$emit('deletePic')
    }
  }

}
</script>

<style>
.edit-pic-box {
  float: left;
  text-align: center;
  background: url(../../common/images/img-none.png) no-repeat center;
  font-size: 0;
  margin-bottom: 10px;
  border: 1px solid #f0f0f0;
  vertical-align: bottom;

}
.edit-pic-box.logo {
  background-image: url(../../common/images/logo-none.png)
}
.edit-pic-note {
  float: left;
  vertical-align: bottom;
  color: #999;
  font-size: 12px;
  padding-top: 108px;
  margin-left: 10px;
}
.edit-pic img {
  vertical-align: middle;
}
.edit-delete {
  margin-left: 5px;
}
</style>
