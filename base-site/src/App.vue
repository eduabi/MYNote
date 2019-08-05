<template>
  <div class="app-container">
    <div class="example">{{ msg }}</div>
    <img src="./common/images/timg.jpg"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello world!"
    };
  },
  methods: {
    test() {
      let a = () => {
        console.log("wyy");
      };
    }
  }
};
</script>

<style lang="scss">
.app-container {
  width: 100%;
  height: 100%;
}
.example {
  color: red;
}
</style>