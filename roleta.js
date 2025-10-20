/* Mesmo JS original */
    let globalObjects = {};
    function getCenter(el) {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    function angleFromTopClockwise(x, y, cx, cy) {
      const angRad = Math.atan2(y - cy, x - cx);
      const angDegFromRightCCW = angRad * 180 / Math.PI;
      return (angDegFromRightCCW + 360 + 90) % 360;
    }
    function playOnClick() {
      globalObjects.btnPlay = document.getElementById("btnPlay");
      globalObjects.roleta = document.getElementById("roleta");
      globalObjects.popup = document.getElementById("popup");
      globalObjects.mensagemPremio = document.getElementById("mensagemPremio");
      const premiosElems = Array.from(document.querySelectorAll('.premio'));
      const rectRoleta = globalObjects.roleta.getBoundingClientRect();
      const center = { x: rectRoleta.left + rectRoleta.width / 2, y: rectRoleta.top + rectRoleta.height / 2 };
      const angulos = premiosElems.map(el => {
        const c = getCenter(el);
        return angleFromTopClockwise(c.x, c.y, center.x, center.y);
      });
      const indiceVencedor = Math.floor(Math.random() * premiosElems.length);
      const angAtual = angulos[indiceVencedor];
      const deltaToTop = (360 - angAtual) % 360;
      const voltas = 6;
      const rotacaoFinal = voltas * 360 + deltaToTop;
      globalObjects.roleta.style.transition = "transform 4s cubic-bezier(0.25, 1, 0.3, 1)";
      globalObjects.roleta.style.transform = `rotate(${rotacaoFinal}deg)`;
      globalObjects.btnPlay.disabled = true;
      setTimeout(() => {
        const texto = premiosElems[indiceVencedor].innerText.trim();
        globalObjects.mensagemPremio.textContent = "Você ganhou " + texto + "!";
        globalObjects.popup.style.display = "flex";
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
      void globalObjects.roleta.offsetWidth;
    }
