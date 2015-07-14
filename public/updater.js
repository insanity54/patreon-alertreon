// socket.on('news', function (data) {
//     //console.log('updater');
//     $('#statusBody').html('connected');
// });

socket.on('news', function (data) {
    if (data.status == 0) {
        $('#statusBody').html('idle');
    }
});

$("#submitPatreonUsername").on("click", function(e) {
    socket.emit('newUser', $("#patreonUsername"));
});