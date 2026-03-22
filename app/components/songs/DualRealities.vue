<template>
  <Song title="Dual Realities" :song-id="songId">
    <img v-for="(_, index) in Array(imageCount)" :key="index" ref="elsImages" :src="imageSrc" class="image"
      aria-hidden="true" :style="{ '--radius': index > 0 && `${55 - (index * 5)}%` }">
  </Song>
</template>

<script>
import gsap from 'gsap'
import { useSongStore } from '~/stores/songStore'

export default {
  name: 'DualRealities',
  setup() {
    const elsImages = ref([])
    const tl = ref()
    const imageSrc = '/images/dual-realities.avif'
    const imageCount = 4
    const songId = 'dual-realities'

    const songStore = useSongStore()

    watch([() => songStore.isPlaying, () => songStore.currentSongId], ([isPlaying, currentSongId]) => {
      console.log(songStore.currentSongId)
      if (currentSongId !== songId) {
        endTl()
        return
      }

      if (isPlaying) {
        startTl()
      } else {
        pauseTl()
      }
    })

    const startTl = () => {
      gsap.to(tl.value, { timeScale: 1, ease: 'circ.out', duration: 2, overwrite: true })
    }

    const pauseTl = () => {
      gsap.to(tl.value, { timeScale: 0, ease: 'circ.out', duration: 2, overwrite: true })
    }

    const endTl = () => {
      gsap.to(tl.value, { progress: 0, timeScale: 0, ease: 'power3.inOut', duration: 2, overwrite: true })
    }

    onMounted(() => {
      const images = elsImages.value.slice(1).reverse()

      tl.value = gsap
        .timeline({ repeat: -1, yoyo: true })
        .to(images, { scale: 0.5, duration: 2, stagger: 0.1, ease: 'expo.inOut' })
        .timeScale(0)

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
  clip-path: circle(var(--radius) at center);
}
</style>
