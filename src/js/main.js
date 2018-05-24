var dom = {
    menu: document.querySelector('.header__mobile__menu'),
    menuLine: document.querySelectorAll('.header__mobile__menu__line'),
    modal: document.querySelector('.header__mobile__modal'),
};

for (let i = 0; i < dom.menuLine.length; i++) {
    dom.menu.addEventListener('mouseover', function () {
        if (dom.menuLine[i].dataset.line === "middle") {
            dom.menuLine[i].style.marginLeft = '0px';
            dom.menuLine[i].style.width = '30px';
        }
    })
}

for (let i = 0; i < dom.menuLine.length; i++) {
    dom.menu.addEventListener('mouseleave', function () {
        if (dom.menuLine[i].dataset.line === "middle") {
            dom.menuLine[i].style.marginLeft = '10px';
            dom.menuLine[i].style.width = '20px';
        }
    })
}



dom.menu.addEventListener('click', function () {
      dom.menu.classList.toggle('change');
      dom.modal.classList.toggle('change');
      dom.modal.classList.toggle('index');
});