<template>
  <div class="login">
    <el-form
      :model="loginObj"
      status-icon
      ref="ruleForm"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input type="text" autocomplete="off" v-model="loginObj.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="Pass">
        <el-input type="password" autocomplete="off" v-model="loginObj.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginObj: {
        username: "admin",
        password: "123456"
      }
    };
  },
  methods: {
    async login() {
      var res = await this.$http.post("login", this.loginObj);
      //   console.log(res);
      var {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        //保存token
        window.localStorage.setItem("token", data.token);
        this.$message({
          message: msg,
          type: "success"
        });
        this.$router.push("/");
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.login {
  position: relative;
}
.el-form {
  width: 500px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 20%);
  padding: 40px;
}
.btn {
  width: 100%;
  font-size: 20px;
}
</style>
