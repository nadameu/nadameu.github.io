{% include header.html %}
{% include logo_pequeno.html %}	
<a href="/">Início</a> &gt; <a href="/#scripts">Scripts</a> &gt; {{ page.nome }}

<h1>{{ page.nome }}</h1>
<p>{{ page.desc }}</p>

<h2>Instalação</h2>
<p>Se você ainda não possui um gerenciador de scripts instalado no seu navegador, <a href="/gerenciadores.html">veja instruções aqui</a>.</p>
<div class="desktop">
	<div class="icon">
		<a href="https://github.com/nadameu/{{ page.repo }}/raw/master/{{ page.file }}.user.js">
		<img src="/images/{{ page.icone }}" alt="" width="32" height="32"/>
		<br>
		Instalar o script &ldquo;{{ page.nome }}&rdquo;
		</a>
	</div>
</div>

{% if page.possui_manual %}
<h2>Utilização</h2>
{{ content }}
{% endif %}

<h2>Informações técnicas</h2>
<p class="titulo-icone"><img src="/images/github.svg" width="16" height="16"><a href="https://github.com/nadameu/{{ page.repo }}" target="_blank" class="link-new-window">Código-fonte</a></p>

<p class="back"><a href="/#scripts">Voltar para os scripts</a></p>
{% include footer.html %}
