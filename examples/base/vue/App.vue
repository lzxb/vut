<template>
  <div>
    <div v-if="user.loading">
      用户信息正在加载中
    </div>
    {{ user.detail.name }}
  </div>
</template>
<script>
  import Vut from '../vut'

  export default {
    computed: {
      user () {
        return Vut.store.user
      }
    },
    created () {
      this.user.load()
    }
  }
</script>