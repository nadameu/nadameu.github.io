---
nome: Exportar dados para Excel
desc: Permite exportar alguns dados da página para o Excel, facilitando o preenchimento de planilhas
eproc: true
repo: greasemonkey
file: exportar-excel
possui_manual: true
---
Ao carregar a tela do processo, aparecerá o seguinte botão e, se necessário, o aviso:

<figure>
	<img src="../images/exportar-excel/botao.png" alt="" style="width: 100%; max-width: 546px;">
	<figcaption>Botão criado pelo script e aviso quando há mais de 100 eventos</figcaption>
</figure>

Após clicar no botão, o script irá buscar os seguintes dados do processo e exportá-los para uma planilha no formato XLSX (Excel 2007):

- Número do processo;
- Número do processo sem pontuação;
- Valor da causa;
- Data da sentença;
- Autores;
- Réus e respectiva data de citação.
