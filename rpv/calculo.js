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

const modifyStore = (name, f) => {
	const state = store.getState();
	const value = state[name];
	store.setState(Object.assign({}, state, { [name]: f(value) }));
};
const putStore = (name, value) => modifyStore(name, () => value);
const maybePutStore = (name, value, condition) =>	{
	modifyStore(name, ([defaultValue]) => [defaultValue].concat(condition(value) ? [value] : []));
};

let indiceInput = 0;

const MoedaType = (input = 0) => {
	if (input instanceof MoedaType) return input;
	const _valor = typeof input === 'number' ? input : parseInt(input.replace(/\D/g, '')) / 100;
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

const onCheckboxChange = propriedade => ({ target: { checked } }) => {
	putStore(propriedade, checked);
};
const onMesAnoChange = propriedade => ({ target: { value } }) => {
	putStore(propriedade, value);
};
const onMesAnoInput = ({ target }) => {
	let digitos = target.value.replace(/\D/g, '');
	if (! /^(?:0[1-9]|1[0-2])/.test(digitos))digitos = digitos[0];
	if (! /^[01]/.test(digitos)) digitos = '';
	target.value = digitos.length < 3 ? digitos : [digitos.slice(0, 2), digitos.slice(2)].join('/');
};
const onMoedaChange = propriedade => ({ target: { value } }) => {
	maybePutStore(propriedade, Number(MoedaType(value)), x => ! isNaN(x) && x !== 0);
};
const onMoedaInput = ({ target }) => {
	const valor = Number(MoedaType(target.value));
	target.value = valor === 0 ? '' : MoedaType(valor);
};
const onQtdChange = propriedade => ({ target: { value } }) => {
	maybePutStore(propriedade, parseInt(value), x => ! isNaN(x));
};
const onQtdInput = ({ target }) => target.value = String(target.value.replace(/\D/g, ''));
const onRadioChange = propriedade => ({ target: { value } }) => {
	putStore(propriedade, value);
};
const onPrev = () => {
	modifyStore('paginaAtual', x => x - 1);
};
const onNext = () => {
	modifyStore('paginaAtual', x => x + 1);
};

/**
 * @typedef {{(state: any): HTMLElement}} Wired
 */

/**
 * Cria um checkbox com label que altera uma propriedade
 * @param {string} propriedade Propriedade de store.getState()
 * @param {string} texto Texto do label do elemento
 * @returns {Wired} teste
 */
const Checkbox = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	const onchange = onCheckboxChange(propriedade);
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => wire(label)`<input id=${id} type="checkbox" onchange=${onchange} checked=${state[propriedade]}>${label}<br>`;
};

const DiaMesAno = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	// const onchange
	const label = wire()`<label for=${id}>${texto}</label>`;
	return state => wire(label)`${label}<br><input id=${id} type="text" maxlength="10" size="10" value=${state[propriedade]} placeholder="dd/mm/aaaa"><br>`;
};

const MesAno = (propriedade, texto) => {
	const id = `input_${indiceInput++}`;
	const onchange = onMesAnoChange(propriedade);
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
	const onchange = onRadioChange(propriedade);
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

const SaidaMoeda2 = (texto, f) => state => wire()`<label>${texto}</label><br><input type="text" size="14" disabled value=${MoedaType(f(state))}><br>`;

/**
 * Cria um grupo de elementos
 * @param {string} titulo Título do grupo
 * @param {Wired[]} items Itens do grupo
 * @returns {Wired}
 */
const Grupo3 = (titulo, items, dependeDe = null) => {
	const h1 = wire()`<h1>${titulo}</h1>`;
	return state => {
		let visivel = true;
		if (dependeDe === null) visivel = true;
		else if (typeof dependeDe === 'function') visivel = dependeDe(state);
		else visivel = state[dependeDe];
		const style = visivel ? '' : 'display: none;';
		return wire(h1)`<section style=${style}>${h1}${items.map(item => item(state))}</section>`;
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

const Formulario2 = paginas => state => {
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
<header>
	<button class="button_prev" disabled=${! possivelVoltar} onclick=${onPrev}>Página anterior</button>
	Página ${paginaAtual + 1} de ${qtdPaginasVisiveis}
	<button class="button_next" disabled=${! possivelAvancar} onclick=${onNext}>Próxima página</button>
</header>
${paginasRenderizadas}
<footer>
	<button class="button_prev" disabled=${! possivelVoltar} onclick=${onPrev}>Página anterior</button>
	Página ${paginaAtual + 1} de ${qtdPaginasVisiveis}
	<button class="button_next" disabled=${! possivelAvancar} onclick=${onNext}>Próxima página</button>
</footer>
	`; };

const render = Formulario2([
	Pagina(null, Grupo3('Dados da condenação', [
		Qtd('qtd-beneficiarios', 'Quantidade de beneficiários:'),
		Grupo3('Sentença / Acórdão', [
			Checkbox('atrasados', 'Atrasados'),
			Checkbox('ajg', 'Ressarcimento dos honorários periciais'),
			Checkbox('sucumbencia', 'Honorários de sucumbência'),
		]),
	])),
	Pagina('ajg', Grupo3('Ressarcimento dos honorários periciais', [
		Radio('metade', {
			'integral': 'Integral',
			'metade': 'Metade',
		}),
	])),
	Pagina('sucumbencia', Grupo3('Honorários de sucumbência', [
		DiaMesAno('data-sucumbencia', 'Data da decisão que fixou honorários sucumbenciais:'),
		Porcentagem('pct-sucumbencia', 'Porcentagem:'),
		Qtd('salarios-sucumbencia', 'Quantidade de salários mínimos caso porcentagem seja menor:')
	])),
	Pagina('ajg', Grupo3('Honorários periciais', [
		DiaMesAno('data-ajg', 'Data de solicitação do pagamento:'),
		Moeda('valor-ajg', 'Valor requisitado:'),
	])),
	Pagina('atrasados', Grupo3('Cálculo da contadoria', [
		MesAno('data-base', 'Os valores foram calculados até:'),
		Moeda('principal', 'Principal corrigido:'),
		SaidaMoeda2('Juros:', ({ principal, total }) => [principal, total].map(pair => pair.reduce((def, val) => val)).reduce((principal, total) => total - principal)),
		Moeda('total', 'Total:'),
		Radio('tipo-meses', {
			'qtd': 'Informar quantidade de meses',
			'inicial-final': 'Informar mês inicial e final'
		}),
		Grupo3('Quantidade de meses', [
			Qtd('meses-anterior', 'Competências anos anteriores:'),
			Qtd('meses-atual', 'Competências ano atual:'),
		], state => state['tipo-meses'] === 'qtd'),
		Grupo3('Mês inicial e final', [
			MesAno('mes-inicial', 'Mês inicial'),
			MesAno('mes-final', 'Mês final'),
			Checkbox('incluir-13o', 'Incluir 13º'),
		], state => state['tipo-meses'] === 'inicial-final'),
		Moeda('anterior', 'Competências anos anteriores - total:'),
		Moeda('atual', 'Competências ano atual - total:'),
	])),
	Pagina('atrasados', Grupo3('Honorários contratuais', [
		Checkbox('contrato', 'Há contrato de honorários'),
		Grupo3('Contrato de honorários', [
			Porcentagem('pct-contratuais', 'Porcentagem:'),
		], 'contrato'),
	])),
	Pagina(state => state['atrasados'] || state['sucumbencia'], Grupo3('Advogados', [
		Qtd('qtd-advogados', 'Quantidade de advogados (preencher “1” quando for sociedade):'),
	])),
]);

const update = () => bind(document.body)`${render(store.getState())}`;

store.subscribe(update);
update();