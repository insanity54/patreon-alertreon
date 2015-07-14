// socket.on('news', function (data) {
//     //console.log('updater');
//     $('#statusBody').html('connected');
// });

// function warn(message) {
//   if (data.response == 1) {
//         $('#flashes').attr('class', 'alert alert-success');
//         $('#patreonAccountContent').html(data.username);
//     }
//     else {
//         $('#flashes').attr('class', 'alert alert-warning');
//     }
// }


socket.on('news', function (data) {
    if (data.status == 0) {
        $('#statusContent').html('idle');
    }
    else if (data.status == 1) {
        $('#statusContent').html('crawling');
    }
});

socket.on('newUser', function(data) {
    console.log('newUser received', data);
    // create flash that shows either success or failure
    
    if (data.response == 1) {
        $('#flashes').attr('class', 'alert alert-success');
        $('#patreonAccountContent').html(data.username);
    }
    else {
        $('#flashes').attr('class', 'alert alert-warning');
    }
    
    // add fail/success message
    $('#flashes').css('display', 'block');
    $('#flashes').html(data.message);
});



$("#submitPatreonUsername").on("click", function(e) {
    socket.emit('newUser', {username: $("#patreonUsername").val()});
});