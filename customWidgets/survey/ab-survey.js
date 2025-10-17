/**
 * La variable SURVEY_QUESTIONS permet de définir la liste de questions du questionnaire.
 **/
const SURVEY_QUESTIONS = [
	{
		type: 'single-choice',
		question: 'Quel est ta couleur préférée ?',
		responses: ['Orange', 'Vert', 'Jaune', 'Bleu', 'Autre'],
		scenarios: [
			{
				answer: ['Orange'],
				nextQuestion: 3,
			},
			{
				answer: ['Vert', 'Jaune'],
				nextQuestion: 4,
			},
		],
		required: true,
	},
	{
		type: 'multiple-choice',
		question: 'Quels sont tes jours de la semaine favoris ?',
		responses: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
		scenarios: [],
		required: true,
	},
	{
		type: 'scaled-choice',
		question: 'A quel niveau ce site Web correspond-il à vos besoins ?',
		responses: {
			range: 5,
			minimum: 'Cold',
			maximum: 'Hot',
		},
		scenarios: [],
		required: false,
	},
	{
		type: 'open-answer',
		question: 'Quel est ton avis sur SuperStream ?',
		responses: null,
		scenarios: [],
		required: false,
	},
];

/**
 * AB Tasty - Questionnaire
 * ----------------------------------------------------------------
 * Variables made available by AB Tasty:
 * - HTML for the html block
 * - DATA for the form data
 * - TEST_ID for the current test id
 */
const surveyContainer = document.createElement('div');
surveyContainer.classList.add('AB_survey-container');
surveyContainer.innerHTML = HTML;
const survey = surveyContainer.querySelector('.AB_survey');
const formAnswer = survey.querySelector('.AB_survey-formAnswer');
const counter = {
	current: 1,
	index: 0,
	total: SURVEY_QUESTIONS.length,
};
const callToActions = {
	close: survey.querySelector('.AB_survey-closeButton'),
	answer: survey.querySelector('.AB_survey-answerButton'),
	form: survey.querySelector('.AB_survey-formButton'),
};
let isSurveyReadyToSend = false;
let answers = [];

/**
 * Get the requires more details input template
 * @param {String} reference Question reference
 * @returns {String} HTML for the required more details block
 */
const getRequiresMoreDetailsTemplate = (reference) => {
	return `
		<div class="AB_survey--hidden" data-details>
			${getLabelWithSiblingInputTemplate({
				reference,
				inputType: 'text',
				value: 'Veuillez préciser :',
				isLabelHidden: false,
			})}
		</div>
	`;
};

/**
 * Does the answer require more details?
 * @param {String} value Response value
 * @returns {Boolean} Does the answer require more details?
 */
const doesAnswerRequiresMoreDetails = (value) => {
	return typeof value === 'string' && value.includes('autre');
};

/**
 * Get label with sibling textarea element
 * @param {Object} options Related options
 * @param {String} options.reference Question reference
 * @param {String} options.value Response value
 * @param {Boolean} options.isRequired Is the response required?
 * @returns {String} HTML for the answer
 */
const getLabelWithSiblingTextAreaTemplate = ({ reference, isRequired = false }) => {
	return `
		<label class="AB_survey-formLabel AB_survey--visuallyhidden" for="${reference}">
			${SURVEY_QUESTIONS[counter.index].question}
		</label>
		<textarea 
			class="AB_survey-formTextArea" 
			id="${reference}" 
			name="${reference}"
			rows="5" 
			cols="33"
			${isRequired ? 'minLength="1" required' : ''}
		></textarea>
    `;
};

/**
 * Get label with nested input element
 * @param {Object} options Related options
 * @param {String} options.reference Question reference
 * @param {String} options.inputType Input type to use
 * @param {String} options.value Question current response value
 * @param {Boolean} options.isRequired Is the response required?
 * @param {Boolean} options.isLabelHidden Is the label hidden?
 * @returns {String} HTML for the answer
 */
const getLabelWithSiblingInputTemplate = ({
	reference,
	inputType,
	value,
	isRequired = false,
	isLabelHidden = false,
}) => {
	const valueAttribute = `value="${typeof value === 'string' ? value.toLowerCase() : value}"`;

	let template = `
		<label 
			class="
				AB_survey-formLabel
				${isLabelHidden ? 'AB_survey--visuallyhidden' : ''}
				${valueAttribute.includes('autre') ? 'requiresMoreDetails' : ''}
			"
			for="${reference}"
		>${value}</label>
		<input 
			class="AB_survey-formInput" 
			id="${reference}" 
			type="${inputType}" 
			name="${reference}" 
			${inputType === 'text' ? (isRequired ? 'minLength="1"' : '') : valueAttribute}
			${isRequired ? 'required' : ''}
		/>
	`;

	if (doesAnswerRequiresMoreDetails(valueAttribute)) {
		template = template.concat(getRequiresMoreDetailsTemplate(reference));
	}

	return template;
};

/**
 * Get label with nested input element
 * @param {Object} options Related options
 * @param {String} options.reference Question reference
 * @param {String} options.inputType Input type to use
 * @param {String} options.value Response value
 * @param {Boolean} options.isRequired Is the response required?
 * @returns {String} HTML for the answer
 */
const getLabelWithNestedInputTemplate = ({ reference, inputType, value, isRequired = false }) => {
	const valueAttribute = `value="${typeof value === 'string' ? value.toLowerCase() : value}"`;

	let template = `
		<label class="AB_survey-formLabel ${valueAttribute.includes('autre') ? 'requiresMoreDetails' : ''}">
		<input 
			class="AB_survey-formInput" 
			type="${inputType}" 
			name="${reference}" 
			${inputType === 'text' ? (isRequired ? 'minLength="1"' : '') : valueAttribute}
			${isRequired ? 'required' : ''}
			/>${value}
		</label>
	`;

	if (doesAnswerRequiresMoreDetails(valueAttribute)) {
		template = template.concat(getRequiresMoreDetailsTemplate(reference));
	}

	return template.trim();
};

/**
 * Check that at least one answer is checked
 * @param {Array} Possible answers
 */
const isAtLeastOneAnswerChecked = (answers) => {
	const answersLength = answers.length;

	for (let i = 0; i < answersLength; i++) {
		if (answers[i].checked) return true;
	}

	return false;
};

/**
 * Update next call to action status
 * @param {String} condition Condition that defines if disabled or not
 */
const updateCallToActionNextStatus = (condition) => {
	condition ? callToActions.form.removeAttribute('disabled') : callToActions.form.setAttribute('disabled', '');
};

/**
 * Handle open answer question format
 * @param {String} reference Question reference
 * @returns {HTMLElement} HTML for the answer element
 */
const handleOpenAnswer = (reference) => {
	const div = document.createElement('div');
	div.classList.add('AB_survey-openAnswer');

	const html = getLabelWithSiblingTextAreaTemplate({
		reference,
		isRequired: SURVEY_QUESTIONS[counter.index].required,
	});
	div.insertAdjacentHTML('beforeend', html);

	return div;
};

/**
 * Handle scaled choice question format
 * @param {String} reference Question reference
 * @returns {HTMLElement} HTML for the answer element
 */
const handleScaledChoice = (reference) => {
	const div = document.createElement('div');
	div.classList.add('AB_survey-scaledChoice');

	const spanMinimum = document.createElement('span');
	const spanMaximum = document.createElement('span');

	spanMinimum.classList.add('AB_survey-scaledChoiceMinimum');
	spanMinimum.innerText = SURVEY_QUESTIONS[counter.index].responses.minimum;
	div.insertAdjacentElement('beforeend', spanMinimum);

	[...Array(SURVEY_QUESTIONS[counter.index].responses.range).keys()].forEach((number) => {
		const html = getLabelWithSiblingInputTemplate({
			reference,
			inputType: 'radio',
			value: number + 1,
			isRequired: SURVEY_QUESTIONS[counter.index].required,
			isLabelHidden: true,
		});
		div.insertAdjacentHTML('beforeend', html);
	});

	spanMaximum.classList.add('AB_survey-scaledChoiceMaximum');
	spanMaximum.innerText = SURVEY_QUESTIONS[counter.index].responses.maximum;
	div.insertAdjacentElement('beforeend', spanMaximum);

	return div;
};

/**
 * Handle multiple choice question format
 * @param {String} reference Question reference
 * @returns {HTMLElement} HTML for the answer element
 */
const handleMultipleChoice = (reference) => {
	const div = document.createElement('div');
	div.classList.add('AB_survey-multipleChoice');

	SURVEY_QUESTIONS[counter.index].responses.forEach((response) => {
		const html = getLabelWithNestedInputTemplate({
			reference,
			inputType: 'checkbox',
			value: response,
			isRequired: SURVEY_QUESTIONS[counter.index].required,
		});
		div.insertAdjacentHTML('beforeend', html);
	});

	return div;
};

/**
 * Handle single choice question format
 * @param {String} reference Question reference
 * @returns {HTMLElement} HTML for the answer element
 */
const handleSingleChoice = (reference) => {
	const div = document.createElement('div');
	div.classList.add('AB_survey-singleChoice');

	SURVEY_QUESTIONS[counter.index].responses.forEach((response) => {
		const html = getLabelWithNestedInputTemplate({
			reference,
			inputType: 'radio',
			value: response,
			isRequired: SURVEY_QUESTIONS[counter.index].required,
		});
		div.insertAdjacentHTML('beforeend', html);
	});

	return div;
};

/**
 * Update counter based on scenarios if any is fulfilled
 */
const updateCounterBasedOnScenarios = () => {
	SURVEY_QUESTIONS[counter.index].scenarios.forEach((scenario) => {
		if (scenario.answer.some((answer) => response.includes(answer.toLowerCase()))) {
			counter.current = scenario.nextQuestion;
		}
	});
};

/**
 * Send data to AB Tasty
 */
const sendDataToAbTasty = () => {
	const accountId = window.ABTasty.accountData.accountSettings.identifier;
	const visitorId = window.ABTasty.visitor.id;
	const npsId = `nps-${TEST_ID}`;

	answers.forEach((answer) => {
		// Do not remove the hyphen (-) in the nf value: It is used to separate the question from its answer in Excel.
		window.abtasty.send('nps', {
			t: 'nps',
			cid: accountId,
			vid: visitorId,
			nid: npsId,
			ns: 0,
			nf: answer.details
				? `${answer.question} - ${answer.response} ${answer.details} - ${visitorId}`
				: `${answer.question} - ${answer.response} - ${visitorId}`,
		});
	});
};

/**
 * Handle the answers from the current question
 * @param {HTMLElement} questionElement Question DOM element
 */
const handleAnsweredQuestion = (questionElement) => {
	const questionType = SURVEY_QUESTIONS[counter.index].type;
	let responses, details;

	if (questionElement.hasAttribute('data-ignored')) {
		responses = ['Question ignorée.'];
	} else if (['single-choice', 'multiple-choice', 'scaled-choice'].includes(questionType)) {
		checkedInputs = [...questionElement.querySelectorAll('.AB_survey-formInput:checked')];
		responses = checkedInputs.map((checkedInput) => checkedInput.value);

		const answerDetails = questionElement.querySelector('[data-details]');
		if (answerDetails) {
			const detailsValue = answerDetails.querySelector('.AB_survey-formInput[type="text"]').value;
			detailsValue && (details = detailsValue);
		}
	} else {
		responses = [questionElement.querySelector('.AB_survey-formTextArea').value];
	}

	responses.forEach((response) => {
		answers.push({
			question: SURVEY_QUESTIONS[counter.index].question,
			questionType,
			response,
			details,
		});
	});
};

/**
 * Check if question is being ignored
 * @param {HTMLElement} questionElement Question DOM element
 * @returns {Boolean} Is question being ignored or not?
 */
const isQuestionIgnored = (questionElement) => {
	let checkedInputs = [];
	let textAreaValue = '';

	if (
		['single-choice', 'multiple-choice', 'scaled-choice'].includes(
			SURVEY_QUESTIONS[counter.index].type
		)
	) {
		checkedInputs = [...questionElement.querySelectorAll('.AB_survey-formInput:checked')];
	} else {
		textAreaValue = questionElement.querySelector('.AB_survey-formTextArea').value;
	}

	return checkedInputs.length === 0 && !textAreaValue;
};

/**
 * Insert survey as modal element (default behavior)
 */
insertPopinAsModal = () => {
	const div = document.createElement('div');

	div.classList.add('AB_survey-overlay');
	survey.classList.add('AB_survey-modal');

	surveyContainer.insertAdjacentElement('afterbegin', div);
	document.querySelector('body').insertAdjacentElement('afterbegin', surveyContainer);
	document.querySelector('html').classList.add('AB_survey-isDisplayed')

	document.querySelector('.AB_survey-overlay')?.addEventListener('click', onClickClose, {
		once: true,
	});
};

/**
 * Insert survey as push element
 */
insertPopinAsPush = () => {
	survey.classList.add('AB_survey-push');
	document.querySelector(DATA.displaySelector).insertAdjacentElement('beforeend', surveyContainer);
};

/**
 * Add input answer events listeners
 */
const addInputAnswerChangeEvents = () => {
	const answerInputTargets = [...formAnswer.querySelectorAll('.AB_survey-formInput')];

	answerInputTargets.forEach((answerInputTarget) => {
		if (answerInputTarget.hasAttribute('type') && answerInputTarget.getAttribute('type') === 'text') {
			answerInputTarget.addEventListener('input', () => {
				const condition = answerInputTarget.value.length >= answerInputTarget.getAttribute('minlength');
				updateCallToActionNextStatus(condition);
			});
		} else {
			answerInputTarget.addEventListener('change', () => {
				const condition = answerInputTarget.checked || isAtLeastOneAnswerChecked(answerInputTargets);
				updateCallToActionNextStatus(condition);
			});
		}
	});
};

/**
 * Add textarea answer events listeners
 */
const addTextAreaAnswerChangeEvents = () => {
	const answerTextAreaTargets = [...formAnswer.querySelectorAll('.AB_survey-formTextArea')];

	answerTextAreaTargets.forEach((answerTextAreaInput) => {
		answerTextAreaInput.addEventListener('input', () => {
			const condition = answerTextAreaInput.value.length >= answerTextAreaInput.getAttribute('minlength');
			updateCallToActionNextStatus(condition);
		});
	});
};

/**
 * Add requires more details related events listeners
 * @param {Boolean} isRequired Is the response required?
 */
const addRequiresMoreDetailsEvents = (isRequired) => {
	const moreDetailsTarget = formAnswer.querySelector('.requiresMoreDetails');
	const relatedTargets = [...formAnswer.querySelectorAll('.AB_survey-formLabel:not(.requiresMoreDetails)')];
	const moreDetailsAnswerArea = moreDetailsTarget.nextElementSibling;
	const moreDetailsAnswer = moreDetailsAnswerArea.querySelector('.AB_survey-formInput');

	moreDetailsTarget.addEventListener('change', () => {
		moreDetailsTarget.style.marginBottom = '10px';
		moreDetailsAnswerArea.classList.toggle('AB_survey--hidden');
		isRequired && moreDetailsAnswer.toggleAttribute('required');
	});
	relatedTargets.forEach((relatedTarget) => {
		relatedTarget.addEventListener('change', () => {
			moreDetailsAnswerArea.classList.add('AB_survey--hidden');
			isRequired && moreDetailsAnswer.removeAttribute('required');
		});
	});
};

/**
 * Get the HTML for the answer block
 * @returns {HTMLElement} HTML for the answer element
 */
const getAnswerHtml = () => {
	const reference = `question-${SURVEY_QUESTIONS.indexOf(SURVEY_QUESTIONS[counter.index])}`;
	let answerHtml;

	switch (SURVEY_QUESTIONS[counter.index].type) {
		case 'single-choice':
			answerHtml = handleSingleChoice(reference);
			break;
		case 'multiple-choice':
			answerHtml = handleMultipleChoice(reference);
			break;
		case 'scaled-choice':
			answerHtml = handleScaledChoice(reference);
			break;
		case 'open-answer':
			answerHtml = handleOpenAnswer(reference);
			break;
		default:
			console.warn('AB_Questionnaire_Popin::getAnswerHtml →', 'Unknown question type');
			break;
	}

	answerHtml && answerHtml.setAttribute('data-question-index', counter.current);

	return answerHtml;
};

/**
 * On click form button actions
 */
const onClickFormButton = () => {
	const questionElement = formAnswer.querySelector(`[data-question-index="${counter.current}"]`);

	isQuestionIgnored(questionElement) && questionElement.setAttribute('data-ignored', '');

	if (isSurveyReadyToSend) {
		handleAnsweredQuestion(questionElement);
		sendDataToAbTasty();
		
		survey.querySelector('.AB_survey-question').classList.add('AB_survey--hidden');
		survey.querySelector('.AB_survey-thankyou').classList.remove('AB_survey--hidden');

		setTimeout(() => survey.closest('.AB_survey-container').setAttribute('hidden', ''), 2000);
	} else {
		handleAnsweredQuestion(questionElement);

		counter.current++;
		counter.index++;

		if (SURVEY_QUESTIONS[counter.index].scenarios.length > 0) {
			SURVEY_QUESTIONS[counter.index].scenarios.forEach((scenario) => {
				if (scenario.answer.some((answer) => response.includes(answer.toLowerCase()))) {
					counter.current = scenario.nextQuestion;
					counter.index = counter.current - 1; // index starts at 0, always -1 of current
				}
			});
		}

		try {
			updatePopinSurvey();
		} catch (error) {
			console.warn('AB_Questionnaire_Popin::onClickFormButton::updatePopinSurvey →', error);
			displayErrorView();
		}
	}
};

/**
 * On click answer button actions
 */
const onClickAnswerButton = () => {
	survey.querySelector('.AB_survey-question').classList.remove('AB_survey--hidden');
	survey.querySelector('.AB_survey-about').classList.add('AB_survey--hidden');
};

/**
 * On click close actions
 */
const onClickClose = () => {
	survey.closest('.AB_survey-container').setAttribute('hidden', '');
	document.querySelector('html').classList.remove('AB_survey-isDisplayed');
};

/**
 * Display survey based on selected option
 */
const displayPopin = () => {
	try {
		DATA.displayOptions === 'after-block'
			? insertPopinAsPush()
			: setTimeout(() => insertPopinAsModal(), DATA.triggerTimer * 1000);
	} catch (error) {
		console.warn('AB_Questionnaire_Popin::displayPopin →', error);
		insertPopinAsModal();
	}
};

/**
 * Display error view
 */
const displayErrorView = () => {
	survey.querySelector('.AB_survey-about').classList.add('AB_survey--hidden');
	survey.querySelector('.AB_survey-question').classList.add('AB_survey--hidden');
	survey.querySelector('.AB_survey-error').classList.remove('AB_survey--hidden');
	setTimeout(() => survey.closest('.AB_survey-container').setAttribute('hidden', ''), 2000);
};

/**
 * Update survey survey elements
 */
const updatePopinSurvey = () => {
	survey.querySelector('.AB_survey-formLegendQuestion').innerText = SURVEY_QUESTIONS[counter.index].question;

	if (formAnswer.childElementCount !== 0) {
		formAnswer.lastElementChild.classList.add('AB_survey--hidden');
	}
	
	const popinLegendInfo = survey.querySelector('.AB_survey-formLegendInfo');
	if (!SURVEY_QUESTIONS[counter.index].required || SURVEY_QUESTIONS[counter.index].type === 'multiple-choice') {
		const nonRequiredWording = 'facultatif'
		const multipleChoiceWording = 'plusieurs réponses possibles'

		if (!SURVEY_QUESTIONS[counter.index].required && SURVEY_QUESTIONS[counter.index].type === 'multiple-choice') {
			popinLegendInfo.innerText = `(${nonRequiredWording}, ${multipleChoiceWording})`;
		} else if (!SURVEY_QUESTIONS[counter.index].required) {
			popinLegendInfo.innerText = `(${nonRequiredWording})`;
		} else {
			popinLegendInfo.innerText = `(${multipleChoiceWording})`;
		}
			
		popinLegendInfo.classList.remove('AB_survey--hidden');
	} else {
		popinLegendInfo.classList.add('AB_survey--hidden');
	}

	const answerHtml = getAnswerHtml(SURVEY_QUESTIONS[counter.index]);
	formAnswer.appendChild(answerHtml);

	if (formAnswer.querySelector('.requiresMoreDetails')) {
		addRequiresMoreDetailsEvents();
	}

	if (SURVEY_QUESTIONS[counter.index].required) {
		callToActions.form.setAttribute('disabled', '');
		SURVEY_QUESTIONS[counter.index].type === 'open-answer'
			? addTextAreaAnswerChangeEvents()
			: addInputAnswerChangeEvents();
	}

	survey.querySelector('.AB_survey-counterCurrent').innerText = counter.current;

	if (counter.current === counter.total) {
		isSurveyReadyToSend = true;
		callToActions.form.innerText = DATA.sendButtonText || 'Envoyer';
		callToActions.form.removeAttribute('disabled');
	}
};

/**
 * Add survey events listeners
 */
const addPopinEvents = () => {
	callToActions.answer.addEventListener('click', onClickAnswerButton, {
		once: true,
	});
	callToActions.close.addEventListener('click', onClickClose, {
		once: true,
	});
	callToActions.form.addEventListener('click', onClickFormButton);
};

/**
 * Trigger survey based on selected option
 */
const triggerPopin = () => {
	try {
		DATA.triggerOptions === 'on-element-click'
			? document.querySelector(DATA.triggerSelector).addEventListener(
					'click',
					() => {
						displayPopin();
					},
					{
						once: true,
					}
			  )
			: displayPopin();
	} catch (error) {
		console.warn('AB_Questionnaire_Popin::triggerPopin →', error);
		insertPopinAsModal();
	}
};

/**
 * Update custom widget static elements
 */
const updateStaticElements = () => {
	survey.querySelector('.AB_survey-counterTotal').innerText = counter.total;

	if (DATA.displaySurveyAbout) {
		survey.querySelector('.AB_survey-about').classList.add('AB_survey--hidden');
		survey.querySelector('.AB_survey-question').classList.remove('AB_survey--hidden');
	}
};

/**
 * Initialize the custom widget
 */
const init = () => {
	updateStaticElements();
	triggerPopin();
	addPopinEvents();

	try {
		updatePopinSurvey();
	} catch (error) {
		console.warn('AB_Questionnaire_Popin::init →', error);
		surveyContainer.classList.add('AB_survey--hidden');
	}
};

init();
