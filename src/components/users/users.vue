<template>
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success" plain @click="openAdd">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- scope.row当前行的数据源对象   slot-scope="scope" 设置了这个属性之后模板才能起作用-->
        <template slot-scope="scope">
          <el-switch
            @change="changestatus(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="edit(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="del(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="setRole(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加一个现在新增对话框 -->
    <el-dialog title="添加用户" :visible.sync="showadd">
      <el-form :model="form" label-position="right">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showadd = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加一个修改的对话框 -->
    <el-dialog title="修改用户" :visible.sync="showadd">
      <el-form :model="editform">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="editform.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showadd = false">取 消</el-button>
        <el-button type="primary" @click="editBtn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加一个角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="showRole">
      <el-form :model="objRole">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <label>{{objRole.username}}</label>
        </el-form-item>
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <el-select v-model="objRole.roleId" placeholder="请选择">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRole = false">取 消</el-button>
        <el-button type="primary" @click="postRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      tableData: [],
      pagenum: 1,
      pagesize: 6,
      pagesizes: [2, 4, 6, 8],
      total: 200,
      showadd: false,
      showRole: false,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editform: {
        username: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "120px",
      options: [],
      objRole: {
        id: "",
        username: "",
        roleId: ""
      }
    };
  },
  methods: {
    async getAllData() {
      var res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      var {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.tableData = data.users;
        this.total = data.total;
      }
    },
    sizeChange(val) {
      this.pagesize = val;
      this.getAllData();
    },
    currentChange(val) {
      this.pagenum = val;
      this.getAllData();
    },
    search() {
      this.getAllData();
      this.query = "";
    },
    openAdd() {
      this.showadd = true;
    },
    // 清空表单
    clearform() {
      for (var item in this.form) {
        this.form[item] = "";
      }
    },
    // 点击添加用户
    async add() {
      var res = await this.$http.post("users", this.form);
      var { msg, status } = res.data.meta;
      if (status === 201) {
        this.$message({
          message: msg,
          type: "success"
        });
        this.getAllData();
      } else {
        this.$message.error(msg);
      }
      this.clearform();
      this.showadd = false;
    },
    del(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          var res = await this.$http.delete(`users/${id}`);
          var { msg, status } = res.data.meta;
          if (status === 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.pagenum = 1;
            this.getAllData();
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async edit(id) {
      this.showadd = true;
      var res = await this.$http.get(`users/${id}`);
      var {
        data,
        meta: { msg, status }
      } = res.data;
      if (status == 200) {
        this.editform = data;
      } else {
        this.$message.error(msg);
      }
    },
    async editBtn() {
      var res = await this.$http.put(`users/${this.editform.id}`, {
        email: this.editform.email,
        mobile: this.editform.mobile
      });
      var { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message({
          type: "success",
          message: msg
        });
        this.getAllData();
      } else {
        this.$message.error(msg);
      }
      this.showadd = false;
    },
    async changestatus(row) {
      // console.log(row);
      var res = await this.$http.put(`users/${row.id}/state/${row.mg_state}`);
      var { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message({
          type: "success",
          message: msg
        });
      } else {
        this.$message.error(msg);
      }
    },
    // 获取所有角色
    async getAllRole() {
      var res = await this.$http.get("roles");
      var {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    // 点击角色按钮
    async setRole(row) {
      this.showRole = true;
      this.getAllRole();
      this.objRole.username = row.username;
      this.objRole.id = row.id;
      var res = await this.$http.get(`users/${row.id}`);
      // console.log(res);
      var {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.objRole.roleId = data.rid;
      }
    },
    async postRole() {
      var res = await this.$http.put(`users/${this.objRole.id}/role`, {
        rid: this.objRole.roleId
      });
      var { msg, status } = res.data.meta;
      if (status === 200) {
        this.$message({
          type: "success",
          message: msg
        });
      } else {
        this.$message.error(msg);
      }
      this.showRole = false;
    }
  },
  created() {
    this.$http.defaults.headers.common[
      "Authorization"
    ] = window.localStorage.getItem("token");
    this.getAllData();
  }
};
</script>

<style>
.input-with-select {
  width: 300px;
  margin-top: 20px;
}
</style>
