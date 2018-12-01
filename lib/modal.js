$('#login-btn').on('click', function() {
  $('#login-modal').css('display', 'block');
});

$('#register-btn').on('click', function() {
  $('#register-modal').css('display', 'block');
});

$('.close').on('click', function() {
  $('#login-modal, #register-modal').css('display', 'none');
});

$(window).on('click', function(event) {
  if (event.target === document.getElementById('login-modal')) {
    $('#login-modal').css('display', 'none');
  } else if (event.target === document.getElementById('register-modal')) {
    $('#register-modal').css('display', 'none');
  }
});
