function init() {
  $.ajax({
    url: SERVER_URL + '/api/client/landing',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        const { success, message, data } = res;
        if (success) {
          $('#total_winnings').text(data.totalWinnings.toLocaleString());
        } else {
          alert(message);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle error response
        console.log('Error:', textStatus, errorThrown);
      }
    });
}

function audio() {
  var sound = new Howl({
    src: ['../audio/bg.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.5
  });
  setTimeout(sound.play, 3000);
}

init();
audio();
