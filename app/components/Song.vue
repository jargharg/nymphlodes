<template>
  <button class="song" @click="onClick">
    <h2 class="title">{{ title }}</h2>
    <slot />

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
  },

  setup(props) {
    const songStore = useSongStore()
    const song = songs[props.songId]
    let shouldUpdateProgress = false

    const updateProgress = () => {
      if (shouldUpdateProgress) {
        songProgress.value = song.file.seek() / song.file.duration()
        requestAnimationFrame(updateProgress)
      }
    }

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

    const songProgress = ref(0)

    const onClick = () => {
      songStore.setCurrentSongId(props.songId)

      if (songStore.isPlaying) {
        songStore.pause()
        shouldUpdateProgress = false
      } else {
        songStore.play()
        shouldUpdateProgress = true
        requestAnimationFrame(updateProgress)
      }
    }

    return {
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

.progress-bar {
  @apply absolute bottom-0 left-0 w-full h-1;
  @apply text-white/90;
  transform: scaleX(var(--progress, 0));
  transform-origin: left;
}
</style>
