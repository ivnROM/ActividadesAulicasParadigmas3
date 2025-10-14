const superpuesto = document.getElementById('overlay')
const aceptar = document.getElementById('aceptar')
const tablero = document.getElementById('matrix')
const info = document.getElementById('info')
const botonReiniciar = document.getElementById('reiniciar')

let turno = 'X'
let fichasColocadas = { X: 0, O: 0 }
let piezaSeleccionada = null
let juegoTerminado = false
let casillas = Array(9).fill(null)

function mostrarSuperpuesto() {
  superpuesto.style.display = 'flex'
}

aceptar.addEventListener('click', () => {
  superpuesto.style.display = 'none'
})

botonReiniciar.addEventListener('click', reiniciarJuego)

function reiniciarJuego() {
  turno = 'X'
  fichasColocadas = { X: 0, O: 0 }
  piezaSeleccionada = null
  juegoTerminado = false
  casillas = Array(9).fill(null)
  tablero.innerHTML = ''
  crearTablero()
  actualizarInfo()
}

function crearTablero() {
  for (let i = 0; i < 9; i++) {
    const boton = document.createElement('button')
    boton.classList.add('button-matrix')
    boton.dataset.indice = i
    boton.addEventListener('click', () => manejarClick(i, boton))
    tablero.appendChild(boton)
  }
}

function manejarClick(indice, boton) {
  if (juegoTerminado) return

  // fase de colocación
  if (fichasColocadas[turno] < 3) {
    if (casillas[indice] === null) {
      casillas[indice] = turno
      boton.textContent = turno
      boton.classList.add(turno)
      fichasColocadas[turno]++

      if (verificarGanador()) {
        anunciarGanador()
        return
      }

      cambiarTurno()
    }
  } 
  // fase de movimiento
  else {
    if (piezaSeleccionada === null) {
      // seleccionar pieza propia
      if (casillas[indice] === turno) {
        piezaSeleccionada = indice
        boton.classList.add('seleccionada')
        resaltarCasillasAdyacentes(indice)
        info.textContent = `Jugador ${turno}: elegí dónde querés mover`
      }
    } else {
      // mover pieza
      if (indice === piezaSeleccionada) {
        // deseleccionar
        limpiarSeleccion()
      } else if (casillas[indice] === null && esAdyacente(piezaSeleccionada, indice)) {
        // mover
        casillas[indice] = turno
        casillas[piezaSeleccionada] = null

        const botones = document.querySelectorAll('.button-matrix')
        botones[indice].textContent = turno
        botones[indice].classList.add(turno)
        botones[piezaSeleccionada].textContent = ''
        botones[piezaSeleccionada].classList.remove(turno)

        limpiarSeleccion()

        if (verificarGanador()) {
          anunciarGanador()
          return
        }

        cambiarTurno()
      }
    }
  }
}

function esAdyacente(desde, hasta) {
  const filaDesde = Math.floor(desde / 3)
  const colDesde = desde % 3
  const filaHasta = Math.floor(hasta / 3)
  const colHasta = hasta % 3

  const diferenciaFila = Math.abs(filaDesde - filaHasta)
  const diferenciaCol = Math.abs(colDesde - colHasta)

  return (diferenciaFila <= 1 && diferenciaCol <= 1) && !(diferenciaFila === 0 && diferenciaCol === 0)
}

function resaltarCasillasAdyacentes(indice) {
  const botones = document.querySelectorAll('.button-matrix')
  botones.forEach((boton, i) => {
    if (casillas[i] === null && esAdyacente(indice, i)) {
      boton.classList.add('adyacente')
    }
  })
}

function limpiarSeleccion() {
  piezaSeleccionada = null
  const botones = document.querySelectorAll('.button-matrix')
  botones.forEach(boton => {
    boton.classList.remove('seleccionada')
    boton.classList.remove('adyacente')
  })
  actualizarInfo()
}

function cambiarTurno() {
  turno = turno === 'X' ? 'O' : 'X'
  actualizarInfo()
}

function actualizarInfo() {
  if (fichasColocadas[turno] < 3) {
    info.textContent = `Le toca al jugador ${turno} (te quedan ${3 - fichasColocadas[turno]} fichas)`
  } else {
    info.textContent = `El jugador ${turno} se quedó sin fichas (reinicia el juego)`
  }
}

function verificarGanador() {
  const lineas = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6]             // diagonal
  ]

  for (let linea of lineas) {
    const [a, b, c] = linea
    if (casillas[a] && casillas[a] === casillas[b] && casillas[a] === casillas[c]) {
      resaltarLineaGanadora(linea)
      return true
    }
  }
  return false
}

function resaltarLineaGanadora(linea) {
  const botones = document.querySelectorAll('.button-matrix')
  linea.forEach(indice => {
    botones[indice].classList.add('ganadora')
  })
}

function anunciarGanador() {
  juegoTerminado = true
  info.textContent = `¡Ganó el jugador ${turno}! 🎉`
}

crearTablero()
