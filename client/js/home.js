$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/client/home',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if (success) {
          $('#username').text(data.username);
          $('#balance').text(data.balance.toLocaleString());
          $('#total_winnings').text(data.totalWinnings.toLocaleString());
          // Add play modes
          const $playmodes = $('#playmodes');
          data.playmodes.map(item => {
            $playmodes.append(`<option value="${item._id}" class="text-[calc(var(--screenHeight)*2.4/100)]">PLAY $${item.need} (WIN $${item.benefit})</option>`);
          });
        } else {
          if (code === 401) {
            alert('Please login first.');
            window.location.href = 'login.html';
            return;
          }
          alert(message);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle error response
        console.log('Error:', textStatus, errorThrown);
      }
    });
}

init();
  
function showPlayground() {
  var playDialog = document.getElementById('playDialog');
  playDialog.style.display = 'block';
}

function hidePlayground() {
  var playDialog = document.getElementById('playDialog');
  playDialog.style.display = 'none';
}

function preCheck() {
  const playmode_id = $('#playmodes').val();
  const data = { playmode_id };
  console.log(data);
  $.ajax({
    url: SERVER_URL + '/api/client/pre-check',
    type: 'POST',
    dataType: 'json',
    data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if(success) {
          $('#balance').text(data.balance.toLocaleString());
          playGame(data.playlog_id, playmode_id);
        } else {
          if (code === 401) {
            alert('Please login first.');
            window.location.href = 'login.html';
            return;
          }
          alert(message);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle error response
        console.log('Error:', textStatus, errorThrown);
      }
    });
}

function playGame(playlog_id, playmode_id) {
  showPlayground();
  var lblCount = document.getElementById('lblCount');
  var lblTimer = document.getElementById('lblTimer');
  var sec = ROUND_TIME;

  lblCount.innerHTML = 'Clicks : 0';
  lblTimer.innerHTML = '00:' + (sec /10 < 1 ? '0' : '') + sec;

  var userClicks = 0;

  var chestAnime = document.getElementById('chestAnime');
  console.log(chestAnime);

  chestAnime.onclick = function(){
    if(sec === 0) return;
    var winSound = new Howl({
      src: ['../audio/click.wav'],
      autoplay: true,
      loop: false,
      volume: 1
    });
    winSound.play();

    userClicks = userClicks + 1;
    lblCount.innerHTML = 'CLICKS : ' + userClicks;

    const screen = document.getElementById('screen');
    const screenWidth = screen.offsetWidth;
    const screenHeight = screen.offsetHeight;
    console.log(screenHeight);
    const getRandom = (min, max) => Math.floor(Math.random()*(max-min+1)+min);
    chestAnime.style.left= getRandom(0, screenWidth - screenHeight * 24 / 100) +'px'; // 👈🏼 Horizontally
    chestAnime.style.top = getRandom(0, screenHeight - screenHeight * 40 / 100) +'px'; // 👈🏼 Vertically
  }

  
  var intervalID = setInterval(function() {
    sec --;
    lblTimer.innerHTML = '00' + ":" + (sec /10 < 1 ? '0' : '') + sec;
    if(sec == 0){
      clearInterval(intervalID);
      endGame(playlog_id, playmode_id, userClicks);
      // hidePlayground();
    }
  }, 1000);
}

function endGame(playlog_id, playmode_id, clicks) {
  const data = {playlog_id, playmode_id, clicks };
  console.log(data);
  $.ajax({
    url: SERVER_URL + '/api/client/end-game',
    type: 'POST',
    dataType: 'json',
    data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, data } = res;
        if(success) {
          if (message === 'win') {
            winner(data.balance, data.benefit);
          } else {
            loser();
          }
          $('#total_winnings').text(data.totalWinnings.toLocaleString());
        } else {
          if (code === 401) {
            alert('Please login first.');
            window.location.href = 'login.html';
            return;
          }
          alert(message);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Handle error response
        console.log('Error:', textStatus, errorThrown);
      }
    });
}

function winner(balance, benefit) {
  $('#balance').text(balance.toLocaleString());
  $('.winnerModal .prize').text(benefit.toLocaleString());
  $('.winnerModal').show();
  hidePlayground();
  var winSound = new Howl({
    src: ['../audio/win.wav'],
    autoplay: true,
    loop: false,
    volume: 1
  });
  winSound.play();
}

function loser() {
  $('.loserModal').show();
  hidePlayground();
  var LoseSound = new Howl({
    src: ['../audio/Lose.wav'],
    autoplay: true,
    loop: false,
    volume: 1
  });
  LoseSound.play();
}

$(document).ready(function() {
  $('#playBtn').click(function(e) {
    preCheck();
  });
  $('#closeWinModalBtn').click(function() {
    $('.winnerModal').hide();
  });
  $('#closeLoseModalBtn').click(function() {
    $('.loserModal').hide();
  });

  var sound = new Howl({
    src: ['../audio/bg.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.5
  });
  
  setTimeout(sound.play, 3000);
})