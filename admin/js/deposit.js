$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/admin/deposit',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#paypal-deposit tbody');
          let dom = '';
          if (data.deposits.length === 0) {
            dom = '<tr><td colspan="9">No data to display.</td></tr>';
          } else {
            data.deposits.map((row, key) => {
              dom += `<tr>
                <td>${key + 1}</td>
                <td>${row.user.username}</td>
                <td>${row.user.email}</td>
                <td>$${row.amount.toLocaleString()}</td>
                <td>${new Date(row.created_at).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '')}</td>
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