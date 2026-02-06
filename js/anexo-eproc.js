/** @type {HTMLElement} */
const entrada = document.getElementById("entrada");
/** @type {HTMLElement} */
const saida = document.getElementById("saida");
/** @type {HTMLInputElement} */
const input = document.getElementById("arquivo");
/** @type {HTMLButtonElement} */
const reset = document.getElementById("reset");

reset.addEventListener("click", () => {
  entrada.style.display = "";
  saida.style.display = "none";
  saida.textContent = "";
  reset.style.display = "none";
});

input.addEventListener("change", () => {
  entrada.style.display = "none";
  saida.style.display = "";
  reset.style.display = "";
  if (!input.files) return;
  const resultados = [...input.files].map((file) => {
    const resultado = document.createTextNode("");
    saida.append(`Abrindo arquivo \`${file.name}\`...`, resultado, h("br"));
    return converter_para_data_url(file).then(
      async (resultado) => {
        resultado.textContent = "OK";
        return resultado;
      },
      async (err) => {
        resultado.textContent = "ERRO";
        throw new Error(err);
      },
    );
  });
  // <p class="paragrafoPadrao">teste
  // <span class="resumo" data-resumo="true" title="resumo">teste</span>
  // <span class="resumo" data-resumo="true" title="resumo">teste</span></p>

  Promise.all(resultados)
    .then((dados) =>
      dados.map(({ name, url }) =>
        h(
          "li",
          {},
          h("a", { href: url, download: name, target: "_blank" }, name),
        ),
      ),
    )
    .then((items) => {
      const div = h(
        "div",
        {},
        h(
          "p",
          {},
          resumo(
            "O(s) arquivo(s) a seguir possue(m) formato incompatível com o sistema ",
            h("i", {}, "eproc"),
          ),
          ":",
        ),
        h("ul", {}, ...items),
      );
      const textarea = h("textarea", {
        cols: 80,
        rows: 25,
        value: div.innerHTML,
      });
      saida.append(
        h("br"),
        "Tamanho total: ",
        (textarea.value.length / 1024).toLocaleString("pt-BR", {
          style: "unit",
          unit: "kilobyte",
          maximumFractionDigits: 1,
        }),
        h("br"),
        h(
          "p",
          {},
          "Copie o código a seguir para um documento do ",
          h("i", {}, "eproc"),
          ":",
        ),
        textarea,
      );
    });
});

/**
 * @param {File} file
 * @returns {Promise<{name: string, url: string}>}
 */
function converter_para_data_url(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.addEventListener("load", () => res({ name: file.name, url: fr.result }));
    fr.addEventListener("error", (evt) => {
      console.debug(evt);
      rej(file.name);
    });
    fr.readAsDataURL(file);
  });
}

function h(tag, props = {}, ...children) {
  const elt = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    elt[key] = value;
  }
  if (children.length) elt.append(...children);
  return elt;
}

function resumo(...children) {
  const span = h("span", { className: "resumo", title: "resumo" }, ...children);
  span.dataset.resumo = "true";
  return span;
}
