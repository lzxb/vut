<template>
      <div>
        <p>{{census.count}}</p>
        <button @click="census.plus">plus</button>
        <button @click="census.minus">minus</button>
        <input type="number" :value="census.count" @input="(e) => census.setCount(parseInt(e.target.value) || 0)" />
      </div>
</template>
<script>
  import Vut from '../vut'

  export default {
    computed: {
      census () {
        return Vut.store.census
      }
    }
  }
</script>