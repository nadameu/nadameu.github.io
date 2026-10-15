---
layout: default
title: Gerar link para consulta externa a processos do eproc
---

<style>
input:invalid {
  box-shadow: 0 0 2px 4px red;
}
output {
  display: block;
  background: #fff8;
  border-radius: 4px;
  box-shadow: inset 2px 2px 4px #0004;
  padding: 12px;
}
</style>

[Início](/) > Gerar link para consulta externa a processos do _eproc_

# Gerar link para consulta externa a processos do _eproc_

## Atenção

Não forneça a chave processual a pessoas não autorizadas. Isso pode ter
consequências legais e até criminais.

Não utilize serviços de "encurtamento" de links (como _bit.ly_ ou _abre.ai_)
contendo a chave do processo, pois equivale a fornecer a chave a pessoas não
autorizadas.

## Gerar link

Preencha os dados abaixo para gerar o link.

<form action="https://consulta.trf4.jus.br/trf4/controlador.php" target="_blank">
  <input type="hidden" name="acao" value="consulta_processual_pesquisa">
  <input type="hidden" name="selForma" value="NC">
  <p><label for="txtValor">Número de processo: </label><input type="text" id="txtValor" name="txtValor" placeholder="0000000-00.0000.0.00.0000" size="25" autofocus pattern="\d{20}|\d{7}-\d{2}\.\d{4}\.\d\.?\d{2}\.\d{4}"/> (opcional)</p>
  <p><label for="txtChave">Chave: </label><input type="text" id="txtChave" name="txtChave" placeholder="000000000000" size="12" pattern="\d{12}"/> (opcional)</p>
  <p><label for="strSecao">Onde consultar: </label><select id="strSecao" name="strSecao">
    <option value="TRF">TRF4</option>
    <option value="PR">PR</option>
    <option value="RS">RS</option>
    <option value="SC">SC</option>
  </select></p>
  <p><br></p>
  <p><button type="submit">Gerar link</button> (abrirá em nova aba/janela)</p>
  <p>Confira os dados antes de copiar o endereço.</p>
  <p><br></p>
  <p><button type="reset">Limpar os dados preenchidos</button></p>
</form>
<output style="display: none;"></output>

<script>
  const LOCAIS = {
    "PR": "SJ Paraná",
    "RS": "SJ Rio Grande do Sul",
    "SC": "SJ Santa Catarina",
    "TRF": "Tribunal Regional Federal da 4ª Região",
  };
  const output = document.querySelector('output');
  const form = document.querySelector('form');
  const processo = document.getElementById('txtValor');
  const chave = document.getElementById('txtChave');
  const onde = document.getElementById('strSecao');
  form.addEventListener('reset', e => {
    output.style.display = 'none';
  });
  form.addEventListener('change', e => {
    output.style.display = 'none';
    if (e.target.matches('input')) {
      e.target.value = e.target.value.trim();
    }
    if (processo.value !== '' && processo.validity.valid && chave.value !== '' && chave.validity.valid) {
      e.preventDefault();
      output.textContent = null;
      output.append(
        `A íntegra do processo pode ser acessada através do seguinte link:`,
        document.createElement('br'),
        document.createElement('br'),
        link(`https://consulta.trf4.jus.br/trf4/controlador.php?acao=consulta_processual_pesquisa&selForma=NC&txtValor=${processo.value}&txtChave=${chave.value}&strSecao=${onde.value}`),
        document.createElement('br'),
        document.createElement('br'),
        `Alternativamente, através do Portal do TRF4, disponível em <`,
        link('https://www.trf4.jus.br'),
        `>, na seção "consulta processual judicial", alterar a opção "Nº do Processo" para "Nº Proc. Eletrônico com Chave" e preencher o número do processo ${processo.value}, chave ${chave.value}, e "onde consultar": ${LOCAIS[onde.value]}.`,
      );
      output.style.display = null;
    }
  });
  function link(url) {
    const a = document.createElement('a');
    a.href = url;
    a.textContent = url;
    a.target = '_blank';
    return a;
  }
</script>
