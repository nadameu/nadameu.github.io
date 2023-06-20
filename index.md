---
layout: index
---

# Facilidades para a Justiça Federal da 4ª Região

Nesta página você irá encontrar algumas ferramentas para facilitar a utilização
dos sistemas disponíveis para a Justiça Federal da 4ª Região.

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

### Scripts para outros sistemas

<div class="desktop">
{% for script in site.scripts %}
	{% unless script.eproc %}
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

## Plugins para o Firefox

Se você usa o navegador Firefox, pode instalar os plugins abaixo.

Clique no ícone para abrir o manual de instalação e utilização.

<div class="desktop">
{% for plugin in site.data.plugins %}
<div class="icon">
	<img src="images/{{ plugin.icone }}" alt="" width="32" height="32"/><br>
	<span>{{ plugin.nome }}</span>
	<p>{{ plugin.desc }}</p>
	<br><a href="{{ plugin.urldownload }}">Instalar</a>
	<br><a href="{{ plugin.url }}" target="_blank" rel="noopener">
		Ver manual<img src="images/newwindow.svg" alt="" width="12" height="12"/>
	</a>
</div>
{% endfor %}
</div>

## Contato

<address>Paulo Roberto Maurici Junior<br>
4ª Vara Federal de Joinville/SC<br>
E-mail/Psiu: <a href="mailto:&#112;&#109;&#106;&#48;&#48;&#064;&#106;&#102;&#115;&#099;&#046;&#106;&#117;&#115;&#046;&#098;&#114;">&#112;&#109;&#106;&#48;&#48;&#064;&#106;&#102;&#115;&#099;&#046;&#106;&#117;&#115;&#046;&#098;&#114;</a>
</address>
