<template>
  <Song title="Graveyard Tourist" :song-id="songId">
    <img v-for="(_, index) in Array(imageCount)" :key="index" ref="elsImages" :src="imageSrc" class="image"
      aria-hidden="true" :style="{ '--inset': index > 0 && `${0 + (index * 2)}%` }">
  </Song>
</template>

<script>
import gsap from 'gsap'
import { useSongStore } from '~/stores/songStore'

export default {
  name: 'Graveyard',

  setup() {
    const elsImages = ref([])
    const tls = ref([])

    const imageSrc = '/images/graveyard.avif'
    const imageCount = 20

    const songId = 'graveyard-tourist'

    const songStore = useSongStore()

    watch([() => songStore.isPlaying, () => songStore.currentSongId], ([isPlaying, currentSongId]) => {
      console.log(songStore.currentSongId)
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
      tls.value.forEach((tl, i) => gsap.to(tl, { timeScale: 1, ease: 'circ.out', duration: 2, delay: i * 0.1, overwrite: true }))
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
          .timeline({ repeat: -1, delay: index * 0.1, defaults: { ease: 'power3.inOut', duration: 2.5 } })
          .to(elImage, { rotate: -90 })
          .to(elImage, { rotate: -180 })
          .to(elImage, { rotate: -270 })
          .to(elImage, { rotate: -360 })
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
  clip-path: inset(var(--inset, 0));
}
</style>
