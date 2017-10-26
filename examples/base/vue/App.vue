<template>
      <div>
        <p>{{census.count}}</p>
        <button @click="census.plus">plus</button>
        <button @click="census.minus">minus</button>
        <input type="number" :value="census.count" @input="(e) => census.setCount(parseInt(e.target.value) || 0)" />
      </div>
</template>
<script>
  export default {
    computed: {
      census () {
        return this.$vut.store.census
      }
    }
  }
</script>
