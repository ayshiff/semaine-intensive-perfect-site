var clicRight = document.querySelector('.Container-mainPicture-container_rightArrowImg');
var clicLeft = document.querySelector('.pp1');
var images = document.querySelectorAll('.Container-mainPicture-container');
var index = 0;

var img = [1, 2, 3, 4, 5, 6, 7, 8, 9]

clicRight.addEventListener('click', function() {
  for (var i = 0; i < img.length; i++) {
    images[index].setAttribute('style', 'background-image: url("assets/img/'+ img[i] +'.jpg"');
    images[index]++;
    img[i]++;
    if (img[i] > img.length) {
      img[i] = 1;
    }
  }
  console.log('hiiii');
});

// clicLeft.addEventListener('click', function() {
// for (var i = 0; i < img.length; i++) {
//   var index2 = img[i];
//   images[index2].setAttribute('style','background-image: url("assets/img/'+ img[i] +'.jpg"');
//   images[index]--;
//   img[i]--;
// }
//     console.log('hiiii');
// });
