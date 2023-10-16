---
layout: default
title: Verificação de números de processos
---

<style>
.erro { color: #a12; }

.clickable { color: #14a; }

.sucesso { color: #171; }

li, .clickable { cursor: pointer; }

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding: 2px;
}
</style>

[Início](/) > Verificação de números de processos

# Verificação de números de processos

Cole na caixa abaixo um número de processo no formato de numeração única
do CNJ (NNNNNNN-DD.AAAA.J.TR.OOOO).

Caracteres separadores (traços e pontos) são opcionais.

<form>
  <input type="text" placeholder="Número de processo" size="25" autofocus /><br >
  <br>
  <button type="reset">Limpar</button>
</form><br>
<output></output>

<script type="module" src="js/numproc.js?v=1.2.0"></script>
