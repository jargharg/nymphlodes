import { defineStore } from 'pinia'
import { Howl } from 'howler'

const createHowl = (id, volume = 0.8) => {
  return new Howl({
    src: [`https://songs.nymphlod.es/songs/${id}.mp3`],
    html5: true,
    preload: 'metadata',
    volume,
    onend: () => {
      const songStore = useSongStore()
      if (songStore.currentSongId === id) {
        songStore.reset()
      }
    },
  })
}

export const songs = {
  'high-days-holy-days': { title: 'High Days & Holy Days', file: createHowl('high-days-holy-days', 1) },
  'cults': { title: 'Cults', file: createHowl('cults') },
  'dual-realities': { title: 'Dual Realities', file: createHowl('dual-realities') },
  'stars': { title: 'Stars', file: createHowl('stars') },
  'graveyard-tourist': { title: 'Graveyard Tourist', file: createHowl('graveyard-tourist') },
  'hypnotize': { title: 'Hypnotize', file: createHowl('hypnotize') },
  'bare-legs-night-dress': { title: 'Bare Legs, Night Dress', file: createHowl('bare-legs-night-dress') },
  'acrobats': { title: 'Acrobats', file: createHowl('acrobats') },
}

export const playlist = [
  'acrobats',
  'high-days-holy-days',
  'hypnotize',
  'bare-legs-night-dress',
]

export const useSongStore = defineStore('song', {
  state: () => ({
    currentSongId: null,
    isPlaying: false,
  }),

  getters: {
    currentSong(state) {
      if (!state.currentSongId) {
        return null
      }

      if (songs[state.currentSongId]) {
        return songs[state.currentSongId]
      }
    },

    songProgress(state) {
      if (!state.currentSongId) {
        return 0
      }

      const song = songs[state.currentSongId]
      if (!song) {
        return 0
      }

      return song.file.seek() / song.file.duration()
    },
  },

  actions: {
    setCurrentSongId(id) {
      if (this.currentSongId === id) {
        return
      }

      this.stop()
      this.currentSongId = id
    },

    play() {
      Object.values(songs).forEach((song) => {
        song.isPlaying = song !== this.currentSong
        if (song !== this.currentSong) {
          song.file.stop()
        }
      })

      if (this.currentSong) {
        this.isPlaying = true
        this.currentSong.isPlaying = true
        this.currentSong.file.play()

        if (navigator.mediaSession) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.currentSong.title,
            artist: 'Nymph Lodes',
            // artwork: [
            //   { src: '/artworks/cover.png', sizes: '512x512', type: 'image/png' }, // @TODO: generate these for each song
            // ],
          })

          navigator.mediaSession.setActionHandler('play', () => {
            this.play()
          })

          navigator.mediaSession.setActionHandler('pause', () => {
            this.pause()
          })

          navigator.mediaSession.setActionHandler("stop", () => {
            this.stop()
          })

          navigator.mediaSession.setActionHandler("seekto", ({ seekTime }) => {
            this.currentSong.file.seek(seekTime)
          })

          if (playlist.indexOf(this.currentSongId) > 0) {
            navigator.mediaSession.setActionHandler('previoustrack', () => this.prev())
          } else {
            navigator.mediaSession.setActionHandler('previoustrack', null)
          }

          if (playlist.includes(this.currentSongId) && playlist.indexOf(this.currentSongId) < playlist.length - 1) {
            navigator.mediaSession.setActionHandler('nexttrack', () => this.next())
          } else {
            navigator.mediaSession.setActionHandler('nexttrack', null)
          }
        }
      }
    },

    pause() {
      this.currentSong?.file.pause()
      this.isPlaying = false
    },

    toggle() {
      if (this.isPlaying) {
        this.pause()
      } else {
        this.play()
      }
    },

    stop() {
      this.currentSong?.file.stop()
      this.isPlaying = false
    },

    reset() {
      this.stop()
      this.currentSongId = null
    },

    next() {
      const currentIndex = playlist.findIndex((song) => song === this.currentSongId)

      if (currentIndex === -1 || currentIndex === playlist.length - 1) return

      this.setCurrentSongId(playlist[currentIndex + 1])
      this.play()
    },

    prev() {
      const currentIndex = playlist.findIndex((song) => song === this.currentSongId)

      if (currentIndex <= 0) return

      this.setCurrentSongId(playlist[currentIndex - 1])
      this.play()
    },

    seekForwards(seconds = 10) {
      if (!this.currentSong) return

      const newTime = this.currentSong.file.seek() + seconds
      this.currentSong.file.seek(newTime)
    },

    seekBackwards(seconds = 10) {
      if (!this.currentSong) return

      const newTime = this.currentSong.file.seek() - seconds
      this.currentSong.file.seek(newTime)
    },
  },
})
