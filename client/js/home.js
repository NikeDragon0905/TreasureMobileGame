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
            $playmodes.append(`<option value="${item._id}">PLAY $${item.need} (WIN $${item.benefit})</option>`);
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
  Swal.fire({
    icon: 'success',
    customClass: 'font-albertus w-[80%]',
    background: '#0e4f04',
    confirmButtonColor: '#d3a51b',
    color: '#fff',
    backdrop: false,
    title: 'GREAT',
    text: `You Win. Please Get ${benefit}$ For This Winning Prize!`,
  }).then(result => hidePlayground());
    var loseSound = new Howl({
    src: ['audio/lose.wav'],
    autoplay: true,
    loop: false,
    volume: 1
  });
  loseSound.play();
}

function loser() {
  Swal.fire({
    icon: 'error',
    customClass: 'font-albertus w-[80%]',
    background: '#0e4f04',
    confirmButtonColor: '#d3a51b',
    color: '#fff',
    backdrop: false,
    title: 'SORRY',
    text: 'Another Player Won This Round. Better Luck Next Time!',
  }).then(result => hidePlayground());
    var loseSound = new Howl({
    src: ['audio/lose.wav'],
    autoplay: true,
    loop: false,
    volume: 1
  });
  loseSound.play();
}

$(document).ready(function() {
  $('#playBtn').click(function(e) {
    preCheck();
  });
})