document.addEventListener('DOMContentLoaded', function() {
    const letters = ['letter-s', 'letter-t', 'letter-e1', 'letter-p', 'letter-2', 'letter-1'];
    // Функция для схлопывания текста в букву "s"
    function collapseToS() {
        letters.slice(1, 4).reverse().forEach((id, index) => { // Изменено, чтобы скрывать только "t", "e", "p"
            setTimeout(() => {
                const letter = document.getElementById(id);
                letter.classList.remove('visible');
                letter.classList.add('non-clickable');
            }, 220 * index); // Мгновенная смена видимости с задержкой
        });
    }

    // Функция для раскрытия текста из буквы "s"
    function expandFromS() {
        letters.slice(1, 4).forEach((id, index) => { // Изменено, чтобы отображать только "t", "e", "p"
            setTimeout(() => {
                const letter = document.getElementById(id);
                letter.classList.add('visible');
                letter.classList.remove('non-clickable');
            }, 330 * index); // Мгновенная смена видимости с задержкой
        });
    }

    // Флаг для отслеживания состояния (раскрыто/схлопнуто)
    let isExpanded = false;

    // Обработчик клика для всех букв
    letters.forEach((id) => {
        document.getElementById(id).addEventListener('click', function() {
            if (isExpanded) {
                // document.getElementById("cd").style.transition = "transform 1.s; ";
                document.getElementById("cd").style.transform = "translateX(0px)";
                collapseToS();
                isExpanded = false;
            } else if (id === 'letter-s') {
                document.getElementById("cd").style.transform = "translateX(84px)";
                expandFromS();
                isExpanded = true;
            }
        });
    });
});
