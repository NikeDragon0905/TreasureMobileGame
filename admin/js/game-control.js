$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/admin/setting',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#game-control tbody');
          let dom = '';
          let index = 1;
          for (let key in data.setting) {
            if (key === '_id') continue;
            dom += `<tr>
              <td>${index ++}</td>
              <td>${key}</td>
              <td><input type="number" min="0" value="${data.setting[key]}"></td>
              <td><button class="btn btn-sm btn-primary" data-role="save" data-index="${data.setting._id}">Save</button></td>
            </tr>`;
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
  $('#game-control').on('click', 'button[data-role=save]', function() {
    $tr = $(this).closest('tr');
    const field = $tr.children('td').eq(1).text();
    const value = Number.parseInt($tr.children('td').eq(2).find('input').val());
    const _id = $(this).attr('data-index');
    const data = { [field]: value };

    $.ajax({
      url: SERVER_URL + `/api/admin/setting/${_id}`,
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
})