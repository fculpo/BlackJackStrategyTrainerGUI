(function ($) {
    "use strict";

    // Client app namespace
    var bjt_debug = {};

    bjt_debug.socket = io.connect(null, {port: 3000});

    bjt_debug.socket.on('debug', function (data) {
      console.log(data);
      $('#debug').empty();
      data.forEach(function (board) {
        $('#debug').append("<div>" + board.uuid + "</div>");
        $('#debug').append("<div>" + board.playersNumber + " players</div><br /><br />");
      })
    });

    bjt_debug.socket.emit('request-debug');

})(jQuery);