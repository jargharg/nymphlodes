<template>
  <div ref="elOverlay" class="play-overlay" />
</template>

<script>
import gsap from 'gsap'

export default {
  setup() {
    const elOverlay = ref(null)

    // onMounted(() => {
    //   gsap
    //     .timeline({ repeat: -1 })
    //     .fromTo(elOverlay.value, { scaleX: 0 }, { scaleX: 1, duration: 240, ease: 'none' })
    // })

    return {
      elOverlay,
    }
  },
}
</script>

<style lang="scss" scoped>
.play-overlay {
  // @apply fixed top-0 left-0 w-full h-full z-10 pointer-events-none origin-left;
  // backdrop-filter: invert(1);
}
</style>
