<template>
      <div id="app-vue">
        <p>{{census.count}}</p>
        <button class="plus" @click="census.plus">plus</button>
        <button class="minus" @click="census.minus">minus</button>
        <input class="input" type="number" :value="census.count" @input="(e) => census.setCount(parseInt(e.target.value) || 0)" />
      </div>
</template>
<script>
  export default {
    computed: {
      census () {
        return this.$vut.getModule('census')
      }
    }
  }
</script>
