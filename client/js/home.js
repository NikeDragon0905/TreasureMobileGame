function showPlayground() {
  var playDialog = document.getElementById('playDialog');
  playDialog.style.display = 'block';
}

function hidePlayground() {
  var playDialog = document.getElementById('playDialog');
  playDialog.style.display = 'none';
}

function playGame(){
  showPlayground();
  var lblCount = document.getElementById('lblCount');
  var lblTimer = document.getElementById('lblTimer');
  var sec = 3;

  lblCount.innerHTML = 'Clicks : 0';
  lblTimer.innerHTML = '00:' + (sec /10 < 1 ? '0' : '') + sec;

  var userClicks = 0;

  var chestAnime = document.getElementById('chestAnime');
  console.log(chestAnime);

  chestAnime.onclick = function(){
    userClicks = userClicks + 1;
    lblCount.innerHTML = 'Clicks : ' + userClicks;

    const getRandom = (min, max) => Math.floor(Math.random()*(max-min+1)+min);
    chestAnime.style.left= getRandom(0, 350 - 200) +'px'; // 👈🏼 Horizontally
    chestAnime.style.top = getRandom(0, 700 - 200) +'px'; // 👈🏼 Vertically
  }

  
  var intervalID = setInterval(function() {
    sec--;
    lblTimer.innerHTML = '00' + ":" + (sec /10 < 1 ? '0' : '') + sec;
    if(sec == 0){
      clearInterval(intervalID);
      endGame();
      // hidePlayground();
    }
  }, 1000);
}

function endGame() {
  Swal.fire({
    icon: 'error',
    customClass: 'font-albertus w-[80%]',
    background: '#0e4f04',
    confirmButtonColor: '#d3a51b',
    color: '#fff',
    title: 'Sorry',
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

function checkGame() {

}

$(document).ready(function() {
  $('#playBtn').click(function(e) {
    playGame();
  });
})