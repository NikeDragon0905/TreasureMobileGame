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
})