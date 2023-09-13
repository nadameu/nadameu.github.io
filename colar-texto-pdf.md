---
layout: default
title: Colar texto de PDF
---

[Início](/) > Colar texto de PDF

# Colar texto de PDF

Cole na caixa abaixo o texto cujas quebras de linha deseja corrigir (por
exemplo, copiado de um documento PDF).

Se a opção a seguir estiver selecionada, insira linhas em branco para criar separação entre os parágrafos.

<label
      ><input type="checkbox" checked /> Usar linhas em branco para separar
parágrafos.</label
    >

<form>
<textarea cols="120" rows="10" autofocus></textarea><br>
<br>
<button type="button" id="copiar">Copiar o texto abaixo</button>
<button type="reset">Limpar</button>
</form>

<p class="resultado-copia"></p>

<output class="corrigido"></output>

<script src="/js/colar-texto-pdf.js?v=2.0"></script>
