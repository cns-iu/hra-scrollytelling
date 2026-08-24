const quiz = document.querySelector('[data-story-quiz]');
const checkButton = quiz?.querySelector('[data-story-quiz-check]');
const result = quiz?.querySelector('[data-story-quiz-result]');

/**
 * Replaces the quiz feedback with an icon and announced message
 *
 * @param {string} message Feedback presented to the visitor
 * @param {string} iconSource Decorative status icon source
 * @param {boolean} isCorrect Whether the selected answer is correct
 * @returns {void}
 */
const showResult = (message, iconSource, isCorrect) => {
    if (!result) {
        return;
    }

    const icon = document.createElement('img');
    icon.src = iconSource;
    icon.alt = '';
    icon.width = 24;
    icon.height = 24;

    result.classList.toggle('story-quiz__result--incorrect', !isCorrect);
    result.replaceChildren(icon, document.createTextNode(message));
};

if (quiz && checkButton && result) {
    quiz.addEventListener('change', (event) => {
        if (event.target instanceof HTMLInputElement && event.target.name === 'radiochoice') {
            result.classList.remove('story-quiz__result--incorrect');
            result.replaceChildren();
        }
    });

    checkButton.addEventListener('click', () => {
        const selectedAnswer = quiz.querySelector('input[name="radiochoice"]:checked');

        if (!selectedAnswer) {
            showResult(' Select an answer before checking.', 'img/UI Assets/error.svg', false);
            return;
        }

        if (selectedAnswer.value === 'Choice3') {
            showResult(
                ' Correct! Squiggy is a squamous cell (and pretty proud of it).',
                'img/UI Assets/check_circle.svg',
                true,
            );
            return;
        }

        showResult(' Not quite, please try again.', 'img/UI Assets/error.svg', false);
    });
}
