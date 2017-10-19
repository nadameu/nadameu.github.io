/* global hyperHTML */
window.addEventListener('load', () => {
	const { bind, wire } = hyperHTML;

	class Paginacao {
		constructor(userProps) {
			const props = Object.assign({ atual: 0 }, userProps);
			Object.assign(this, props);
			this.eventHandlers = new Map();
			this.handleEvent = this.handleEvent.bind(this);
			this.on('previous', this.onPrevious.bind(this));
			this.on('next', this.onNext.bind(this));
		}

		handleEvent(type) {
			return evt => {
				if (this.eventHandlers.has(type)) {
					this.eventHandlers.get(type).forEach(handler => handler(evt));
				}
			};
		}

		on(type, handler) {
			if (! this.eventHandlers.has(type)) {
				this.eventHandlers.set(type, []);
			}
			const handlers = this.eventHandlers.get(type);
			handlers.push(handler);
			return () => this.eventHandlers.set(type, handlers.filter(h => h !== handler));
		}

		onNext() {
			const [next] = this.proximasPaginas();
			if (typeof next === 'undefined') return;
			this.atual = this.paginas.indexOf(next);
			this.handleEvent('change')({});
		}

		onPrevious() {
			const [prev] = this.paginasAnteriores().reverse();
			if (typeof prev === 'undefined') return;
			this.atual = this.paginas.indexOf(prev);
			this.handleEvent('change')({});
		}

		paginasAnteriores() {
			return this.paginas.filter((pagina, i) => i < this.atual).filter(pagina => ! pagina.hidden);
		}

		proximasPaginas() {
			return this.paginas.filter((pagina, i) => i > this.atual).filter(pagina => ! pagina.hidden);
		}

		render() {
			const paginas = this.paginas.map((pagina, index) => {
				const num = index + 1;
				const id = `pagina_${num}`;
				const classes = [
					'pagina',
					id,
					index === this.atual ? 'pagina_atual' : 'pagina_outra',
					pagina.hidden ? 'pagina_oculta' : 'pagina_ativa'
				].join(' ');
				return wire(pagina)`<section id=${id} class=${classes}>${pagina.render()}</section>`;
			});
			const paginasAnteriores = this.paginasAnteriores().length;
			const proximasPaginas = this.proximasPaginas().length;
			const classes = (ativo, extraClass) => ['button', ativo ? 'button_active' : 'button_inactive', extraClass].join(' ');
			const obj1 = {}, obj2 = {};
			const [anterior1, anterior2] = [obj1, obj2].map(obj => wire(obj)`<button class=${classes(paginasAnteriores > 0, 'button_prev')} disabled=${! paginasAnteriores > 0} onclick=${this.handleEvent('previous')}>Página anterior</button>`);
			const [proxima1, proxima2] = [obj1, obj2].map(obj => wire(obj)`<button class=${classes(proximasPaginas > 0, 'button_next')} disabled=${! proximasPaginas > 0} onclick=${this.handleEvent('next')}>Próxima página</button>`);
			const [info1, info2] = [obj1, obj2].map(obj => wire(obj)`Página ${paginasAnteriores + 1} de ${paginasAnteriores + 1 + proximasPaginas}`);
			const cabecalho = wire(this)`<header class="header">${anterior1}${info1}${proxima1}</header>`;
			const rodape = wire(this)`<footer class="footer">${anterior2}${info2}${proxima2}</footer>`;
			return wire(this)`<div class="paginacao">${cabecalho}${paginas}${rodape}</div>`;
		}
	}

	class Grupo {
		get header() {
			if (! this._header) {
				const header = document.createElement(`h${this.level}`);
				header.className = 'titulo';
				header.textContent = this.title;
				this._header = header;
			}
			return this._header;
		}

		constructor(userProps) {
			const props = Object.assign({ hidden: false }, userProps);
			Object.assign(this, props);
			this.level = 1;
		}

		render() {
			return wire(this)`<section class=${['grupo', `grupo_level${this.level}`].join(' ')} style=${this.hidden ? 'display: none;' : ''}>${this.header}${this.items.map(item => {
				if (item instanceof Grupo) {
					item.level = this.level + 1;
				}
				return item.render();
			})}</section>`;
		}
	}

	class Component {

		constructor(props) {
			this.defaultValue = '';
			this.value = '';
			Object.assign(this, props);
			this.eventHandlers = new Map();
			this.handleEvent = this.handleEvent.bind(this);
		}

		handleEvent(evt) {
			const { type } = evt;
			if (this.eventHandlers.has(type)) {
				this.eventHandlers.get(type).forEach(handler => handler(evt));
			}
		}

		on(type, handler) {
			if (! this.eventHandlers.has(type)) {
				this.eventHandlers.set(type, []);
			}
			const handlers = this.eventHandlers.get(type);
			handlers.push(handler);
			return () => this.eventHandlers.set(type, handlers.filter(h => h !== handler));
		}

		renderCheckbox() {
			return wire(this)`<input id=${this.id} type="checkbox" class=${[this.id, 'checkbox'].join(' ')} checked=${this.value} onchange=${this.handleEvent}>`;
		}

		renderInput() {
			return wire(this)`<input id=${this.id} size=${this.size} maxlength=${this.size} placeholder=${this.defaultValue} class=${[this.id, 'input', this.cssClass].join(' ')} value=${this.value} oninput=${this.handleEvent}>`;
		}

		renderLabel() {
			return wire(this)`<label for=${this.id}>${this.text}</label>`;
		}

		renderOutput() {
			return wire(this)`<input id=${this.id} disabled size=${this.size} value=${this.value} class=${[this.id, 'output', this.cssClass].join(' ')}>`;
		}
	}

	class LabelInput extends Component {
		render() {
			return wire(this)`${this.renderLabel()}<br>${this.renderInput()}<br>`;
		}
	}

	class LabelOutput extends Component {
		render() {
			return wire(this)`${this.renderLabel()}<br>${this.renderOutput()}<br>`;
		}
	}

	class CampoBool extends Component {
		constructor(userProps) {
			const props = Object.assign({}, userProps);
			super(props);
			this.on('change', this.onChange.bind(this));
		}

		onChange(evt) {
			const { target } = evt, { checked } = target;
			this.value = checked;
		}

		render() {
			return wire(this)`${this.renderCheckbox()} ${this.renderLabel()}<br>`;
		}
	}

	class CampoData extends LabelInput {
		get cssClass() { return 'input_data'; }
		get size() { return 10; }

		constructor(userProps) {
			const props = Object.assign({ defaultValue: 'dd/mm/aaaa' }, userProps);
			super(props);
			this.on('input', this.onInput.bind(this));
		}

		onInput(evt) {
			const { target } = evt, { value } = target;
			const sanitized = value.replace(/\D/g, '');
			if (sanitized.length < 3) {
				target.value = sanitized;
			} else if (sanitized.length < 5) {
				target.value = [sanitized.slice(0, 2), sanitized.slice(2)].join('/');
			} else {
				target.value = [sanitized.slice(0, 2), sanitized.slice(2, 4), sanitized.slice(4)].join('/');
			}
			this.value = target.value;
		}
	}

	class CampoMesAno extends LabelInput {
		get cssClass() { return 'input_mes-ano'; }
		get size() { return 7; }

		constructor(userProps) {
			const props = Object.assign({ defaultValue: 'mm/aaaa' }, userProps);
			super(props);
			this.on('input', this.onInput.bind(this));
		}

		onInput(evt) {
			const { target } = evt, { value } = target;
			const sanitized = value.replace(/\D/g, '');
			if (sanitized.length < 3) {
				target.value = sanitized;
			} else {
				target.value = [sanitized.slice(0, 2), sanitized.slice(2)].join('/');
			}
			this.value = target.value;
		}
	}

	class CampoMoeda extends LabelInput {
		get cssClass() { return 'input_moeda'; }
		get size() { return 14; }

		constructor(userProps) {
			const props = Object.assign({ defaultValue: '0,00' }, userProps);
			super(props);
			this.on('input', this.onInput.bind(this));
		}

		onInput(evt) {
			const { target } = evt, { value } = target;
			const sanitized = value.replace(/\D/g, '');
			const num = Number(sanitized) / 100;
			if (num === 0) {
				target.value = '';
			} else {
				target.value = num.toLocaleString('pt-br', {
					useGrouping: true,
					minimumIntegerDigits: 1,
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
			}
			this.value = target.value;
		}
	}

	class CampoPorcentagem extends Component {
		get cssClass() { return 'input_pct'; }
		get size() { return 3; }

		constructor(userProps) {
			const props = Object.assign({ defaultValue: '0' }, userProps);
			super(props);
			this.on('input', this.onInput.bind(this));
		}

		onInput(evt) {
			const { target } = evt, { value } = target;
			const sanitized = value.replace(/\D/g, '');
			const num = Number(sanitized) / 100;
			if (num === 0) {
				target.value = '';
			} else {
				target.value = (num * 100).toLocaleString('pt-br', {
					useGrouping: false,
					minimumIntegerDigits: 1,
					maximumFractionDigits: 0
				});
			}
			this.value = target.value;
		}

		render() {
			return wire(this)`${this.renderLabel()}<br>${this.renderInput()}%<br>`;
		}
	}

	class CampoRadio extends Component {
		constructor(userProps) {
			const props = Object.assign({}, userProps);
			super(props);
			this.on('change', this.onChange.bind(this));
		}

		onChange(evt) {
			this.value = evt.target.value;
		}

		render() {
			const options = this.options.map((option, index) => {
				const id = `${this.name}_${index}`;
				return wire()`<input type="radio" id=${id} name=${this.name} class=${['radio', this.name].join(' ')} value=${option.value} checked=${option.value === this.value} onchange=${this.handleEvent}> <label for=${id}>${option.text}</label><br>`;
			});
			return wire(this)`${options}`;
		}
	}

	class CampoQtd extends LabelInput {
		get cssClass() { return 'input_qtd'; }
		get size() { return 3; }

		constructor(userProps) {
			const props = Object.assign({ defaultValue: '0' }, userProps);
			super(props);
			this.on('input', this.onInput.bind(this));
		}

		onInput(evt) {
			const { target } = evt, { value } = target;
			const sanitized = value.replace(/\D/g, '');
			target.value = sanitized;
			this.value = target.value;
		}
	}

	class SaidaMoeda extends LabelOutput {
		get cssClass() { return 'output_moeda'; }
		get size() { return 14; }

		constructor(userProps) {
			const props = Object.assign({ value: '0,00' }, userProps);
			super(props);
		}

	}

	const qtdBeneficiarios = new CampoQtd({ id: 'calculo__qtd-beneficiarios', text: 'Quantidade de beneficiários:', defaultValue: '1' });
	const dataBase = new CampoMesAno({ id: 'contadoria__data-base', text: 'Os valores foram calculados até:' });
	const principal = new CampoMoeda({ id: 'contadoria__principal', text: 'Principal corrigido:' });
	const juros = new SaidaMoeda({ id: 'contadoria__juros', text: 'Juros:' });
	const total = new CampoMoeda({ id: 'contadoria__total', text: 'Total:' });
	const opcaoMeses = new CampoRadio({
		name: 'contadoria__meses',
		options: [
			{ value: 'qtd', text: 'Informar quantidade de meses' },
			{ value: 'inicial-final', text: 'Informar mês inicial e final' },
		],
		value: 'qtd'
	});
	const qtdAnterior = new CampoQtd({ id: 'contadoria__qtd-anterior', text: 'Competências anos anteriores:' });
	const qtdAtual = new CampoQtd({ id: 'contadoria__qtd-atual', text: 'Competências ano atual:' });
	const mesInicial = new CampoMesAno({ id: 'contadoria__mes-inicial', text: 'Mês inicial:' });
	const mesFinal = new CampoMesAno({ id: 'contadoria__mes-final', text: 'Mês final:' });
	const decimo = new CampoBool({ id: 'contadoria__decimo', text: 'Incluir 13º', value: true });
	const anterior = new CampoMoeda({ id: 'contadoria__anterior', text: 'Competências anos anteriores - total:' });
	const atual = new CampoMoeda({ id: 'contadoria__atual', text: 'Competências ano atual - total:' });
	const dataSucumbencia = new CampoData({ id: 'sucumbencia__data', text: 'Data da decisão que fixou honorários sucumbenciais:' });
	const pctSucumbencia = new CampoPorcentagem({ id: 'sucumbencia__pct', text: 'Porcentagem:' });
	const salariosSucumbencia = new CampoQtd({ id: 'sucumbencia__salarios', text: 'Quantidade de salários mínimos caso porcentagem seja menor:' });
	const metade = new CampoRadio({
		name: 'metade',
		options: [
			{ value: 'integral', text: 'Integral' },
			{ value: 'metade', text: 'Metade' },
		],
		value: 'integral'
	});
	const sentAtrasados = new CampoBool({ id: 'sentenca__atrasados', text: 'Atrasados' });
	const sentAJG = new CampoBool({ id: 'sentenca__ajg', text: 'Ressarcimento dos honorários periciais' });
	const sentSucumbencia = new CampoBool({ id: 'sentenca__sucumbencia', text: 'Honorários de sucumbência' });
	const dataHonPer = new CampoData({ id: 'ajg__data', text: 'Data de solicitação do pagamento:' });
	const valorHonPer = new CampoMoeda({ id: 'ajg__valor', text: 'Valor requisitado:', defaultValue: '200,00' });

	const meses = new Grupo({
		id: 'meses',
		title: 'Quantidade de meses',
		items: [
			qtdAnterior,
			qtdAtual,
		]
	});
	const inicialFinal = new Grupo({
		id: 'inicial-final',
		title: 'Mês inicial e final',
		hidden: true,
		items: [
			mesInicial,
			mesFinal,
			decimo,
		]
	});
	const contadoria = new Grupo({
		id: 'contadoria',
		hidden: true,
		title: 'Cálculo da contadoria',
		items: [
			dataBase,
			principal,
			juros,
			total,
			opcaoMeses,
			meses,
			inicialFinal,
			anterior,
			atual,
		]
	});
	const ajg = new Grupo({
		id: 'ajg',
		hidden: true,
		title: 'Ressarcimento dos honorários periciais',
		items: [
			metade
		]
	});
	const sucumbencia = new Grupo({
		title: 'Honorários de sucumbência',
		hidden: true,
		items: [
			dataSucumbencia,
			pctSucumbencia,
			salariosSucumbencia
		]
	});

	const sentenca = new Grupo({
		id: 'sentenca',
		title: 'Sentença / Acórdão',
		items: [
			sentAtrasados,
			sentAJG,
			// ajg,
			sentSucumbencia,
			// sucumbencia,
		]
	});

	const periciais = new Grupo({
		id: 'periciais',
		hidden: true,
		title: 'Honorários periciais',
		items: [
			dataHonPer,
			valorHonPer,
		]
	});

	const pagina1 = new Grupo({
		id: 'pagina1',
		title: 'Cálculo para preenchimento de ofícios requisitórios',
		items: [
			qtdBeneficiarios,
			sentenca,
		]
	});

	const formulario = new Paginacao({
		paginas: [
			pagina1,
			ajg,
			sucumbencia,
			periciais,
			contadoria
		]
	});

	const update = () => bind(document.body)`
    ${formulario.render()}
  `;

	sentAtrasados.on('change', evt => {
		const { target } = evt, { checked } = target;
		contadoria.hidden = ! checked;
		update();
	});

	sentAJG.on('change', evt => {
		const { target } = evt, { checked } = target;
		ajg.hidden = ! checked;
		periciais.hidden = ! checked;
		update();
	});

	sentSucumbencia.on('change', evt => {
		const { target } = evt, { checked } = target;
		sucumbencia.hidden = ! checked;
		update();
	});

	opcaoMeses.on('change', evt => {
		const { target } = evt, { value } = target;
		if (value === 'qtd') {
			meses.hidden = false;
			inicialFinal.hidden = true;
		} else if (value === 'inicial-final') {
			meses.hidden = true;
			inicialFinal.hidden = false;
		}
		update();
	});

	formulario.on('change', update);

	update();
});