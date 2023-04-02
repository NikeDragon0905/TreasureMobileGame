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
    url: SERVER_URL + '/api/admins',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#admins tbody');
          let dom = '';
          if (data.admins.length === 0) {
            dom = '<tr><td colspan="10">No data to display.</td></tr>';
          } else {
            data.admins.map((row, key) => {
              dom += `<tr>
                <td>${key + 1}</td>
                <td>${row.username}</td>
                <td>${row.email}</td>
                <td>************</td>
                <td>
                  <button class="btn btn-sm btn-primary" data-role="edit" data-index="${row._id}">Edit</button>
                  <button class="btn btn-sm btn-outline-primary" data-role="remove" data-index="${row._id}">Remove</button>
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
  $('#admins').on('click', 'button[data-role=edit]', function() {
    $tr = $(this).closest('tr');
    prev = $tr.html();
    $td = $tr.children('td').eq(3);
    $td.html(`<input type="password" min="0">`);
    $(this).text('Save');
    $(this).attr('data-role', 'save');
    $removeBtn = $tr.find('button[data-role=remove]');
    $removeBtn.text('Cancel');
    $removeBtn.attr('data-role', 'cancel');
  });
  $('#admins').on('click', 'button[data-role=cancel]', function() {
    $tr = $(this).closest('tr');
    $tr.html(prev);
  });
  $('#admins').on('click', 'button[data-role=save]', function() {
    $tr = $(this).closest('tr');
    $td = $tr.children('td').eq(3);
    const _id = $(this).attr('data-index');
    const balance = Number.parseInt($td.find('input').val());
    const data = { balance };
    $.ajax({
      url: SERVER_URL + `/api/admins/${_id}`,
      type: 'PATCH',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
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
  $('#admins').on('click', 'button[data-role=remove]', function() {
    if (confirm('Do you really want to remove this row?')) {
      const _id = $(this).attr('data-index');
      $.ajax({
        url: SERVER_URL + `/api/admins/${_id}`,
        type: 'DELETE',
        dataType: 'json',
        success: function(res) {
            // Handle successful response
            console.log(res);
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

  $('#addNewBtn').click(function(event) {
    const username = $('#username').val();
    const email = $('#email').val();
    const password = $('#password').val();
    if (
      isEmpty(username) ||
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

    const data = { username, email, password };
    $.ajax({
      url: SERVER_URL + '/api/admins',
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          console.log(res);
          const { success, message } = res;
          if(success) {
            alert('New admin successfully added');
            window.location.href = 'admins.html';
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