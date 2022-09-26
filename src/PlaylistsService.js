const { Pool } = require('pg')
const { playlistsModel } = require('../utils')

class PlaylistsService {
  constructor () {
    this._pool = new Pool()
  }

  async getPlaylist (id, userId) {
    const query = {
      text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1 AND playlists.owner = $2',
      values: [id, userId]
    }

    const result = await this._pool.query(query)

    return result.rows.map(playlistsModel)[0]
  }

  async getSongByPlaylistId (id, userId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlists LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id LEFT JOIN songs ON songs.id = playlist_songs.song_id WHERE playlists.id = $1 AND playlists.owner = $2',
      values: [id, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return []
    }

    return result.rows
  }
}

module.exports = PlaylistsService
