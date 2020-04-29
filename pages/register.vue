<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
          <em class="bold">已有美团账号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email"></el-input>
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="registerForm.code"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="registerForm.pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="registerForm.cpwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register"
            >同意以下协议并注册</el-button
          >
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="https://rules-center.meituan.com/rules-detail/4"
            target="_blank"
            >《美团点评用户服务协议》</a
          >
          <a
            class="f1"
            href="https://rules-center.meituan.com/rules-detail/2"
            target="_blank"
            >《美团点评隐私政策》</a
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  layout: 'blank',
  data() {
    return {
      //注册表单对象
      registerForm: {
        name: '',
        email: '',
        code: '',
        pwd: '',
        cpwd: ''
      },
      //注册表单验证规则对象
      registerRules: {
        name: [
          {
            required: true,
            type: 'string',
            message: '请输入用户名',
            trigger: 'blur'
          },
          { min: 5, max: 11, message: '长度在 5 到 11 个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        pwd: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        cpwd: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.registerForm.pwd) {
                callback(new Error('两次输入的密码不一致，请重新输入'))
              } else {
                callback()
              }
            }
          }
        ],
        code: [
          { required: true, message: '请输入动态码', trigger: 'blur' },
          { min: 4, message: '长度在 4 个字符', trigger: 'blur' }
        ]
      },
      statusMsg: '',
      error: ''
    }
  },
  methods: {
    //发送验证码
    async sendMsg() {
      let namePass
      let emailPass
      if (this.timerid) {
        return false
      }
      this.$refs['registerRef'].validateField('name', valid => {
        namePass = valid
      })
      this.statusMsg = ''
      if (namePass) {
        return false
      }
      this.$refs['registerRef'].validateField('email', valid => {
        emailPass = valid
      })
      if (!namePass && !emailPass) {
        const { data, status } = await this.$axios.post('/users/verify', {
          username: encodeURIComponent(this.registerForm.name),
          email: this.registerForm.email
        })
        //    console.log(data,status);
        if (status === 200 && data && data.code === 0) {
          let count = 60
          this.statusMsg = `验证码已发送，剩余${count--}秒`
          this.timerid = setInterval(() => {
            this.statusMsg = `验证码已发送，剩余${count--}秒`
            if (count === 0) {
              clearInterval(this.timerid)
            }
          }, 1000)
        } else {
          this.statusMsg = data.msg
        }
      }
    },
    //点击注册按钮触发得事件
    register() {
      this.$refs.registerRef.validate(async valid => {
        if (!valid) return
        const { data, status } = await this.$axios.post('/users/signup', {
          username: window.encodeURIComponent(this.registerForm.name),
          password: CryptoJS.MD5(this.registerForm.pwd).toString(),
          email: this.registerForm.email,
          code: this.registerForm.code
        })
        if (status === 200) {
          if (data && data.code === 0) {
            //强制跳转到登录页面
            location.href = '/login'
          } else {
            self.error = data.msg
          }
        } else {
          self.error = `服务器出错，错误码:${status}`
        }
        //定时清空error
        setTimeout(function() {
          self.error = ''
        }, 1500)
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/register/index.scss';
</style>
