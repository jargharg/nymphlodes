import { defineStore } from 'pinia'
import { Howl } from 'howler'

const createHowl = (id) => {
  return new Howl({
    src: [`https://songs.nymphlod.es/songs/${id}.mp3`],
    html5: true,
    preload: 'metadata',
    onend: () => {
      const songStore = useSongStore()

      const playlistIndex = playlist.findIndex((song) => song === id)

      if (playlistIndex > -1 && playlistIndex < playlist.length - 1) {
        songStore.next()
      } else if (songStore.currentSongId === id) {
        songStore.reset()
      }
    },
  })
}

export const songs = {
  'acrobats': { title: 'Acrobats', file: createHowl('acrobats') },
  'bare-legs-night-dress': { title: 'Bare Legs, Night Dress', file: createHowl('bare-legs-night-dress') },
  'cults': { title: 'Cults', file: createHowl('cults') },
  'dual-realities': { title: 'Dual Realities', file: createHowl('dual-realities') },
  'graveyard-tourist': { title: 'Graveyard Tourist', file: createHowl('graveyard-tourist') },
  'high-days-holy-days': { title: 'High Days & Holy Days', file: createHowl('high-days-holy-days') },
  'hypnotize': { title: 'Hypnotize', file: createHowl('hypnotize') },
  'stars': { title: 'Stars', file: createHowl('stars') },
}

export const playlist = [
  'acrobats',
  'hypnotize',
  'high-days-holy-days',
  'bare-legs-night-dress',
]

export const useSongStore = defineStore('song', {
  state: () => ({
    currentSongId: null,
    isPlaying: false,
  }),

  getters: {
    currentSong(state) {
      if (!state.currentSongId) return null

      if (songs[state.currentSongId]) {
        return songs[state.currentSongId]
      }
    },

    songProgress(state) {
      if (!state.currentSongId) return 0

      const song = songs[state.currentSongId]
      if (!song) return 0

      return song.file.seek() / song.file.duration()
    },
  },

  actions: {
    setCurrentSongId(id) {
      if (this.currentSongId === id) return

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
            artwork: [
              { src: `/artworks/96px/${this.currentSongId}.jpg`, sizes: '96x96', type: 'image/jpg' },
              { src: `/artworks/128px/${this.currentSongId}.jpg`, sizes: '128x128', type: 'image/jpg' },
              { src: `/artworks/192px/${this.currentSongId}.jpg`, sizes: '192x192', type: 'image/jpg' },
              { src: `/artworks/256px/${this.currentSongId}.jpg`, sizes: '256x256', type: 'image/jpg' },
              { src: `/artworks/512px/${this.currentSongId}.jpg`, sizes: '512x512', type: 'image/jpg' },
              { src: `/artworks/1024px/${this.currentSongId}.jpg`, sizes: '1024x1024', type: 'image/jpg' },
            ],
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
