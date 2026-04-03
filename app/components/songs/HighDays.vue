<template>
  <Song :song-id="songId" :title="'High Days & Holy Days'">
    <img :src="imageSrc" class="image" aria-hidden="true">
    <img ref="elImageInner" :src="imageSrc" class="image image--inner" aria-hidden="true">
  </Song>
</template>

<script>
import gsap from 'gsap'
import { useSongStore } from '~/stores/songStore'

export default {
  name: 'HighDays',

  setup() {
    const songId = 'high-days-and-holy-days'
    const elImageInner = ref()
    const imageSrc = '/images/high-days.avif'

    const tl = ref()

    const songStore = useSongStore()

    watch([() => songStore.isPlaying, () => songStore.currentSongId], ([isPlaying, currentSongId]) => {
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
      tl.value = gsap
        .timeline({ repeat: -1 })
        .to(elImageInner.value, { rotation: 360, duration: 600 / 33, ease: 'none' })
        .timeScale(0)
    })

    return {
      elImageInner,
      imageSrc,
      songId,
    }
  },
}
</script>

<style lang="scss" scoped>
.image {
  @apply absolute top-0 left-0 size-full object-cover overflow-auto pointer-events-none;

  &--inner {
    clip-path: circle(50% at center);
  }
}
</style>
