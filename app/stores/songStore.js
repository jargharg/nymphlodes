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
  'high-days-holy-days': { isPlaying: false, file: createHowl('high-days-holy-days', 1) },
  'cults': { isPlaying: false, file: createHowl('cults') },
  'dual-realities': { isPlaying: false, file: createHowl('dual-realities') },
  'stars': { isPlaying: false, file: createHowl('stars') },
  'graveyard-tourist': { isPlaying: false, file: createHowl('graveyard-tourist') },
  'hypnotize': { isPlaying: false, file: createHowl('hypnotize') },
  'bare-legs-night-dress': { isPlaying: false, file: createHowl('bare-legs-night-dress') },
  'acrobats': { isPlaying: false, file: createHowl('acrobats') },
}

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
  },
})
