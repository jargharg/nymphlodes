<template>
  <Song title="Bare Legs, Night Dress" :song-id="songId">
    <img v-for="(_, index) in Array(imageCount)" :key="index" ref="elsImages" :src="imageSrc" class="image"
      aria-hidden="true" :style="{ '--inset': index > 0 && `${6 + (index * 10)}%` }">
  </Song>
</template>

<script>
import gsap from 'gsap'
import { useSongStore } from '~/stores/songStore'

export default {
  name: 'BareLegs',

  setup() {
    const elsImages = ref([])
    const imageSrc = '/images/bare-legs.avif'
    const imageCount = 5
    const tls = ref([])
    const songId = 'bare-legs-night-dress'

    const songStore = useSongStore()

    watch([() => songStore.isPlaying, () => songStore.currentSongId], ([isPlaying, currentSongId]) => {
      if (currentSongId !== songId) {
        endTls()
        return
      }

      if (isPlaying) {
        startTls()
      } else {
        pauseTls()
      }
    })

    const startTls = () => {
      tls.value.forEach(tl => gsap.to(tl, { timeScale: 1, ease: 'circ.out', duration: 2, overwrite: true }))
    }

    const pauseTls = () => {
      tls.value.forEach(tl => gsap.to(tl, { timeScale: 0, ease: 'circ.out', duration: 2, overwrite: true }))
    }

    const endTls = () => {
      tls.value.forEach(tl => gsap.to(tl, { progress: 0, ease: 'power3.inOut', duration: 2, timeScale: 0, overwrite: true }))
    }

    onMounted(() => {
      tls.value = elsImages.value.slice(1).reverse().map((elImage, index) => {
        return gsap
          .timeline({ repeat: -1 })
          .to(elImage, { rotation: 360, duration: 12 + index * 4, delay: -index * 5, ease: 'none' })
          .timeScale(0)
      })
    })

    return {
      elsImages,
      imageSrc,
      imageCount,
      songId,
    }
  },
}
</script>

<style lang="scss" scoped>
.image {
  @apply absolute top-0 left-0 size-full object-cover overflow-auto pointer-events-none;
  clip-path: inset(var(--inset));
}
</style>
