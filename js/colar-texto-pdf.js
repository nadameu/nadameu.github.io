const textarea = document.getElementsByTagName("textarea")[0];
const output = document.getElementsByTagName("output")[0];
const checkbox = document.getElementsByTagName("input")[0];
const copiar = document.getElementById("copiar");
const limpar = document.querySelector('button[type="reset"]');
const resultado = document.getElementsByClassName("resultado-copia")[0];
const SEPARADOR = "CMHRLaZBtULfUbwwzPssTfJOGTZvsCNd";

let paragrafos = [];

textarea.addEventListener("input", render);
textarea.addEventListener("paste", () => {
  setTimeout(() => {
    if (textarea.selectionEnd === textarea.value.length) {
      textarea.value += "\n\n";
      textarea.scrollTo({ top: textarea.selectionEnd + 2 });
    }
  }, 100);
});
checkbox.addEventListener("click", render);
copiar.addEventListener("click", () => {
  navigator.clipboard.writeText(paragrafos.join("\n")).then(
    () => {
      resultado.textContent = "Texto copiado com sucesso.";
      resultado.style.color = "#084";
      resultado.hidden = false;
    },
    () => {
      resultado.textContent = "Erro ao copiar o texto. Copie manualmente.";
      resultado.style.color = "#f80";
      resultado.hidden = false;
    }
  );
});
limpar.addEventListener("click", () => {
  textarea.focus();
  setTimeout(render, 0);
});
render();
function render() {
  resultado.hidden = true;
  const separar = checkbox.checked;
  paragrafos = (textarea.value || "")
    .split(/ *\n */)
    .map((s) => (separar && s === "" ? SEPARADOR : s))
    .join(" ")
    .split(RegExp(`\\s*(?:${SEPARADOR}\\s*)+`))
    .filter((x) => x !== "");
  output.textContent = "";
  if (paragrafos.length === 0) {
    output.hidden = true;
    copiar.hidden = true;
    limpar.hidden = true;
  } else {
    output.hidden = false;
    copiar.hidden = false;
    limpar.hidden = false;
    output.append(
      ...paragrafos.map((x) => {
        const p = document.createElement("p");
        p.textContent = x;
        return p;
      })
    );
  }
}
