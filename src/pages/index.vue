<template>
  <img alt="Vue logo" src="./../assets/logo.png" />
  <br />
  <router-link to="/login">点击跳转至login</router-link>
  <br /><br />
  <div class="test-style">
    测试rem
    <div class="test">11111</div>
  </div>
  <p>p标签</p>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { checkLogin } from '@/utils/auth'

  export default defineComponent({
    name: 'IndexPage',
    components: {},
    setup() {
      checkLogin()
    },
  })
</script>
<style lang="less" scoped>
  .test-style {
    font-size: 24px;
    .test {
      color: red;
      font-size: 32px;
    }
  }
</style>
