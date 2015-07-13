var socket = io.connect('//patreon-alertreon-insanity54.c9.io');
    socket.on('status', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});