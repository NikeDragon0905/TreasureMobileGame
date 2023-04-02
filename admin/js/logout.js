$(document).ready(function() {
  $('#logout-link').click(function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
})