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
      url: SERVER_URL + '/api/users/authenticate',
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message, token } = res;
          if(success) {
            localStorage.setItem('token', token);
            window.location.href = 'loading.html';
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
  });

  var sound = new Howl({
    src: ['../audio/bg.mp3'],
    autoplay: true,
    loop: true,
    volume: 0.5
  });
  setTimeout(sound.play, 3000);
  

  $('#forgot-btn').on('click', () => $('#forgotPasswordBlackboard').show());

  $('#forgotPasswordBlackboard').on('click', '#backBtn', function() {
    $('#forgotPasswordBlackboard').hide();
  });

  $('#forgotPasswordBlackboard').on('click', '#submitBtn', function() {
    const email = $('#receiveEmail').val();

    if (!emailValidation(email)) {
      alert('Email form is not valid.');
      return;
    }
    const data = { email };
    $.ajax({
      url: SERVER_URL + '/api/client/forgotpassword',
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message } = res;
          if(success) {
            alert(message)
            $('#forgotPasswordBlackboard').hide()
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
  });
  
})