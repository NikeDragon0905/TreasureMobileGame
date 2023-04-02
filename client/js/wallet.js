$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/client/wallet',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if (success) {
          const balance = Number.parseInt(data.balance);
          $('#balance').text(balance.toLocaleString());
          const notificationCount = Number.parseInt(data.notification_count);
          $('#notificationCount').text(notificationCount);
          if(notificationCount !== 0) $('#notificationCount').show();
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

function updateNotificationContent(data) {
  $content = $('#notificationBlackboard .content');
  let dom = '';
  if(data.length === 0) {
    dom = `<div class="notification mt-[calc(var(--screenHeight)*2/100)]">
      <p class="text-center text-[calc(var(--screenHeight)*2.4/100)] text-white font-albertus">No data to display.</p>
    </div>`;
  }
  data.map((item, key) => {
    dom += `<div class="notification mt-[calc(var(--screenHeight)*2/100)]">
      <p class="text-justify text-[calc(var(--screenHeight)*2.4/100)] text-white font-albertus">${item.message}</p>
      <div class="flex justify-between px-[calc(var(--screenHeight)*2/100)] mt-[calc(var(--screenHeight)*1/100)]">
        <span class="text-[calc(var(--screenHeight)*2/100)] text-gray-500 font-albertus">${new Date(item.created_at).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '')}</span>
        <a class="check-message underline text-[calc(var(--screenHeight)*2/100)] text-yellow font-albertus" data-index="${item._id}">CHECK</a>
      </div>
    </div>`;
  });
  $content.html(dom);
  // Notification alert spinner
  const notificationCount = data.length;
  $('#notificationCount').text(notificationCount);
  if(notificationCount === 0){
     $('#notificationCount').hide();
  } else {
    $('#notificationCount').show();

  }
}

$(document).ready(function() {
  $('#addFundsBtn').click(function() {
    $('#addFundsBlackboard').show();
  });
  $('#withdrawBtn').click(function() {
    $('#withdrawBlackboard').show();
  });
  $('#addFundsBlackboard').on('click', '#backBtn', function() {
    $('#addFundsBlackboard').hide();
  });
  $('#withdrawBlackboard').on('click', '#backBtn', function() {
    $('#withdrawBlackboard').hide();
  });
  $('#withdrawBlackboard').on('click', '#submitBtn', function() {
    const account_name = $('#account_name').val();
    const bank = $('#bank').val();
    const swift_bic_code = $('#swift_bic_code').val();
    const iban = $('#iban').val();
    const country = $('#country').val();
    const withdrawal_amount = $('#withdrawal_amount').val();
    const currency = $('#currency').val();
    console.log(account_name, bank, swift_bic_code, iban, country, withdrawal_amount, currency);
    if (
      isEmpty(account_name) ||
      isEmpty(bank) ||
      isEmpty(swift_bic_code) ||
      isEmpty(iban) ||
      isEmpty(country) ||
      isEmpty(withdrawal_amount) ||
      isEmpty(currency)
    ) {
      alert('Please fill in all information.');
      return;
    }
    if (!emailValidation(account_name)) {
      alert('Email form is not valid.');
      return;
    }

    const data = { account_name, bank, swift_bic_code, iban, country, withdrawal_amount, currency };
    $.ajax({
      url: SERVER_URL + '/api/client/withdrawal',
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message, code, data } = res;
          if (success) {
            $('#balance').text(data.balance.toLocaleString());
            alert('Successfully done. Please wait for while then.');
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
  });
  
  // Notification
  $('#notificationBlackboard').on('click', '#backBtn', function() {
    $('#notificationBlackboard').hide();
  });
  $('#showNotifications').click(function() {
    $.ajax({
      url: SERVER_URL + '/api/client/notifications',
      type: 'GET',
      // dataType: 'json',
      // data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message, code, data } = res;
          if (success) {
            updateNotificationContent(data.notifications);
            $('#notificationBlackboard').show();
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
  });
  // Notificaion check button clicked
  $('#notificationBlackboard').on('click', 'a.check-message', function() {
    const _id = $(this).attr('data-index');
    data = { is_shown: true };
    $.ajax({
      url: SERVER_URL + `/api/client/notifications/${_id}`,
      type: 'PATCH',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message, code, data } = res;
          if (success) {
            updateNotificationContent(data.notifications);
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
  });
  // Notificaion check button clicked
  $('#notificationBlackboard').on('click', '#checkAllBtn', function() {
    const _id = $(this).attr('data-index');
    $.ajax({
      url: SERVER_URL + `/api/client/notifications/check-all`,
      type: 'POST',
      dataType: 'json',
      // data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message, code, data } = res;
          if (success) {
            updateNotificationContent(data.notifications);
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
  });
})