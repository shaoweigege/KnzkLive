const kit = require('../components/kanzakit');

class player {
  static startWatching(v) {
    video.addEventListener(
      'error',
      () => {
        player.showSplash('読み込み中に不明なエラーが発生しました...');
      },
      false
    );

    video.addEventListener(
      'ended',
      () => {
        clearInterval(config.heartbeat);
        player.showSplash('ストリームはオフラインです。');
      },
      false
    );

    video.addEventListener(
      'playing',
      () => {
        player.showSplash();
        v.play();
      },
      false
    );

    video.addEventListener(
      'canplay',
      () => {
        player.showSplash();
        v.play();
      },
      false
    );

    video.addEventListener(
      'loadedmetadata',
      () => {
        player.showSplash();
        v.play();
      },
      false
    );

    player.volume(70, true);
    if (localStorage.getItem('kplayer_mute'))
      player.mute(localStorage.getItem('kplayer_mute'));
    if (localStorage.getItem('kplayer_volume'))
      player.volume(localStorage.getItem('kplayer_volume'));
    if (config.myLive) player.mute(1, true);
  }

  static showStatus() {
    let buffer;
    try {
      buffer = video.buffered.end(0);
    } catch (e) {}
    const play = video.currentTime;
    let text = '';
    if (buffer > play && play && buffer) {
      //再生
      text += `<a href="javascript:knzk.live_embed.player.seekLive()">LIVE</a>`;

      config.delay_sec = Math.round(buffer - play);
      if (config.type !== 'HLS') text += ` · ${config.delay_sec}s`;

      player.showSplash();

      if (video.paused) {
        video.play().catch(e => {
          $('#play_button').show();
        });
      }
    } else {
      //バッファ
      text += 'BUFFERING';
      player.showSplash('バッファしています...');
    }
    kit.elemId('video_status').innerHTML = text;
  }

  static showSplash(text = '') {
    kit.elemId('splash_loadtext').innerHTML = text;
    if (text) $('#splash').show();
    else $('#splash').hide();
  }

  static seekLive() {
    $('#play_button').hide();
    video.play();
    video.currentTime = video.seekable.end(0) - (config.type === 'HLS' ? 3 : 1);
  }

  static mute(i = 0, no_save = false) {
    i = parseInt(i);
    kit.elemId('mute').className = i ? '' : 'invisible';
    kit.elemId('volume').className = !i ? '' : 'invisible';
    video.muted = i;
    if (!no_save) localStorage.setItem('kplayer_mute', i);
  }

  static volume(i, no_save = false) {
    kit.elemId('volume-range').value = i;
    video.volume = i * 0.01;
    if (!no_save) localStorage.setItem('kplayer_volume', i);
  }

  static full() {
    const v = document.body;
    let i;
    if (document.webkitCancelFullScreen) i = document.webkitFullscreenElement;
    else if (document.mozCancelFullscreen) i = document.mozFullScreenElement;
    else if (document.msExitFullscreen) i = document.msFullScreenElement;
    else if (document.exitFullscreen) i = document.fullscreenElement;

    if (i) {
      if (v.webkitRequestFullscreen) document.webkitCancelFullScreen();
      else if (v.mozRequestFullscreen) document.mozCancelFullscreen();
      else if (v.msRequestFullscreen) document.msExitFullscreen();
      else if (v.requestFullscreen) document.exitFullscreen();
    } else {
      if (v.webkitRequestFullscreen) v.webkitRequestFullscreen();
      else if (v.mozRequestFullscreen) v.mozRequestFullscreen();
      else if (v.requestFullscreen) v.requestFullscreen();
      else if (v.msRequestFullscreen) v.msRequestFullscreen();
      else if (document.exitFullscreen) i = document.fullscreenElement;
    }
  }

  static end() {
    clearInterval(config.heartbeat);
    $('#video').hide();
    player.showSplash();
    $('#end_dialog').show();
  }

  static watchHover() {
    $('.hover').show();
    config.hover++;
    setTimeout(() => {
      config.hover--;

      if ($(':hover').length) {
        player.watchHover();
        return;
      }

      if (config.hover <= 0) {
        config.hover = 0;
        $('.hover').hide();
      }
    }, 5000);
  }
}

module.exports = player;
