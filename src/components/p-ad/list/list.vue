<template>
  <div class="ad-list">
    <div class="ad-list-box">
      <h1>首页轮播图</h1>
      <ul class="ad-list-ul ad-list-ul-home f-clearfix">
        <li class="ad-list-img" v-for="homeItem in home">
          <img :src="homeItem.img" alt="">
          <a :href="homeItem.link" v-if="homeItem.link">{{homeItem.link}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      home: [
        {img: '/static/images/banner-01.jpg', link: 'admin/ad/list'},
        {img: '/static/images/banner-02.jpg', link: ''},
        {img: '/static/images/banner-02.jpg', link: ''},
        {img: '/static/images/banner-02.jpg', link: ''},
        {img: '/static/images/banner-02.jpg', link: ''},
        {img: '/static/images/banner-03.jpg', link: 'admin/ad/list'}
      ],
      product: {

      }
    }
  },
  components: {
  }
}
</script>

<style>
.ad-list-box {
  border: 1px solid #efefef;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 3px;
}
.ad-list-box h1 {
}
.ad-list-ul img {
  width: 100%;
}
.ad-list-ul li {
  line-height: 0;
  position: relative;
  width: 276px;
  margin-top: 15px;
  margin-right: 13px;
  float: left;
  overflow: hidden;
}
.ad-list-ul-home li {
  width: 276px;
  height: 134px;
}
.ad-list-ul li:nth-child(4n) {
  margin-right: 0;
}
.ad-list-ul a {
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  line-height: 134px;
  text-align: center;
  vertical-align: middle;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  text-decoration: underline;
  opacity: 0;
  transition: all 0.2s;
}
.ad-list-ul li:hover a{
  font-size: 16px;
  opacity: 1;
}
</style>
