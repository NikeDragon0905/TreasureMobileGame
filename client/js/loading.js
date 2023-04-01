setTimeout(function() {
  const screen = document.getElementById('screen');
  console.log(screen.style);
  screen.style.backgroundImage = 'url("img/bg_loading2.jpg")';
  
  var sound = new Howl({
    src: ['../audio/bg.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.5
  });
  setTimeout(sound.play, 3000);
  
  setTimeout(function() {
    window.location.href = 'home.html';
  }, 4000);
}, 4000);