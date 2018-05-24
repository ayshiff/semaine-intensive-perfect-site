var form = document.querySelector('.contact__formSection__form');
var inputs = document.querySelectorAll('.contact__formSection__form__input');
var confirm = document.querySelector('.confirmation');

form.addEventListener('submit', function (event) {
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value === '') {
      event.preventDefault();
      return;
    } else {
      event.preventDefault();
      confirm.style.display = 'flex';
    }
  }
})
