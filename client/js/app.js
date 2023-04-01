// Mobile screen ratio (width / height)
const ratio = 9 / 16;

const setScreenSize = () => {
  // Get current window size
  const browserWidth = window.innerWidth;
  const browserHeight = window.innerHeight;
  // Calculate mobile screen size
  let screenWidth = 0;
  let screenHeight = 0;
  if (browserWidth >= browserHeight * ratio) {
    screenHeight = browserHeight;
  } else {
    screenHeight = browserWidth / ratio;
  }
  // screenHeight = screenHeight * 0.94;
  screenWidth = screenHeight * ratio;
  // Set mobile screen size
  const screen = document.getElementById('screen');
  screen.style.width = screenWidth + 'px';
  screen.style.height = screenHeight + 'px';
  // Set root variable
  document.documentElement.style.setProperty('--screenHeight', screenHeight + 'px');
}

const setScreenVisible = () => {
  const screen = document.getElementById('screen');
  screen.style.display = 'block';
}

window.onload = () => {
  setScreenSize();
  setScreenVisible();
};

window.addEventListener('resize', function() {
  setScreenSize();
});