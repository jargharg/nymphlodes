import { defineStore } from 'pinia'
import { Howl } from 'howler'

const createHowl = (id) => {
  return new Howl({
    src: [`https://songs.nymphlod.es/songs/${id}.mp3`],
    html5: true,
    preload: 'metadata',
    onend: () => {
      const songStore = useSongStore()

      const playlistIndex = playlist.findIndex((songId) => songId === id)

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
  'funeral-song': { title: 'Funeral Song', file: createHowl('funeral-song') },
  'stars': { title: 'Stars', file: createHowl('stars') },
}

export const playlist = [
  'acrobats',
  'funeral-song',
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
        if (song !== this.currentSong) {
          song.file.stop()
        }
      })

      if (this.currentSong) {
        this.isPlaying = true
        this.currentSong.file.play()

        this.currentSong.file.on('end', () => {
          const playlistIndex = playlist.findIndex((songId) => songId === this.currentSongId)

          if (playlistIndex > -1 && playlistIndex < playlist.length - 1) {
            this.next()
          } else {
            this.reset()
          }
        })

        if (navigator.mediaSession) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.currentSong.title,
            artist: 'Nymph Lodes',
            artwork: [{ src: `/artworks/512px/${this.currentSongId}.jpg` }],
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

          const indexInPlaylist = playlist.indexOf(this.currentSongId)

          navigator.mediaSession.setActionHandler('previoustrack',
            indexInPlaylist > 0 ? () => this.prev() : null,
          )

          navigator.mediaSession.setActionHandler('nexttrack',
            indexInPlaylist > -1 && indexInPlaylist < playlist.length - 1 ? () => this.next() : null,
          )
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
      Object.values(songs).forEach((song) => {
        song.file.stop()
        song.file.off()
      })
      this.isPlaying = false
    },

    reset() {
      this.stop()
      this.currentSongId = null
    },

    next() {
      const currentIndex = playlist.findIndex((song) => song === this.currentSongId)

      if (currentIndex === -1 || currentIndex === playlist.length - 1) return

      this.stop()
      this.setCurrentSongId(playlist[currentIndex + 1])
      this.play()
    },

    prev() {
      const currentIndex = playlist.findIndex((song) => song === this.currentSongId)

      if (currentIndex <= 0) return

      this.stop()
      this.setCurrentSongId(playlist[currentIndex - 1])
      this.play()
    },
  },
})
