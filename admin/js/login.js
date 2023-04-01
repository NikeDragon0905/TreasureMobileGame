$(document).ready(function() {
    $('input').keydown(function(event) {
      if(event.key === 'Enter') {
        $('#loginBtn').click();
      }
    });
    $('#loginBtn').click(function(event) {
      const email = $('#email').val();
      const password = $('#password').val();
      if (
        isEmpty(email) ||
        isEmpty(password)
      ) {
        alert('Please fill in all information.');
        return;
      }
      if (!emailValidation(email)) {
        alert('Email form is not valid.');
        return;
      }
  
      const data = { email, password };
      $.ajax({
        url: SERVER_URL + '/api/admin/users/authenticate',
        type: 'POST',
        dataType: 'json',
        data,
        success: function(res) {
            // Handle successful response
            console.log(res);
            const { success, message, token } = res;
            if(success) {
              localStorage.setItem('token', token);
              window.location.href = 'users.html';
              // self.click();
            } else {
              alert(message);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle error response
            console.log('Error:', textStatus, errorThrown);
        }
      });
    })
  })