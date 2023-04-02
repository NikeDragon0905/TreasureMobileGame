function initCurrencySelector() {
  $currency = $('#currency');
  let dom = '';
  for (let key in CURRENCY_TYPE) {
    dom += `<option value="${key}">${CURRENCY_TYPE[key]}</option>`;
  }
  $currency.append(dom);
}

initCurrencySelector();

function initCountrySelector() {
  $country = $('#country');
  let dom = '';
  for (let key in COUNTRY_NAME) {
    dom += `<option value="${key}">${COUNTRY_NAME[key]}</option>`;
  }
  $country.append(dom);
}

initCountrySelector();

$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/admin/userlist',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#users tbody');
          let dom = '';
          if (data.users.length === 0) {
            dom = '<tr><td colspan="10">No data to display.</td></tr>';
          } else {
            data.users.map((row, key) => {
              dom += `<tr>
                <td>${key + 1}</td>
                <td>${row.firstname}</td>
                <td>${row.lastname}</td>
                <td>${new Date(row.birthday).toISOString().slice(0, 10)}</td>
                <td>${row.username}</td>
                <td>${row.email}</td>
                <td>${CURRENCY_TYPE[row.currency]}</td>
                <td>${row.country}</td>
                <td data-value="${row.balance}">$${row.balance.toLocaleString()}</td>
                <td>
                  <button class="btn btn-sm btn-primary" data-role="edit" data-index="${row._id}">Edit</button>
                  <button class="btn btn-sm btn-outline-primary" data-role="remove" data-index="${row._id}">Remove</button>
                  <button class="btn btn-sm btn-success" data-role="dm" data-index="${row._id}">D.M</button>
                </td>
              </tr>`
            })
          }
          $tbody.html(dom);
        } else {
          if (code === 401) {
            alert('Please login first.');
            window.location.href = 'index.html';
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

var prev = '';

$(document).ready(function() {
  $('#users').on('click', 'button[data-role=edit]', function() {
    $tr = $(this).closest('tr');
    prev = $tr.html();
    $td = $tr.children('td').eq(8);
    $td.html(`<input type="number" min="0" value="${$td.attr('data-value')}">`);
    $(this).text('Save');
    $(this).attr('data-role', 'save');
    $removeBtn = $tr.find('button[data-role=remove]');
    $removeBtn.text('Cancel');
    $removeBtn.attr('data-role', 'cancel');
  });
  $('#users').on('click', 'button[data-role=cancel]', function() {
    $tr = $(this).closest('tr');
    $tr.html(prev);
  });
  $('#users').on('click', 'button[data-role=save]', function() {
    $tr = $(this).closest('tr');
    $td = $tr.children('td').eq(8);
    const _id = $(this).attr('data-index');
    const balance = Number.parseInt($td.find('input').val());
    const data = { balance };
    $.ajax({
      url: SERVER_URL + `/api/admin/userlist/${_id}`,
      type: 'PATCH',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          const { success, message, code } = res;
          if (success) {
            alert('Successfully Updated');
            window.location.reload();
          } else {
            if (code === 401) {
              alert('Please login first.');
              window.location.href = 'index.html';
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
  $('#users').on('click', 'button[data-role=remove]', function() {
    if (confirm('Do you really want to remove this row?')) {
      const _id = $(this).attr('data-index');
      $.ajax({
        url: SERVER_URL + `/api/admin/userlist/${_id}`,
        type: 'DELETE',
        dataType: 'json',
        success: function(res) {
            // Handle successful response
            const { success, message, code } = res;
            if (success) {
              alert('Successfully Removed');
              window.location.reload();
            } else {
              if (code === 401) {
                alert('Please login first.');
                window.location.href = 'index.html';
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
  });
  $('#users').on('click', 'button[data-role=dm]', function() {
    const dmsg = prompt('Input any message to this user.');
    if (dmsg === null) {
      return;
    }
    const _id = $(this).attr('data-index');
    const data = { _id, dmsg };
    $.ajax({
      url: SERVER_URL + `/api/admin/message`,
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          const { success, message, code } = res;
          if (success) {
            alert('Message successfully posted');
          } else {
            if (code === 401) {
              alert('Please login first.');
              window.location.href = 'index.html';
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

  $('#addNewBtn').click(function(event) {
    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const birthday = $('#birthday').val();
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const currency = $('#currency').val();
    const country = $('#country').val();
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
      alert('Please fill in all information.');
      return;
    }
    if (!emailValidation(email)) {
      alert('Email form is not valid.');
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
          const { success, message } = res;
          if(success) {
            alert('New user successfully added');
            window.location.href = 'users.html';
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