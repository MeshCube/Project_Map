// Определение переменных и начальных значений
const elViewport = document.querySelector(".viewport");
const elCanvas = elViewport.querySelector(".canvas");
const tooltip = document.getElementById('tooltip');
const tooltipContent = document.getElementById('tooltip-content');

let scale = 1;
const scaleFactor = 0.15;

const offset = {
  x: 0,
  y: 0
};

let isPanning = false;
let startPos = { x: 0, y: 0 };

elViewport.addEventListener("wheel", (ev) => {
  ev.preventDefault();
  const delta = Math.sign(-ev.deltaY); 

  const scaleOld = scale; 
  scale *= Math.exp(delta * scaleFactor); 

  const vptRect = elViewport.getBoundingClientRect();
  const cvsW = elCanvas.offsetWidth * scaleOld;
  const cvsH = elCanvas.offsetHeight * scaleOld;
  const cvsX = (elViewport.offsetWidth - cvsW) / 2 + offset.x;
  const cvsY = (elViewport.offsetHeight - cvsH) / 2 + offset.y;
  const originX = ev.x - vptRect.x - cvsX - cvsW / 2;
  const originY = ev.y - vptRect.y - cvsY - cvsH / 2;

  const xOrg = originX / scaleOld;
  const yOrg = originY / scaleOld;

  const xNew = xOrg * scale;
  const yNew = yOrg * scale;

  const xDiff = originX - xNew;
  const yDiff = originY - yNew;

  offset.x += xDiff;
  offset.y += yDiff;

  elCanvas.style.scale = scale;
  elCanvas.style.translate = `${offset.x}px ${offset.y}px`;

  tooltip.style.display = 'none';
});

elViewport.addEventListener("mousedown", (ev) => {
  if (ev.button === 2) {
    isPanning = true;
    startPos = { x: ev.clientX, y: ev.clientY };
    tooltip.style.display = 'none';
  }
});

elViewport.addEventListener("mousemove", (ev) => {
  if (isPanning) {
    const deltaX = ev.clientX - startPos.x;
    const deltaY = ev.clientY - startPos.y;

    offset.x += deltaX;
    offset.y += deltaY;

    elCanvas.style.translate = `${offset.x}px ${offset.y}px`;

    startPos = { x: ev.clientX, y: ev.clientY };
  }
});

elViewport.addEventListener("mouseup", () => {
  if (isPanning) {
    isPanning = false;
  }
});

elViewport.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
});

document.querySelectorAll('.box').forEach(box => {
    const arrow = box.querySelector('.arrow');
    const dropdown = box.querySelector('.dropdown-content');

    const toggleDropdown = () => {
        const isActive = box.classList.contains('active');
        
        if (isActive) {
            dropdown.style.maxHeight = dropdown.scrollHeight + 'px'; 
            setTimeout(() => {
                dropdown.style.maxHeight = null;
                dropdown.style.opacity = '0';
            }, 0); 
            box.classList.remove('active');
            box.classList.remove('no-radius'); // Убираем округление
        } else {
            dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
            dropdown.style.opacity = '1';
            box.classList.add('active');
            box.classList.add('no-radius'); // Добавляем округление
        }
    };

    arrow.addEventListener('click', (event) => {
        event.stopPropagation(); 
        toggleDropdown();
    });

    box.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    dropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});


let activeItem = null;

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (e.target.classList.contains('circle') || e.target.classList.contains('square') || e.target.classList.contains('noactive') || e.target.classList.contains('circle-container') || e.target.classList.contains('circle-three')) {
            return;
        }

        activeItem = e.target; // Сохранение ссылки на активный элемент
        const title = e.target.getAttribute('data-tooltip-title');
        const description = e.target.getAttribute('data-tooltip-description');
        const xp = e.target.getAttribute('data-tooltip-xp');
        const gitUrl = e.target.getAttribute('data-git-url'); // Получение ссылки из атрибута

        tooltipContent.innerHTML = `<strong>${title}</strong><br>${description}<br><em>${xp}</em><br><a href="${gitUrl}" target="_blank" id="gitLink">Git</a>`;
        
        const itemRect = e.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        if (window.innerWidth - itemRect.right > tooltipRect.width) {
            tooltip.style.left = `${itemRect.right + 10}px`;
            tooltip.style.right = 'auto';
        } else {
            tooltip.style.left = 'auto';
            tooltip.style.right = `${window.innerWidth - itemRect.left + 10}px`;
        }
        
        tooltip.style.top = `${itemRect.top}px`;
        tooltip.style.display = 'block';

        // Устанавливаем цвет текста из атрибута или оставляем по умолчанию
        const textColor = e.target.getAttribute('data-text-color');
        if (textColor) {
            e.target.style.color = textColor;
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-item') && !e.target.closest('#gitLink') && !e.target.closest('#tooltip')) {
        tooltip.style.display = 'none';
    }
});

// Обработка выбора цвета
tooltip.querySelectorAll('.color-picker button').forEach(button => {
    button.addEventListener('click', (e) => {
        const color = e.target.getAttribute('data-color');

        // Изменение цвета круга в activeItem
        if (activeItem) {
            const circle = activeItem.querySelector('.circle');
            const circleThree = activeItem.querySelectorAll('.circle-three');
            if (circle) {
                circle.style.borderColor = color;
            } else if(circleThree.length > 0) {
                // Изменение цвета всех кругов, созданных через addCircle()
                circleThree.forEach(circle => {
                    circle.style.borderColor = color;
                });
            }
        } 

        // Подсказка остается видимой после выбора цвета
    });
});

function addCircle(container) {
    const numCircles = 3; // Количество кругов
    const radius = 4; // Радиус окружности (расстояние от центра до кругов)
    const circleDiameter = 7; // Диаметр кругов

    var delta = Math.PI * 2 / numCircles;
    var angle = 11;

    for (var i = 0; i < numCircles; i++) {
        const x = radius * Math.cos(angle) + (container.offsetWidth / 2 - circleDiameter / 2) + 'px';
        const y = radius * Math.sin(angle) + (container.offsetHeight / 2 - circleDiameter / 2) + 'px';

        const circle = document.createElement('div');
        circle.classList.add('circle-three');
        circle.style.left = x;
        circle.style.top = y;

        container.appendChild(circle);

        angle += delta;
    }
}

document.querySelectorAll('.circle-container').forEach(container => {
    addCircle(container);
});

document.querySelectorAll('.circle-noactive').forEach(container => {
    // Получаем circle и circle-three внутри текущего контейнера
    const circle = document.querySelector('.circle');
    const circleThree = container.querySelectorAll('.circle-three');

    // Если есть circle, меняем его цвет границы
    if (circle) {
        circle.style.borderColor = '#9099A2'; // Задаем нужный цвет
    }

    // Если есть circle-three, меняем цвет их границы
    if (circleThree.length > 0) {
        circleThree.forEach(circle => {
            circle.style.borderColor = '#9099A2'; // Задаем нужный цвет
        });
    }
});

document.querySelectorAll('.circle-active').forEach(container => {
    // Получаем circle и circle-three внутри текущего контейнера
    const circle = document.querySelector('.circle');
    const circleThree = container.querySelectorAll('.circle-three');

    // Если есть circle, меняем его цвет границы
    if (circle) {
        circle.style.borderColor = '#ffffff'; // Задаем нужный цвет
    }

    // Если есть circle-three, меняем цвет их границы
    if (circleThree.length > 0) {
        circleThree.forEach(circle => {
            circle.style.borderColor = '#ffffff'; // Задаем нужный цвет
        });
    }
});



