function initCurrencySelector() {
  $currency = $('#currency');
  let dom = '';
  for (let key in CURRENCY_TYPE) {
    dom += `<option value="${key}">${CURRENCY_TYPE[key]}</option>`;
  }
  $currency.append(dom);
}

function initCountrySelector() {
  $country = $('#country');
  let dom = '';
  for (let key in COUNTRY_NAME) {
    dom += `<option value="${key}">${COUNTRY_NAME[key]}</option>`;
  }
  $country.append(dom);
}


initCountrySelector();

$(document).ready(function() {
  $('input').keydown(function(event) {
    if(event.key === 'Enter') {
      $('#registerBtn').click();
    }
  });
  $('#registerBtn').click(function(event) {
    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const birthday = $('#birthday').val();
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const currency = $('#currency').val();
    const country = $('#country').val();
    const checkTerm = $('#checkTerm')[0].checked;
    if (
      isEmpty(firstname) ||
      isEmpty(lastname) ||
      isEmpty(birthday) ||
      isEmpty(username) ||
      isEmpty(email) ||
      isEmpty(password) ||
      isEmpty(currency) ||
      isEmpty(country)
    ) {
      alert('You have to field out all the inputs.');
      return;
    }
    if (!emailValidation(email)) {
      alert('Email form is not valid.');
      return;
    }
    if (!checkTerm) {
      alert('You have to agree with our terms and services.');
      return;
    }

    const data = { firstname, lastname, birthday, username, email, password, currency, country };
    $.ajax({
      url: SERVER_URL + '/api/users',
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message } = res;
          if(success) {
            window.location.href = 'index.html';
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