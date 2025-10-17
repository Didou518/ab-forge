/**
 * Form elements are used to let the user customize elements in AB Tasty's campaign editor panel
 * Documentation: https://developers.abtasty.com/docs/custom-widgets/custom-widgets-form
 *
 * Required properties:
 * - type: The type of field to display in the editor panel
 * - propName: Object key that will be used to access the data
 * - label: The label displayed to the user (helps defining the purpose of the value to set)
 * - value or checked: Default value that will be used
 */

/**
 * Trigger elements
 */
const triggerOptions = {
	type: 'select',
	label: 'Déclencheur du questionnaire',
	propName: 'triggerOptions',
	value: 'on-page-load',
	options: [
		{
			label: 'Au chargement de la page (par défaut)',
			value: 'on-page-load',
		},
		{
			label: 'Au clic sur un élément déclencheur',
			value: 'on-element-click',
		},
	],
};

const triggerTimer = {
	type: 'number',
	propName: 'triggerTimer',
	label: 'Afficher après un délai (en secondes)',
	value: 0
}

const triggerSelector = {
	type: 'selectelement',
	propName: 'triggerSelector',
	label: "Sélecteur de l'élément déclencheur (inutile pour le mode par défaut)",
	value: 'body',
};

const triggerGroup = {
	type: 'group',
	label: 'Déclenchement',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...triggerOptions },
		{ ...triggerTimer },
		{ ...triggerSelector }
	],
};

/**
 * Display elements
 */
const displayOptions = {
	type: 'select',
	label: 'Positionnement du questionnaire',
	propName: 'displayOptions',
	value: 'page-centered',
	options: [
		{
			label: 'Au centre (mode popin, par défaut)',
			value: 'page-centered',
		},
		{
			label: 'Après un bloc spécifique',
			value: 'after-block',
		},
	],
};

const displaySelector = {
	type: 'selectelement',
	propName: 'displaySelector',
	label: 'Sélecteur de l’élément conditionnant le positionnement (inutile pour le mode par défaut)',
	value: 'body',
};

const displaySurveyAbout = {
	type: 'checkbox',
	propName: 'displaySurveyAbout',
	label: 'Ne pas afficher le texte à propos',
	checked: false,
};

const displayGroup = {
	type: 'group',
	label: 'Affichage',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...displayOptions },
		{ ...displaySelector },
		{ ...displaySurveyAbout }
	],
};

/**
 * Container elements
 */
const containerWidth = {
	type: 'number',
	label: 'Largeur (px)',
	propName: 'containerWidth',
	value: 420,
	min: 320,
	max: 1280,
};

const containerMargin = {
	type: 'areainput',
	label: 'Marges externes (px)',
	propName: 'containerMargin',
	value: [{ top: 0, left: 0, bottom: 0, right: 0 }],
};

const containerPadding = {
	type: 'areainput',
	label: 'Marges internes (px)',
	propName: 'containerPadding',
	value: [{ top: 20, left: 30, bottom: 30, right: 30 }],
};

const containerBackgroundColor = {
	type: 'colorpicker',
	propName: 'containerBackgroundColor',
	label: 'Couleur du fond',
	value: '#fff',
};

const containerBorderColor = {
	type: 'colorpicker',
	label: 'Couleur de la bordure',
	propName: 'containerBorderColor',
	value: '#000',
};

const containerBorderWidth = {
	type: 'slider',
	label: 'Épaisseur de la bordure (px)',
	propName: 'containerBorderWidth',
	value: 2,
	min: 0,
	max: 10,
};

const containerBorderRadius = {
	type: 'slider',
	label: 'Courbure des coins (px)',
	propName: 'containerBorderRadius',
	value: 5,
	min: 0,
	max: 20,
};

const containerGroup = {
	type: 'group',
	label: 'Styles du conteneur',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...containerWidth },
		{ ...containerMargin },
		{ ...containerPadding },
		{ ...containerBackgroundColor },
		{ ...containerBorderColor },
		{ ...containerBorderWidth },
		{ ...containerBorderRadius },
	],
};

/**
 * Texts elements
 */
const titleText = {
	type: 'text',
	propName: 'titleText',
	label: 'Titre du questionnaire (facultatif)',
	value: 'Titre du questionnaire',
};

const aboutText = {
	type: 'textarea',
	propName: 'aboutText',
	label: 'Texte à propos (facultatif)',
	value: 'Texte à propos',
	rows: 5,
};

const thankyouText = {
	type: 'text',
	propName: 'thankyouText',
	label: 'Message de remerciement',
	value: 'Merci pour vos retours.',
};

const errorText = {
	type: 'text',
	propName: 'errorText',
	label: 'Message en cas d\'erreur',
	value: 'Nous sommes désolés, une erreur est survenue. Veuillez réessayer ultérieurement.',
};

const textGroup = {
	type: 'group',
	label: 'Textes',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...titleText },
		{ ...aboutText },
		{ ...thankyouText },
		{ ...errorText },
	],
};

/**
 * Styles des textes
 */
const availableFonts = [
	{
		label: 'Héritée de l\'élément',
		value: 'inherit',
		description: '',
	},
	{
		label: 'Baskervville',
		value: 'Baskervville',
		description: '2 styles',
	},
	{
		label: 'Besley',
		value: 'Besley',
		description: '12 styles',
	},
	{
		label: 'Caveat',
		value: 'Caveat',
		description: '4 styles',
	},
	{
		label: 'Dancing Script',
		value: 'Dancing Script',
		description: '4 styles',
	},
	{
		label: 'Heebo',
		value: 'Heebo',
		description: '9 styles',
	},
	{
		label: 'Inter',
		value: 'Inter',
		description: '9 styles',
	},
	{
		label: 'Lato',
		value: 'Lato',
		description: '10 styles',
	},
	{
		label: 'Lora',
		value: 'Lora',
		description: '8 styles',
	},
	{
		label: 'Montserrat',
		value: 'Montserrat',
		description: '18 styles',
	},
	{
		label: 'Nunito',
		value: 'Nunito',
		description: '16 styles',
	},
	{
		label: 'Open Sans',
		value: 'Open Sans',
		description: '10 styles',
	},
	{
		label: 'Oswald',
		value: 'Oswald',
		description: '6 styles',
	},
	{
		label: 'Playfair Display',
		value: 'Playfair Display',
		description: '12 styles',
	},
	{
		label: 'PT Sans Narrow',
		value: 'PT Sans Narrow',
		description: '2 styles',
	},
	{
		label: 'PT Serif',
		value: 'PT Serif',
		description: '4 styles',
	},
	{
		label: 'Red Hat Text',
		value: 'Red Hat Text',
		description: '10 styles',
	},
	{
		label: 'Roboto',
		value: 'Roboto',
		description: '12 styles',
	},
	{
		label: 'Roboto Slab',
		value: 'Roboto Slab',
		description: '9 styles',
	},
	{
		label: 'STIX Two Text',
		value: 'STIX Two Text',
		description: '8 styles',
	},
	{
		label: 'Ubuntu',
		value: 'Ubuntu',
		description: '8 styles',
	},
	{
		label: 'Work Sans',
		value: 'Work Sans',
		description: '18 styles',
	},
];

const textColor = {
	type: 'colorpicker',
	propName: 'textColor',
	label: 'Couleur des textes',
	value: '#000',
};

const textFontFamily = {
	type: 'searchselect',
	label: 'Police des textes',
	propName: 'textFontFamily',
	value: 'inherit',
	filterable: 'inherit',
	options: availableFonts,
};

const textSize = {
	type: 'slider',
	label: 'Taille des textes',
	propName: 'textSize',
	value: 16,
	min: 8,
	max: 30,
};

const titleTextAlign = {
	type: 'radioImage',
	propName: 'titleTextAlign',
	label: 'Alignement du titre',
	value: 'left',
	style: 'little',
	options: [
		{
			label: 'Left',
			value: 'left',
			src: `https://widgets-images.abtasty.com/style/icon-text-alignLeft.png`,
		},
		{
			label: 'Center',
			value: 'center',
			src: `https://widgets-images.abtasty.com/style/icon-text-alignCenter.png`,
		},
		{
			label: 'Right',
			value: 'right',
			src: `https://widgets-images.abtasty.com/style/icon-text-alignRight.png`,
		},
	],
};

const titleTextColor = {
	type: 'colorpicker',
	label: 'Couleur du titre',
	propName: 'titleTextColor',
	value: '#000',
};

const titleFontFamily = {
	type: 'searchselect',
	label: 'Police du titre',
	propName: 'titleFontFamily',
	value: 'inherit',
	filterable: 'inherit',
	options: availableFonts,
};

const titleTextSize = {
	type: 'slider',
	label: 'Taille du titre (px)',
	propName: 'titleTextSize',
	value: 24,
	min: 8,
	max: 50,
};

const aboutTextAlign = {
	type: 'radioImage',
	propName: 'aboutTextAlign',
	label: 'Alignement du texte à propos',
	value: 'left',
	style: 'little',
	options: [
		{
			label: 'Left',
			value: 'left',
			src: `https://widgets-images.abtasty.com/style/icon-text-alignLeft.png`,
		},
		{
			label: 'Center',
			value: 'center',
			src: `https://widgets-images.abtasty.com/style/icon-text-alignCenter.png`,
		},
		{
			label: 'Right',
			value: 'right',
			src: `https://widgets-images.abtasty.com/style/icon-text-alignRight.png`,
		},
	],
};

const questionTextColor = {
	type: 'colorpicker',
	label: 'Couleur des questions',
	propName: 'questionTextColor',
	value: '#000',
};

const questionFontFamily = {
	type: 'searchselect',
	label: 'Police des questions',
	propName: 'questionFontFamily',
	value: 'inherit',
	filterable: 'inherit',
	options: availableFonts,
};

const questionTextSize = {
	type: 'slider',
	label: 'Taille des questions (px)',
	propName: 'questionTextSize',
	value: 24,
	min: 8,
	max: 50,
};

const counterTextSize = {
	type: 'slider',
	label: 'Taille du texte du compteur',
	propName: 'counterTextSize',
	value: 12,
	min: 8,
	max: 30,
};

const textStylesGroup = {
	type: 'group',
	label: 'Styles des textes',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...textColor },
		{ ...textFontFamily },
		{ ...textSize },
		{ ...titleTextAlign },
		{ ...titleTextColor },
		{ ...titleFontFamily },
		{ ...titleTextSize },
		{ ...aboutTextAlign },
		{ ...questionTextColor },
		{ ...questionFontFamily },
		{ ...questionTextSize},
		{ ...counterTextSize },
	],
};

/**
 * Buttons' texts
 */
const aboutButtonText = {
	type: 'text',
	propName: 'aboutButtonText',
	label: 'Texte du bouton pour confirmer son envie de participer',
	value: 'Je réponds',
};

const nextButtonText = {
	type: 'text',
	propName: 'nextButtonText',
	label: 'Texte du bouton pour passer à la question suivante',
	value: 'Suivant',
};

const sendButtonText = {
	type: 'text',
	propName: 'sendButtonText',
	label: 'Texte du bouton pour envoyer ses réponses',
	value: 'Envoyer',
};

const buttonTextGroup = {
	type: 'group',
	label: 'Textes des boutons',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...aboutButtonText },
		{ ...nextButtonText },
		{ ...sendButtonText }
	],
};

/**
 * Buttons' styles
 */
const closeButtonTextColor = {
	type: 'colorpicker',
	propName: 'closeButtonTextolor',
	label: 'Couleur de la croix de fermeture',
	value: '#000',
};

const buttonBackgroundColor = {
	type: 'colorpicker',
	propName: 'buttonBackgroundColor',
	label: 'Couleur du fond des boutons',
	value: '#fff',
};

const buttonTextColor = {
	type: 'colorpicker',
	propName: 'buttonTextColor',
	label: 'Couleur du texte du bouton',
	value: '#000',
};

const buttonTextSize = {
	type: 'slider',
	propName: 'buttonTextSize',
	label: 'Taille des textes des boutons',
	value: 16,
	min: 8,
	max: 30,
};

const buttonFontWeight = {
	type: 'select',
	label: 'Style des textes des boutons',
	propName: 'buttonFontWeight',
	value: 'normal',
	options: [
		{
			label: 'Normal',
			value: 'normal',
		},
		{
			label: 'Gras',
			value: 'bold',
		}
	],
};

const buttonBorderColor = {
	type: 'colorpicker',
	label: 'Couleur de la bordure des boutons',
	propName: 'buttonBorderColor',
	value: '#000',
};

const buttonBorderWidth = {
	type: 'slider',
	label: 'Épaisseur de la bordure des boutons (px)',
	propName: 'buttonBorderWidth',
	value: 1,
	min: 0,
	max: 10,
};

const buttonBorderRadius = {
	type: 'slider',
	label: 'Courbure des coins des boutons (px)',
	propName: 'buttonBorderRadius',
	value: 5,
	min: 0,
	max: 10,
};

const buttonStylesGroup = {
	type: 'group',
	label: 'Styles des boutons',
	collapsible: true,
	collapsed: true,
	children: [
		{ ...closeButtonTextColor },
		{ ...buttonBackgroundColor },
		{ ...buttonTextColor },
		{ ...buttonTextSize },
		{ ...buttonFontWeight},
		{ ...buttonBorderColor },
		{ ...buttonBorderWidth },
		{ ...buttonBorderRadius },
	],
};

return [
	triggerGroup,
	displayGroup,
	containerGroup,
	textGroup,
	textStylesGroup,
	buttonTextGroup,
	buttonStylesGroup
];
