$.ajaxSetup({
  headers: {
    'token': localStorage.getItem('token')
  }
});

function init() {
  $.ajax({
    url: SERVER_URL + '/api/admin/playmodes',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        const { success, message, code, data } = res;
        if (success) {
          $tbody = $('#categories tbody');
          let dom = '';
          if (data.playmodes.length === 0) {
            dom = '<tr><td colspan="6">No data to display.</td></tr>';
          } else {
            data.playmodes.map((row, key) => {
              dom += `<tr>
                <td>${key + 1}</td>
                <td data-value="${row.need}">$${row.need.toLocaleString()}</td>
                <td data-value="${row.benefit}">$${row.benefit.toLocaleString()}</td>
                <td data-value="${row.nth_player}">${row.nth_player}</td>
                <td data-value="${row.min_click}">${row.min_click}</td>
                <td data-value="${row.cur_order}">${row.cur_order}</td>
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
  $('#categories').on('click', 'button[data-role=edit]', function() {
    $tr = $(this).closest('tr');
    prev = $tr.html();
    for (let i = 1; i <= 5; i ++) {
      $td = $tr.children('td').eq(i);
      $td.html(`<input type="number" min="0" value="${$td.attr('data-value')}">`);
    }
    $(this).text('Save');
    $(this).attr('data-role', 'save');
    $removeBtn = $tr.find('button[data-role=remove]');
    $removeBtn.text('Cancel');
    $removeBtn.attr('data-role', 'cancel');
  });
  $('#categories').on('click', 'button[data-role=cancel]', function() {
    $tr = $(this).closest('tr');
    $tr.html(prev);
  });
  $('#categories').on('click', 'button[data-role=save]', function() {
    const columns = ['', 'need', 'benefit', 'nth_player', 'min_click', 'cur_order'];
    $tr = $(this).closest('tr');
    let data = {};
    for (let i = 1; i <= 5; i ++) {
      $td = $tr.children('td').eq(i);
      data[columns[i]] = Number.parseInt($td.find('input').val());
    }
    const _id = $(this).attr('data-index');
    $.ajax({
      url: SERVER_URL + `/api/admin/playmodes/${_id}`,
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
  $('#categories').on('click', 'button[data-role=remove]', function() {
    if (confirm('Do you really want to remove this row?')) {
      const _id = $(this).attr('data-index');
      $.ajax({
        url: SERVER_URL + `/api/admin/playmodes/${_id}`,
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

  $('#addNewBtn').click(function(event) {
    const need = $('#need').val();
    const benefit = $('#benefit').val();
    const nth_player = $('#nth_player').val();
    const min_click = $('#min_click').val();
    const cur_order = $('#cur_order').val();
    if (
      isEmpty(need) ||
      isEmpty(benefit) ||
      isEmpty(nth_player) ||
      isEmpty(min_click) ||
      isEmpty(cur_order)
    ) {
      alert('Please fill in all information.');
      return;
    }

    const data = { need, benefit, nth_player, min_click, cur_order };
    $.ajax({
      url: SERVER_URL + '/api/admin/playmodes',
      type: 'POST',
      dataType: 'json',
      data,
      success: function(res) {
          // Handle successful response
          const { success, message } = res;
          if(success) {
            alert('New category has successfully added');
            window.location.href = 'playmodes.html';
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