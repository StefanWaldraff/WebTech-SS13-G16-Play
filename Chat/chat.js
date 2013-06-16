$(function() {

    
});

  var timestamp = 0;
  var server_url = 'http://localhost:9000/chatserver';  
  var server_url_send = 'http://localhost:9000/chatserver_send';  
  var noerror = true;

  function connect() {
    $.ajax({
      type : 'get',
      url : server_url,
      dataType : 'json', 
      data : {'timestamp' : timestamp},
      success : function(response) {
        timestamp = response.timestamp;
        var stringMsg = response.lat + ', ' + response.lon;
        document.getElementById('lblLastUpdatedPos').innerHTML = stringMsg;
        noerror = true;          
      },
      complete : function(response) {
        // send a new ajax request when this request is finished
        if (!self.noerror) {
          // if a connection problem occurs, try to reconnect each 5 seconds
          setTimeout(function(){ connect(); }, 5000);           
        }else {
          // persistent connection
          connect(); 
        }
        noerror = false; 
      }
    });
  }

  function sendData() {
    var lat = $('#box-lat').val();
    var lon = $('#box-lon').val();

    //TODO: Coordinate validation!
    if(lat != "" && lon != "") {
      var msg = lat + ', ' + lon;
      document.getElementById('lblLastUpdatedPos').innerHTML = msg;
      sendChat(lat, lon); 
    }
    else {
      alert('Validation error: Please fill all fields.');
    }
  }

  function sendChat(lat, lon) {
      $.ajax({
        type : 'post',
        url : server_url_send,
        data : {'lat' : lat, 'lon' : lon}
      });
  }