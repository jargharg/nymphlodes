<template>
  <main>
    <div class="main-grid">
      <h1 class="logo"><img src="/images/nymph-lodes-logo.svg" alt="Nymph Lodes"></h1>

      <div class="intro">
        <div class="intro__content">
          <p>new music from the moors.</p>
          <p>where once were witches, now are <img class="h-[0.9em] inline-block"
              src="/images/nymph-lodes-logo-landscape.svg" alt="Nymph Lodes"> — partners in music and marriage.</p>
          <p>mildly mystical, slightly psychedelic songs about stars, cults, babes and other phenomena.</p>
        </div>

        <div class="intro__creds">
          <a href="https://www.instagram.com/_nymphlodes_" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://soundcloud.com/nymph-lodes" target="_blank" rel="noopener noreferrer">SoundCloud</a>
        </div>
      </div>

      <HighDays class="song--high-days" />

      <Acrobats class="song--acrobats" />

      <Hypno class="song--hypno" />

      <BareLegs class="song--bare-legs" />

      <a class="btf-link" href="#btf">older stuff &darr;</a>
    </div>

    <div id="btf" class="btf-grid">
      <Stars class="song--stars" />

      <Cults class="song--cults" />

      <DualRealities class="song--dual-realities" />

      <Graveyard class="song--graveyard" />

      <p class="copyright">&copy; Nymph Lodes Productions {{ new Date().getFullYear()
      }}</p>

      <p class="pronunciation">nɪmf ləʊdz</p>
    </div>
  </main>
</template>

<script lang="ts">
import { useSongStore } from './stores/songStore'
import Acrobats from './components/songs/Acrobats.vue'
import BareLegs from './components/songs/BareLegs.vue'
import Cults from './components/songs/Cults.vue'
import DualRealities from './components/songs/DualRealities.vue'
import Graveyard from './components/songs/Graveyard.vue'
import HighDays from './components/songs/HighDays.vue'
import Hypno from './components/songs/Hypno.vue'
import Stars from './components/songs/Stars.vue'

export default {
  components: {
    Acrobats,
    BareLegs,
    Cults,
    DualRealities,
    Graveyard,
    HighDays,
    Hypno,
    Stars,
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
  @apply relative;
  @apply w-full overflow-hidden mx-auto;
  @apply grid items-center justify-center gap-1 pb-10;

  grid-template:
    'logo logo'
    'intro intro'
    'high acro'
    'hypno bare'
    / 1fr 1fr;

  @screen xs {
    @apply py-0 max-w-none;

    grid-template:
      'logo intro' auto
      'high acro' 1fr
      'bare hypno' 1fr / 1fr 1fr;
  }

  @screen md {
    @apply h-svh gap-0;

    grid-template:
      'logo  .      high ' 1fr
      'intro bare  . ' 1fr
      'intro .      hypno' 1fr
      'intro  acro  btf' 1fr / 35ch 1fr 1fr;
  }

  @screen lg {
    @apply h-svh gap-0;
    grid-template:
      '.     high  .     .     .    ' 1fr
      '.     .     logo  .     acro ' 1fr
      'hypno .     intro .     .    ' 1fr
      '.     .     .     bare  btf  ' 1fr / 1fr 1fr 40ch 1fr 1fr;
  }
}

.logo {
  @apply z-20 relative w-full max-w-sm mx-auto;
  grid-area: logo;

  img {
    width: 100%;
  }
}

.btf-link,
.copyright,
.pronunciation {
  @apply text-[10px] items-end justify-end h-full p-4 grid;
}

.btf-link {
  grid-area: btf;
  @apply hidden md:grid;
}

.intro {
  @apply h-full flex flex-col justify-between gap-6 relative z-20 pt-2 md:pt-0;
  grid-area: intro;
  font-size: clamp(15px, 1.6vw, 17.4px);

  &__content {
    @apply flex flex-col gap-6 items-start justify-start text-justify leading-[0.85];
  }

  &__creds {
    @apply leading-[0.9] flex justify-between items-end gap-8 pb-1;

    a {
      @apply underline underline-offset-2 hover:decoration-transparent transition-colors;
    }
  }
}

.song {
  &--acrobats {
    grid-area: acro;
  }

  &--bare-legs {
    grid-area: bare;
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

  &--high-days {
    grid-area: high;
  }

  &--hypno {
    grid-area: hypno;
  }

  &--stars {
    grid-area: stars;
  }
}

.btf-grid {
  @apply relative pt-1;
  @apply w-full overflow-hidden mx-auto;
  @apply grid items-center justify-center gap-1;

  grid-template:
    'stars'
    'cults'
    'dual'
    'grave'
    / 1fr;

  @screen xs {
    @apply max-w-none;

    grid-template:
      'stars cults' auto
      'dual  grave' auto
      'pro   copy' auto / 1fr 1fr;
  }

  @screen md {
    @apply py-0 h-svh gap-0;

    grid-template:
      '. . stars' auto
      'cults . .' auto
      '. dual .' auto
      'grave . .' auto
      'pro . copy' auto / 35ch 1fr 1fr;
  }

  @screen lg {
    @apply h-svh gap-0;
    grid-template:
      '.   . stars         .     .    ' 1fr
      'cults     .     .     .  .    ' 1fr
      ' .      .       . dual     .    ' 1fr
      '.    grave .    .       .      ' 1fr
      'pro    .     .    .       copy  ' auto / 1fr 1fr 40ch 1fr 1fr;
  }
}

.pronunciation {
  @apply justify-start cursor-default;
  grid-area: pro;
}

.copyright {
  @apply cursor-default;
  
  grid-area: copy;
}
</style>
