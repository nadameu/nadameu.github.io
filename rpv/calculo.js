/* global hyperHTML */
const { bind, wire } = hyperHTML;

const store = (() => {
	let subscribers = [];
	const subscribe = subscriber => {
		subscribers.push(subscriber);
		return () => {
			subscribers = subscribers.filter(s => s !== subscriber);
		};
	};

	let state;
	const getState = () => state;
	const setState = newState => {
		state = newState;
		console.log('State:', state);
		subscribers.forEach(subscriber => subscriber());
	};
	return { getState, setState, subscribe };
})();

store.setState({
	'paginaAtual': 0,
	'paginaAlterada': true,

	'qtd-beneficiarios': [1],
	'atrasados': false,
	'ajg': false,
	'sucumbencia': false,

	'metade': 'integral',

	'data-sucumbencia': undefined,
	'pct-sucumbencia': [0],
	'salarios-sucumbencia': [0],

	'data-ajg': undefined,
	'valor-ajg': [200],

	'data-base': undefined,
	'principal': [0],
	'total': [0],
	'tipo-meses': 'qtd',
	'meses-anterior': [0],
	'meses-atual': [0],
	'mes-inicial': undefined,
	'mes-final': undefined,
	'incluir-13o': true,
	'anterior': [0],
	'atual': [0],

	'contrato': false,
	'pct-contratuais': [0],

	'qtd-advogados': [1],
});

const POJO = {
	fold: (...objs) => objs.reduce(
		(obj, props) => Object.assign(obj, props),
		{}
	)
};

const manipulateProps = (props, f) => obj => f(...props.map(prop => obj[prop]));
const createKV = (k, v) => ({ [k]: v });
const modifyStore = (name, f) => {
	const createNewProps = obj => createKV(name, manipulateProps([name], f)(obj));
	const createNewState = state => POJO.fold(state, createNewProps(state));
	store.setState(createNewState(store.getState()));
};
const putStore = (name, value) => modifyStore(name, () => value);
const maybePutStore = (name, maybeValue) =>	{
	modifyStore(name, ([defaultValue]) => [defaultValue].concat(maybeValue));
};

let indiceInput = 0;

const MoedaType = (input = 0) => {
	if (input instanceof MoedaType) return input;
	const _valor = typeof input === 'number' ?
		input :
		parseInt(input.replace(/\D/g, '')) / 100;
	return Object.assign(Object.create(MoedaType.prototype), { _valor });
};
MoedaType.prototype = {
	constructor: MoedaType,
	toString() {
		if (isNaN(this._valor)) return '';
		return this._valor.toLocaleString('pt-BR', {
			style: 'decimal',
			useGrouping: true,
			minimumIntegerDigits: 1,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		});
	},
	valueOf() {
		return this._valor;
	},
};

const salvarBoolean = propriedade => evt => {
	putStore(propriedade, evt.target.checked);
};
const salvarTexto = propriedade => evt => {
	putStore(propriedade, evt.target.value);
};
const salvarValorTransformado = (propriedade, f) => evt => {
	putStore(propriedade, f(evt.target.value));
};
const salvarValorTransformadoComDefault = (propriedade, f) => evt => {
	maybePutStore(propriedade, f(evt.target.value));
};
const onMesAnoInput = ({ target }) => {
	let digitos = target.value.replace(/\D/g, '');
	if (! /^(?:0[1-9]|1[0-2])/.test(digitos))digitos = digitos[0];
	if (! /^[01]/.test(digitos)) digitos = '';
	target.value = digitos.length < 3 ?
		digitos :
		[digitos.slice(0, 2), digitos.slice(2)].join('/');
};
const onMoedaChange = propriedade => salvarValorTransformadoComDefault(
	propriedade,
	texto => [Number(MoedaType(texto))].reduce(
		(vazio, valor) => isNaN(valor) || valor === 0 ? vazio : [valor],
		[]
	)
);
const onMoedaInput = evt => {
	const { target } = evt;
	const { selectionStart, value } = target;
	let cursorIndexReverse = 0;
	for (let i = value.length - 1; i >= 0; i--) {
		if (/\d/.test(value[i])) {
			if (selectionStart <= i) cursorIndexReverse++;
		}
	}
	const newValue = String(MoedaType(value));
	let cursor = 0;
	for (let i = newValue.length - 1; i >= 0; i--) {
		if (/\d/.test(newValue[i])) {
			if (cursorIndexReverse-- === 0) cursor = i + 1;
		}
	}
	target.value = newValue === '0,00' ? '' : newValue;
	target.selectionStart = cursor;
	target.selectionEnd = cursor;
};
const onQtdChange = propriedade => ({ target: { value } }) => {
	maybePutStore(propriedade, parseInt(value), x => ! isNaN(x));
};
const onQtdInput = ({ target }) => {
	target.value = String(target.value.replace(/\D/g, ''));
};
const onPrev = () => {
	const mudarPagina = obj => createKV(
		'paginaAtual',
		manipulateProps(['paginaAtual'], x => x - 1)(obj)
	);
	const createNewState = state => POJO.fold(
		state,
		mudarPagina(state),
		{ paginaAlterada: true }
	);
	store.setState(createNewState(store.getState()));
};
const onNext = () => {
	const mudarPagina = obj => createKV(
		'paginaAtual',
		manipulateProps(['paginaAtual'], x => x + 1)(obj)
	);
	const createNewState = state => POJO.fold(
		state,
		mudarPagina(state),
		{ paginaAlterada: true }
	);
	store.setState(createNewState(store.getState()));
};

/**
 * @typedef {Object} VDomNode
 * @prop {string} tag
 * @prop {Object} attrs
 * @prop {VDomNode[]|string[]} children
 * @prop {{[string]: Function}} evts
 */

/**
 * 
 * @param {string} tag 
 * @param {Object?} attrs 
 * @param {VDomNode[]?|string[]?} children 
 * @param {{[string]: Function}} evts 
 * @return {VDomNode}
 */
const html = (tag, attrs = {}, children = [], evts = {}) =>
	({ tag, attrs, children, evts });

/**
 * 
 * @param {HTMLElement} parentNode 
 * @param {VDomNode|VDomNode[]|string|string[]} childOrChildren 
 */
const createElement = (parentNode, childOrChildren) => {
	const children = Array.isArray(childOrChildren) ? childOrChildren : [childOrChildren];
	const doc = parentNode.ownerDocument;
	const childrenElements = children
		.map(child => {
			if (typeof child === 'string') return doc.createTextNode(child);
			const { tag, attrs, children: subchildren, evts } = child;
			const elt = Object.assign(doc.createElement(tag), attrs);
			createElement(elt, subchildren);
			Object.keys(evts).forEach(type => elt.addEventListener(type, evts[type]));
			return elt;
		});
	childrenElements.forEach(child => parentNode.appendChild(child));
	return childrenElements;
};

const Checkbox = (propriedade, texto) => parentNode => {
	const id = `input_${indiceInput++}`;
	const onchange = salvarBoolean(propriedade);
	const [input, label, br] = createElement(parentNode, [
		html(
			'input',
			{
				id,
				type: 'checkbox',
			},
			[],
			{
				change: onchange,
			}
		),
		html(
			'label',
			{
				htmlFor: id
			},
			[
				texto
			]
		),
		html(
			'br'
		),
	]);
	let checked = false;
	return state => {
		if (state[propriedade] !== checked) {
			checked = state[propriedade];
			input.checked = checked;
		}
	};
};

const DiaMesAno = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	const onchange = salvarTexto(propriedade);
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => wire(label)`${label}<br><input id=${id} type="text" maxlength="10" size="10" onchange=${onchange} value=${state[propriedade]} placeholder="dd/mm/aaaa"><br>`;
};

const MesAno = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	const onchange = salvarTexto(propriedade);
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => wire(label)`${label}<br><input id=${id} type="text" maxlength="7" size="7" onchange=${onchange} oninput=${onMesAnoInput} value=${state[propriedade]} placeholder="mm/aaaa"><br>`;
};

const Moeda = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	const onchange = onMoedaChange(propriedade);
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => {
		const [defaultValue, value] = state[propriedade];
		return wire(label)`${label}<br><input id=${id} type="text" maxlength="14" size="14" onchange=${onchange} oninput=${onMoedaInput} value=${MoedaType(value || NaN)} placeholder=${MoedaType(defaultValue)}><br>`;
	};
};

const Porcentagem = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	// const onchange
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => {
		const [defaultValue, value] = state[propriedade];
		return wire(label)`${label}<br><input id=${id} type="text" maxlength="3" size="3" value=${value} placeholder=${defaultValue}>%<br>`;
	};
};

const Qtd = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	const onchange = onQtdChange(propriedade);
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => {
		const [defaultValue, value] = state[propriedade];
		return wire(label)`${label}<br><input id=${id} type="text" maxlength="3" size="3" onchange=${onchange} oninput=${onQtdInput} value=${value} placeholder=${defaultValue}><br>`;
	};
};

const Radio = (propriedade, keysValues) => {
	const onchange = salvarTexto(propriedade);
	const options = Object.keys(keysValues).map(value => {
		const texto = keysValues[value];
		const id = `input_${indiceInput++}`;
		return { id, value, texto };
	});
	return state => {
		const renderedOptions = options.map(option => {
			const { id, value, texto } = option;
			return wire()`<input id=${id} type="radio" name=${propriedade} value=${value} onchange=${onchange} checked=${value === state[propriedade]}><label for=${id}>${texto}</label><br>`;
		});
		return wire(options)`${renderedOptions}`;
	};
};

const SaidaMoeda = (texto, f) => state => wire()`<label>${texto}</label><br><input type="text" size="14" disabled value=${MoedaType(f(state))}><br>`;

/**
 * Cria um grupo de elementos
 * @param {string} titulo Título do grupo
 * @param {Wired[]} items Itens do grupo
 * @returns {Wired}
 */
const Grupo = (titulo, items, dependeDe = null) => {
	const h1 = wire()`<h1>${titulo}</h1>`;
	return state => {
		let visivel = true;
		if (dependeDe === null) visivel = true;
		else if (typeof dependeDe === 'function') visivel = dependeDe(state);
		else visivel = state[dependeDe];
		const style = visivel ? '' : 'display: none;';
		return wire()`<section style=${style}>${h1}${items.map(item => item(state))}</section>`;
	};
};

const Pagina = (dependeDe, grupo) => state => {
	let visivel = true;
	if (dependeDe === null) visivel = true;
	else if (typeof dependeDe === 'function') visivel = dependeDe(state);
	else visivel = state[dependeDe];
	const classes = []
		.concat(visivel ? [] : ['pagina_oculta'])
		.join(' ');
	return wire(grupo)`<article class=${classes}>${grupo(state)}</article>`;
};

const Formulario = paginas => state => {
	const paginaAtual = state.paginaAtual || 0;
	const paginasRenderizadas = paginas.map(pagina => pagina(state));
	const paginasVisiveis = paginasRenderizadas
		.filter(pagina => ! pagina.classList.contains('pagina_oculta'))
		.map((pagina, indice) => {
			pagina.classList.add(indice === paginaAtual ? 'pagina_atual' : 'pagina_outra');
			pagina.classList.remove(indice === paginaAtual ? 'pagina_outra' : 'pagina_atual');
			return pagina;
		});
	const qtdPaginasVisiveis = paginasVisiveis.length;
	const possivelVoltar = paginaAtual > 0;
	const possivelAvancar = qtdPaginasVisiveis > paginaAtual + 1;
	return wire(paginas)`
<div class="hero">Cálculo para preenchimento de ofícios requisitórios</div>
${paginasRenderizadas}
<footer>
	<button class="button_next" disabled=${! possivelAvancar} onclick=${onNext}>Próxima página</button>
	Página ${paginaAtual + 1} de ${qtdPaginasVisiveis}
	<button class="button_prev" disabled=${! possivelVoltar} onclick=${onPrev}>Página anterior</button>
</footer>
<header>
	<button tabindex="-1" class="button_next" disabled=${! possivelAvancar} onclick=${onNext}>Próxima página</button>
	Página ${paginaAtual + 1} de ${qtdPaginasVisiveis}
	<button tabindex="-1" class="button_prev" disabled=${! possivelVoltar} onclick=${onPrev}>Página anterior</button>
</header>
	`; };

const render = Formulario([
	Pagina(null, Grupo('Dados da condenação', [
		Qtd('qtd-beneficiarios', 'Quantidade de beneficiários:'),
		Grupo('Sentença / Acórdão', [
			Checkbox('atrasados', 'Atrasados'),
			Checkbox('ajg', 'Ressarcimento dos honorários periciais'),
			Checkbox('sucumbencia', 'Honorários de sucumbência'),
		]),
	])),
	Pagina('ajg', Grupo('Ressarcimento dos honorários periciais', [
		Radio('metade', {
			'integral': 'Integral',
			'metade': 'Metade',
		}),
	])),
	Pagina('sucumbencia', Grupo('Honorários de sucumbência', [
		DiaMesAno('data-sucumbencia', 'Data da decisão que fixou honorários sucumbenciais:'),
		Porcentagem('pct-sucumbencia', 'Porcentagem:'),
		Qtd('salarios-sucumbencia', 'Quantidade de salários mínimos caso porcentagem seja menor:')
	])),
	Pagina('ajg', Grupo('Honorários periciais', [
		DiaMesAno('data-ajg', 'Data de solicitação do pagamento:'),
		Moeda('valor-ajg', 'Valor requisitado:'),
	])),
	Pagina('atrasados', Grupo('Cálculo da contadoria', [
		MesAno('data-base', 'Os valores foram calculados até:'),
		Moeda('principal', 'Principal corrigido:'),
		SaidaMoeda('Juros:', ({ principal, total }) => [principal, total].map(pair => pair.reduce((def, val) => val)).reduce((principal, total) => total - principal)),
		Moeda('total', 'Total:'),
		Radio('tipo-meses', {
			'qtd': 'Informar quantidade de meses',
			'inicial-final': 'Informar mês inicial e final'
		}),
		Grupo('Quantidade de meses', [
			Qtd('meses-anterior', 'Competências anos anteriores:'),
			Qtd('meses-atual', 'Competências ano atual:'),
		], state => state['tipo-meses'] === 'qtd'),
		Grupo('Mês inicial e final', [
			MesAno('mes-inicial', 'Mês inicial'),
			MesAno('mes-final', 'Mês final'),
			Checkbox('incluir-13o', 'Incluir 13º'),
		], state => state['tipo-meses'] === 'inicial-final'),
		Moeda('anterior', 'Competências anos anteriores - total:'),
		Moeda('atual', 'Competências ano atual - total:'),
	])),
	Pagina('atrasados', Grupo('Honorários contratuais', [
		Checkbox('contrato', 'Há contrato de honorários'),
		Grupo('Contrato de honorários', [
			Porcentagem('pct-contratuais', 'Porcentagem:'),
		], 'contrato'),
	])),
	Pagina(state => state['atrasados'] || state['sucumbencia'], Grupo('Advogados', [
		Qtd('qtd-advogados', 'Quantidade de advogados (preencher “1” quando for sociedade):'),
	])),
]);

const update = () => {
	bind(document.body)`${render(store.getState())}`;
	if (store.getState().paginaAlterada) {
		document.querySelector('.pagina_atual input').focus();
		const timer = setTimeout(() => {
			clearTimeout(timer);
			putStore('paginaAlterada', false);
		}, 0);
	}
};

store.subscribe(update);
update();