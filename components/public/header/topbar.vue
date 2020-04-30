<template>
  <div class="m-header">
    <el-row :gutter="0">
      <el-col :span="5">
          <geo/>
      </el-col>
      <el-col :span="5">
        <user/>
      </el-col>
      <el-col :span="14">
        <navbar/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Geo from "./geo.vue"
import User from './user.vue'
import Navbar from './nav.vue'
export default {
  components: {
      Geo,
      User,
      Navbar
  }
};
</script>

<style lang="scss">
  @import "@/assets/css/public/layout.scss";
  @import "@/assets/css/public/header/index.scss";
</style>
