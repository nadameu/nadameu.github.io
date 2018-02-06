---
nome: Ponto eletrônico
desc: Facilita a utilização do <u>sistema antigo</u> de ponto eletrônico da JFPR
repo: pontoeletronico
file: pontoeletronico
possui_manual: true
---
Este é um script para facilitar a utilização do <em>sistema antigo</em> de ponto eletrônico da JFPR (<a href="http://apl.jfpr.gov.br/pe/">http://apl.jfpr.gov.br/pe/</a>).

No sistema de ponto eletrônico da JFPR, na tela de relatório, selecionar as datas desejadas.

O script informa a data inicial que deve ser selecionada, com base na prescrição das horas não utilizadas — 90 (noventa) dias.

É calculado o saldo de horas com base nas compensações realizadas e nas prescrições, descartando-se diferenças inferiores a 15 minutos de tolerância por dia (para mais ou para menos).

Eventuais erros de preenchimento — duas entradas ou duas saídas seguidas, dias com apenas um registro ou três (entrada-saída-entrada) — serão destacados com um fundo vermelho.

O script também destaca as ocasiões em que houve alteração de horário após o registro inicial.