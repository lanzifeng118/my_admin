<template>
  <div class="login">
    <div class="login-box">
      <h3 class="login-title">后台管理系统</h3>
      <div class="login-form">
        <div class="login-username">
          <span class="icon-people"></span>
          <input type="text" placeholder="请输入用户名" v-model.trim="user.username" @keyup="checkUsername()">
          <i class="login-warn" v-show="usernameWarn">请输入用户名</i>
        </div>
        <div class="login-password">
          <span class="icon-lock"></span>
          <input type="password" placeholder="请输入用密码" v-model="user.password" @keyup="checkPassword()">
          <i class="login-warn" v-show="passwordWarn">请输入密码</i>
        </div>
        <div class="login-submit">
          <button type="button" class="button" @click="submit">{{login.text}}</button>
          <i class="login-warn" v-show="login.failure">用户名或密码错误</i>
        </div>
      </div>
    </div>
    <div class="login-box-bottom">

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      usernameWarn: false,
      passwordWarn: false,
      login: {
        text: '登录',
        failure: false
      }
    }
  },
  mounted() {
    window.addEventListener('keyup', this.enterSubmit)
  },
  destroyed() {
    window.removeEventListener('keyup', this.enterSubmit)
  },
  methods: {
    checkUsername() {
      if (this.user.username !== '') {
        this.usernameWarn = false
        return true
      }
      return false
    },
    checkPassword() {
      if (this.user.password !== '') {
        this.passwordWarn = false
      }
    },
    enterSubmit(e) {
      if (e.keyCode === 13) {
        this.submit()
      }
    },
    submit() {
      let checkUsername = this.checkUsername()
      if (!checkUsername) {
        this.usernameWarn = true
        return
      }
      if (this.user.password === '') {
        this.passwordWarn = true
        return
      }
      this.usernameWarn = false
      this.passwordWarn = false
      this.login.failure = false
      this.login.text = '登录中...'
      this.axios({
        method: 'post',
        url: '/api/admin/login',
        data: this.user
      })
        .then(res => {
          let data = res.data
          if (data.code === '200') {
            this.login.text = '登录成功！'
            setTimeout(() => {
              let redirect = this.$route.query.redirect
              if (redirect) {
                this.$router.push(redirect)
              } else {
                this.$router.push('/admin/home')
              }
            }, 300)
          } else {
            this.login.text = '登录'
            this.login.failure = true
          }
        })
        .catch(error => {
          if (error) {
            this.$router.push('/error')
          }
        })
    }
  }
}
</script>

<style>
.login {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  background: #cdf5ff url(../../common/images/login-bg.png) no-repeat center
    bottom;
  color: #3f9bdc;
}
.login-box {
  position: absolute;
  z-index: 9;
  top: 50%;
  left: 50%;
  margin-top: -250px;
  margin-left: -200px;
  padding: 40px 0;
  width: 400px;
  border-radius: 2px;
  background-color: #fff;
}
.login-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;
}
.login-username,
.login-password {
  position: relative;
  width: 300px;
  margin: 0 auto 10px auto;
}
.login-username span,
.login-password span {
  position: absolute;
  top: 11px;
  left: 10px;
  font-size: 16px;
  margin-right: 15px;
  color: #ccc;
}
.login-username input,
.login-password input {
  width: 100%;
  height: 40px;
  padding-left: 35px;
  background-color: #fff;
  border-color: #e4e9ed;
  border-radius: 2px;
}
.login-submit {
  width: 300px;
  margin: 25px auto 0 auto;
}
.login-submit button {
  width: 100%;
  border-color: #41a8ed;
  background-color: #41a8ed;
  border-radius: 2px;
  height: 40px;
}
.login-box-bottom {
  position: absolute;
  background-color: #3f9bdc;
  top: 50%;
  left: 50%;
  margin-top: -95px;
  margin-left: -225px;
  width: 450px;
  height: 200px;
  border-radius: 2px;
}
.login-warn {
  display: inline-block;
  font-size: 12px;
  font-style: normal;
  color: #ff2323;
  margin-top: 2px;
}
</style>
