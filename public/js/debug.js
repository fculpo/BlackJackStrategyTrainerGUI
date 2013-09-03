(function ($) {
    "use strict";

    // Client app namespace
    var bjt_debug = {};

    bjt_debug.socket = io.connect(window.location.hostname);

    bjt_debug.socket.on('debug', function (data) {
      console.log(data);
      $('#debug').empty();
      data.forEach(function (board) {
        $('#debug').append("<div>" + board.uuid + "<br />");
        $('#debug').append(board.playersNb + " players<br />");
        for (var key in board.players) {
          $('#debug').append(key +"<br />");
        }
        $('#debug').append("</div><br /><br />");
      })
    });

    bjt_debug.socket.emit('request-debug');

})(jQuery);