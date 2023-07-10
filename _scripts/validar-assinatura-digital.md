---
nome: Validar assinatura digital
desc: Envia documentos PDF para o site validar.iti.gov.br para validação de assinatura digital
eproc: true
repo: greasemonkey
file: validar-assinatura-digital
possui_manual: true
---

Ao abrir um documento PDF no eproc, aparecerá o seguinte botão na parte inferior da respectiva aba ou janela:

<figure>
	<img src="../images/validar-assinatura-digital/botao.png" alt="" style="width: 100%; max-width: 661px; height: auto;" width="661" height="85">
	<figcaption>Botão na parte inferior da janela do documento PDF</figcaption>
</figure>

Ao clicar no botão, será aberta em uma nova aba o site <a href="https://validar.iti.gov.br" target="_blank">https://validar.iti.gov.br</a><img src="../images/newwindow.svg" alt=" " width="12" height="12"/>. O documento PDF correspondente será enviado automaticamente para validação através do site, basta aguardar o carregamento para ver o resultado.

## Solução de erros

Caso apareça a mensagem abaixo ao tentar validar um documento, selecione a opção &ldquo;Sempre permitir&rdquo;:

<figure>
	<img src="../images/validar-assinatura-digital/erro-cors.png" alt="" style="width: 100%; max-width: 969px; height: auto;" width="969" height="493">
	<figcaption>Mensagem avisando sobre acesso a documentos do <em>eproc</em></figcaption>
</figure>
