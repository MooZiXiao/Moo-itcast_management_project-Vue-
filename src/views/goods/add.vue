<template>
    <div class="add">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-caret-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
export default {

}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  line-height: 45px;
}
</style>
