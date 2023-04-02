$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/admin/withdrawal',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#bank_withdrawal tbody');
          let dom = '';
          if (data.withdrawals.length === 0) {
            dom = '<tr><td colspan="9">No data to display.</td></tr>';
          } else {
            data.withdrawals.map((row, key) => {
              dom += `<tr>
                <td>${key + 1}</td>
                <td>${row.account_name}</td>
                <td>${row.bank}</td>
                <td>${row.swift_bic_code}</td>
                <td>${row.iban}</td>
                <td>${row.country}</td>
                <td>${row.withdrawal_amount}</td>
                <td>${row.currency}</td>
                <td>${new Date(row.created_at).toISOString().slice(0, 10)}</td>
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