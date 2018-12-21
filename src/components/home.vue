<template>
  <el-container>
    <el-header>
      <Top/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <NavBar/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入子组件 top
import Top from "@/components/common/top.vue";
// 导入子组件 navBar
import NavBar from "@/components/common/navBar.vue";
export default {
  components: {
    Top,
    NavBar
  },
  // 当进入页面时需要验证是否存在 token
  created() {
    // 得到 token
    var token = window.localStorage.getItem("token");
    // 判断 是否存在 token
    if (!token) {
      // 跳转回登录页面
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
