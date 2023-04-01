function init() {
  $.ajax({
    url: SERVER_URL + '/api/client/landing',
    type: 'GET',
    // dataType: 'json',
    // data,
    success: function(res) {
        // Handle successful response
        console.log(res);
        const { success, message, data } = res;
        if (success) {
          $('#total_winnings').text(data.totalWinnings.toLocaleString());
        } else {
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