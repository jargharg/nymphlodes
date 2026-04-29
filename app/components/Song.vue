<template>
  <button class="song" @click="onClick">
    <h2 class="title">{{ title }}</h2>

    <img v-for="(_, index) in Array(5)" :key="index" ref="elsImages" :src="imageSrc" class="image" aria-hidden="true"
      :style="{ '--radius': index > 0 && `${60 - (index * 10)}%` }">

    <div :class="['play-state', playState]">
      <svg v-if="playState === 'playing'" viewBox="5 0 42 68" fill="none" stroke="currentColor" stroke-width="1"
        class="overflow-visible">
        <path d="M27 0h15v68H27zM0 0h15v68H0z" vector-effect="non-scaling-stroke" />
      </svg>

      <svg v-else viewBox="0 0 56 71" fill="none" stroke="currentColor" stroke-width="1" class="overflow-visible">
        <path d="M56 35 0 70V0z" vector-effect="non-scaling-stroke" />
      </svg>
    </div>

    <svg viewBox="0 0 1 1" preserveAspectRatio="none" class="progress-bar" :style="{ '--progress': songProgress }">
      <path d="M0 0h1v1H0z" fill="currentColor" />
    </svg>
  </button>
</template>

<script>
import gsap from 'gsap'
import { songs, useSongStore } from '~/stores/songStore'

export default {
  name: 'Song',

  props: {
    title: {
      type: String,
      required: true,
    },

    songId: {
      type: String,
      required: true,
    },

    imageSrc: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const songStore = useSongStore()
    const song = songs[props.songId]

    let shouldUpdateProgress = false

    const songProgress = ref(0)
    const elsImages = ref([])
    const tls = ref([])

    const updateProgress = () => {
      if (shouldUpdateProgress) {
        songProgress.value = song.file.seek() / song.file.duration()
        requestAnimationFrame(updateProgress)
      }
    }

    const onClick = () => {
      songStore.setCurrentSongId(props.songId)
      console.log(songStore);

      if (songStore.isPlaying) {
        songStore.pause()
        shouldUpdateProgress = false
      } else {
        songStore.play()
        shouldUpdateProgress = true
        requestAnimationFrame(updateProgress)
      }
    }

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
      tls.value = elsImages.value.slice(1).map((elImage, index) => {
        return gsap
          .timeline({ repeat: -1 })
          .to(elImage, { rotation: 360, duration: 12 + index * 5, delay: -index * 5, ease: 'none' })
          .timeScale(0)
      })
    })

    const playState = computed(() => {
      if (songStore.currentSongId !== props.songId) {
        return 'stopped'
      } else if (songStore.isPlaying) {
        return 'playing'
      } else {
        return 'paused'
      }
    })

    watch(playState, (newState) => {
      if (newState === 'playing') {
        shouldUpdateProgress = true
        requestAnimationFrame(updateProgress)
        return
      } else {
        shouldUpdateProgress = false
      }

      if (newState === 'stopped') {
        gsap.to(songProgress, { value: 0, duration: 2, ease: 'power3.inOut' })
      }
    })

    watch([() => songStore.isPlaying, () => songStore.currentSongId], ([isPlaying, currentSongId]) => {
      if (currentSongId !== props.songId) {
        endTls()
        return
      }

      if (isPlaying) {
        startTls()
      } else {
        pauseTls()
      }
    })

    return {
      elsImages,
      onClick,
      playState,
      songProgress,
    }
  },
}
</script>

<style lang="scss" scoped>
.song {
  @apply relative h-full aspect-square overflow-hidden text-[10px];

  @screen xs {
    font-size: clamp(15px, 1.6vw, 17.4px);
  }

  &:hover {
    --opacity: 1;
  }
}

.title {
  transform-origin: bottom;
  transition: opacity 0.3s linear;
  @apply absolute bottom-1 left-0.5 w-full text-left pointer-events-none z-50 text-white;

  @media (hover: hover) {
    opacity: var(--opacity, 0);
  }
}

.play-state {
  @apply absolute top-1 left-1 text-white pointer-events-none z-50;
  @apply flex items-center justify-center;
  opacity: var(--opacity, 0.9);
  transition: opacity 0.3s linear;

  svg {
    @apply size-4;
  }

  &.paused {
    --opacity: 1;
  }
}

.image {
  @apply absolute top-0 left-0 size-full object-cover overflow-auto pointer-events-none;
  clip-path: circle(var(--radius) at center);
}

.progress-bar {
  @apply absolute bottom-0 left-0 w-full h-1;
  @apply text-white/90;
  transform: scaleX(var(--progress, 0));
  transform-origin: left;
}
</style>
