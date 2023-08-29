const textarea = document.getElementsByTagName("textarea")[0];
const output = document.getElementsByTagName("output")[0];
const checkbox = document.getElementsByTagName("input")[0];
const copiar = document.getElementById("copiar");
const resultado = document.getElementsByClassName("resultado-copia")[0];
const SEPARADOR = "CMHRLaZBtULfUbwwzPssTfJOGTZvsCNd";

let paragrafos = [];

textarea.addEventListener("input", render);
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
  } else {
    output.hidden = false;
    copiar.hidden = false;
    output.append(
      ...paragrafos.map((x) => {
        const p = document.createElement("p");
        p.textContent = x;
        return p;
      })
    );
  }
}
