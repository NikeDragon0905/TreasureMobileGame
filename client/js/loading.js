setTimeout(function() {
  const screen = document.getElementById('screen');
  console.log(screen.style);
  screen.style.backgroundImage = 'url("img/bg_loading2.jpg")';
  setTimeout(function() {
    window.location.href = 'home.html';
  }, 4000);
}, 4000);