$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/client/leaderboard',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#leaderboard tbody');
          let dom = '';
          if (data.table.length === 0) {
            dom = '<tr><td colspan="3" class="py-[calc(var(--screenHeight)*1/100)]">No data to display.</td></tr>';
          } else {
            data.table.map(row => {
              dom += `<tr class="text-[calc(var(--screenHeight)*1.8/100)]">
                <td class="py-[calc(var(--screenHeight)*1/100)]">${row.user.username}</td>
                <td class="py-[calc(var(--screenHeight)*1/100)]">${row.highscore}</td>
                <td class="py-[calc(var(--screenHeight)*1/100)]">${row.totalwon}</td>
              </tr>`
            })
          }
          $tbody.html(dom);
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