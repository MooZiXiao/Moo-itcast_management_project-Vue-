<template>
    <div class="welcome">
        欢迎来到木一了后台管理
    </div>
</template>
<script>
export default {
  mounted () {
    localStorage.removeItem('home_default_index')
  }
}
</script>
<style lang="less" scoped>

</style>
