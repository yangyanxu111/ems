<template>
  <el-row>
    <el-col :span="4">
      <div class="color">我的logo</div>
    </el-col>
    <el-col :span="16">
      <div class="mytitle">电商后台管理系统</div>
    </el-col>
    <el-col :span="4">
      <div class="loginout">
        <a href="#">退出</a>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.mytitle {
  color: #ffff;
  font-size: 24px;
}
.loginout {
  color: blue;
  text-align: right;
}
.color {
  color: #b3c0d1;
}
</style>
