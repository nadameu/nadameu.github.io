---
layout: index
---

# Facilidades para a Justiça Federal da 4ª Região

Nesta página você irá encontrar algumas ferramentas para facilitar a utilização
dos sistemas disponíveis para a Justiça Federal da 4ª Região.

## [Colar texto de PDF](/colar-texto-pdf)

Se você precisa copiar texto de documentos PDF para utilizar em editor de texto,
porém ao colar verifica que as quebras de linha e parágrafos precisam ser ajustados manualmente,
utilize [este link](/colar-texto-pdf) para acessar uma ferramenta que corrige o texto copiado.

## [Verificação de números de processos](/numproc)

Quando um número de processo recebido por e-mail ou telefone não aparenta ser válido, verifique
com esta ferramenta se é possível descobrir qual o número correto.

[Clique aqui para acessar](/numproc).

## Scripts para Firefox, Chrome, Edge, Safari e Opera

### Antes de instalar

A seguir você encontrará vários _scripts_ que adicionam algumas funcionalidades
aos sistemas utilizados na Justiça Federal da 4ª Região.

Para utilizar os scripts é necessário possuir o gerenciador de _scripts_ Tampermonkey no seu navegador:

<div class="desktop">

<div class="icon">
<a href="/gerenciadores.html">
<img src="images/tampermonkey.svg" alt="" width="32" height="32"/>
<br>
Tampermonkey
</a>
</div>

</div>

[Mais informações](/gerenciadores.html)

<h3 id="scripts">Scripts para o e-Proc</h3>

<div class="desktop">
{% for script in site.scripts %}
	{% if script.eproc %}
	<div class="icon">
		<a href="{{ script.url }}">
		<img src="images/{{ script.icone }}" alt="" width="32" height="32"/>
		<br>
		{{ script.nome }}
		</a>
		<p>{{ script.desc }}</p>
	</div>
	{% endif %}
{% endfor %}
</div>

### Scripts para o SEEU

<div class="desktop">
{% for script in site.scripts %}
	{% if script.seeu %}
	<div class="icon">
		<a href="{{ script.url }}">
		<img src="images/{{ script.icone }}" alt="" width="32" height="32"/>
		<br>
		{{ script.nome }}
		</a>
		<p>{{ script.desc }}</p>
	</div>
	{% endif %}
{% endfor %}
</div>

### Scripts para outros sistemas

<div class="desktop">
{% for script in site.scripts %}
	{% unless script.eproc or script.seeu %}
	<div class="icon">
		<a href="{{ script.url }}">
		<img src="images/{{ script.icone }}" alt="" width="32" height="32"/>
		<br>
		{{ script.nome }}
		</a>
		<p>{{ script.desc }}</p>
	</div>
	{% endunless %}
{% endfor %}
</div>

## Contato

<address>Paulo Roberto Maurici Junior<br>
1ª Vara Federal de Itajaí/SC<br>
E-mail/Google Chat: <a href="mailto:&#112;&#109;&#106;&#48;&#48;&#064;&#106;&#102;&#115;&#099;&#046;&#106;&#117;&#115;&#046;&#098;&#114;">&#112;&#109;&#106;&#48;&#48;&#064;&#106;&#102;&#115;&#099;&#046;&#106;&#117;&#115;&#046;&#098;&#114;</a>
</address>
