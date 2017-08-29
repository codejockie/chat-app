const socket = io();

socket.on('connect', function () {
  console.log('Connected to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
});

socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $('#messages').append(html);
});

// Get the message input field
const messageTextbox = $("input[name='message']");

$('#message-form').on('submit', function (event) {
  event.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function (data) {
    messageTextbox.val('');
  });
});

// Get send location button
const locationButton = $('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
