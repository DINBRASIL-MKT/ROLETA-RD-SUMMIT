let globalObjects = {};
let isSpinning = false; // trava enquanto gira

function getCenter(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function angleFromTopClockwise(x, y, cx, cy) {
  const angRad = Math.atan2(y - cy, x - cx);
  const angDegFromRightCCW = angRad * 180 / Math.PI;
  return (angDegFromRightCCW + 360 + 90) % 360;
}

//  Função auxiliar para definir o artigo correto
function gerarMensagemPremio(premio) {
  // Normaliza texto (para comparar sem acentos ou maiúsculas)
  const texto = premio.toLowerCase();

  // Casos especiais com artigo definido

  if (texto.includes("caneta")) return "Você ganhou uma Caneta!";
  if (texto.includes("chaveiro")) return "Você ganhou um Chaveiro!";
  if (texto.includes("adesivo")) return "Você ganhou um Adesivo!";
  if (texto.includes("bottom")) return "Você ganhou um Bottom!";

  // Caso genérico (fallback)
  return "Você ganhou " + premio + "!";
}

function playOnClick() {
  // impede rodar se popup estiver aberto ou roleta girando
  if (isSpinning) return;

  globalObjects.btnPlay = document.getElementById("btnPlay");
  globalObjects.roleta = document.getElementById("roleta");
  globalObjects.popup = document.getElementById("popup");
  globalObjects.mensagemPremio = document.getElementById("mensagemPremio");

  const premiosElems = Array.from(document.querySelectorAll('.premio'));
  const rectRoleta = globalObjects.roleta.getBoundingClientRect();
  const center = {
    x: rectRoleta.left + rectRoleta.width / 2,
    y: rectRoleta.top + rectRoleta.height / 2
  };

  const angulos = premiosElems.map(el => {
    const c = getCenter(el);
    return angleFromTopClockwise(c.x, c.y, center.x, center.y);
  });

  // Probabilidades deve somar 100 (soma = 100)
  // [Chaveiro, Adesivo, Bottom, Caneta, Chaveiro, Adesivo, Bottom, Caneta]
  const probabilidades = [7.5, 15, 25, 2.5, 7.5, 15, 25, 2.5];

  // Escolhe com base em probabilidade
  const random = Math.random() * 100;
  let acumulado = 0;
  let indiceVencedor = 0;

  for (let i = 0; i < probabilidades.length; i++) {
    acumulado += probabilidades[i];
    if (random <= acumulado) {
      indiceVencedor = i;
      break;
    }
  }

  // Faz girar até o prêmio vencedor
  const angAtual = angulos[indiceVencedor];
  const deltaToTop = (360 - angAtual) % 360;
  const voltas = 6;
  const rotacaoFinal = voltas * 360 + deltaToTop;

  isSpinning = true;
  globalObjects.roleta.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.3, 1)";
  globalObjects.roleta.style.transform = `rotate(${rotacaoFinal}deg)`;
  globalObjects.btnPlay.disabled = true;

  setTimeout(() => {
    const textoPremio = premiosElems[indiceVencedor].innerText.trim();
    const mensagem = gerarMensagemPremio(textoPremio);
    globalObjects.mensagemPremio.textContent = mensagem;
    globalObjects.popup.style.display = "flex";
    isSpinning = false;
  }, 4100);
}

function fecharPopup() {
  globalObjects.popup.style.display = "none";
  globalObjects.roleta.style.transition = "none";
  globalObjects.roleta.style.transform = "rotate(0deg)";

  if (globalObjects.btnPlay) {
    globalObjects.btnPlay.disabled = false;
    globalObjects.btnPlay.style.visibility = "visible";
  }

  void globalObjects.roleta.offsetWidth; // força reflow
}
