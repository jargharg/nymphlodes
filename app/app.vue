<template>
  <main class="main-grid">
    <h1 class="logo"><img src="/images/nymph-lodes-logo.svg" alt="Nymph Lodes" ></h1>

    <div class="intro">
      <p>
        Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
        cubilia curae; Nullam commodo est at ante pellentesque, ac viverra urna eleifend. Curabitur iaculis, erat sit
        amet bibendum bibendum, purus nisl tristique ex, eu eleifend arcu nunc sed velit. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis egestas. Etiam erat arcu, euismod sit amet suscipit
        non, iaculis vel dui. In eleifend nec nibh nec semper. Pellentesque odio velit, elementum quis consequat ac,
        commodo at risus. Nulla facilisi. Ut malesuada posuere efficitur. Morbi a consequat nunc. Nunc ac imperdiet
        nulla, non ultricies nisl. Ut malesuada posuere efficitur. Morbi a consequat nunc. Nunc ac imperdiet
        nulla, non ultricies nisl. Aenean vestibulum nisl dui, ac gravida lorem sollicitudin in. Pellentesque eu
        condimentum odio, id mattis eros.
      </p>
    </div>

    <HighDays class="song--high-days" />

    <Stars class="song--stars" />

    <Cults class="song--cults" />

    <DualRealities class="song--dual-realities" />

    <Graveyard class="song--graveyard" />

    <div class="creds">
      <a href="https://www.instagram.com/_nymphlodes_" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="https://soundcloud.com/nymph-lodes" target="_blank" rel="noopener noreferrer">SoundCloud</a>
    </div>
  </main>
</template>

<script lang="ts">
import Cults from './components/songs/Cults.vue'
import HighDays from './components/songs/HighDays.vue'
import DualRealities from './components/songs/DualRealities.vue'
import Stars from './components/songs/Stars.vue'
import Graveyard from './components/songs/Graveyard.vue'
import { useSongStore } from './stores/songStore'

export default {
  components: {
    Cults,
    HighDays,
    DualRealities,
    Stars,
    Graveyard,
  },

  setup() {
    const songStore = useSongStore()

    onMounted(() => {
      document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape') {
          songStore.toggle()
        }
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.main-grid {
  @apply relative lg:fixed top-0 left-0;
  @apply w-full overflow-hidden mx-auto;
  @apply grid items-center justify-center gap-1 pb-10;
  // max-width: clamp(375px, 70vw, 1200px);
  grid-template:
    'logo'
    'intro'
    'high'
    'grave'
    'cults'
    'dual'
    'stars'
    'creds' / 1fr;

  @screen xs {
    @apply py-0 max-w-none;

    grid-template:
      'logo intro' auto
      'high stars' auto
      'cults dual' auto
      'creds grave' auto / 1fr 1fr;
  }
  
  @screen md {
    grid-template:
      'high logo logo' auto
      'stars cults intro' auto
      'stars cults creds' auto
      '. dual grave' auto / 1fr 1fr 1fr;
  }

  @screen lg {
    @apply h-svh gap-0;
    grid-template: 'intro . high . .' 1fr
      'intro . logo . stars' 1fr
      'intro cults logo . .' 1fr
      'dual . . grave creds' 1fr / 1fr 1fr auto 1fr 1fr;
  }
}

.logo {
  @apply z-20 relative w-full max-w-sm mx-auto px-1 2xs:p-0;
  grid-area: logo;
  
  img {
    width: 100%;
  }
}

.intro {
  @apply h-full items-start justify-start leading-[0.9] text-justify px-1 2xs:p-0;
  font-size: clamp(12px, 1.15vw, 17.4px);
  grid-area: intro;
}

.song {
  &--high-days {
    grid-area: high;
  }

  &--stars {
    grid-area: stars;
  }

  &--cults {
    grid-area: cults;
  }

  &--dual-realities {
    grid-area: dual;
  }

  &--graveyard {
    grid-area: grave;
  }
}

.creds {
  @apply text-[14px] leading-[0.9] flex justify-between items-end lg:justify-start lg:flex-col gap-8 text-right h-full p-4 2xs:px-0 md:p-0;
  grid-area: creds;
  font-size: clamp(12px, 1.15vw, 17.4px);

  a {
    @apply underline underline-offset-1 2xl:underline-offset-0 hover:decoration-transparent transition-colors;
  }
}
</style>
