$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/client/profile',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if (success) {
          $('#fullname').val(`${data.firstname} ${data.lastname}`);
          $('#email').val(data.email);
          $('#country').val(COUNTRY_NAME[data.country]);
          $('#balance').val(`$${data.balance.toLocaleString()}`);
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

$(document).ready(function() {
  $('#logoutBtn').click(function() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });
})