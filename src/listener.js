class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      const selectedPlaylist = await this._playlistsService.getPlaylistById(
        playlistId
      );
      const songs = await this._playlistsService.getSongsByPlaylistId(
        playlistId
      );
      selectedPlaylist['songs'] = songs;
      const playlist = {
        playlist: selectedPlaylist,
      };

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist)
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
