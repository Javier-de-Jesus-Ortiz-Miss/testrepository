const GET_URL = 'https://script.google.com/macros/s/AKfycbxCEPfzR5pvwSVoRQoA9ThLPBBsGU-eAgYWVP4dVToTPqcuyt96gASkvMPG-VLJLgPW/exec'; // Tu URL de doGet
const POST_URL = 'https://script.google.com/macros/s/AKfycbz4lhhrPU-eA5q4iDsZH_bgdVGFKhNxOTv0MAk2RoFr9bv1OCGypdNyngRrebT4B0N9/exec'; // Tu URL de doPost

let datosInvitados = {};

async function obtenerDatos() {
  try {
    const response = await fetch(GET_URL);
    if (!response.ok) throw new Error('No se pudieron obtener los datos');
    datosInvitados = await response.json();
  } catch (error) {
    document.getElementById('resultado').textContent = 'Error al conectar con el servidor.';
    console.error(error);
  }
}

function verificarNumero() {
  const numero = document.getElementById('phone-input').value.trim();
  const resultadoDiv = document.getElementById('resultado');
  const confirmacionDiv = document.getElementById('confirmacion-container');
  const selectCantidad = document.getElementById('cantidad');

  if (!numero) {
    resultadoDiv.textContent = 'Por favor ingresa un número de teléfono.';
    confirmacionDiv.classList.add('hidden');
    return;
  }

  if (datosInvitados[numero]) {
    resultadoDiv.textContent = `✅ El número ${numero} tiene ${datosInvitados[numero]} invitación(es).`;

    selectCantidad.innerHTML = '';
    for (let i = 1; i <= parseInt(datosInvitados[numero]); i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      selectCantidad.appendChild(option);
    }

    confirmacionDiv.classList.remove('hidden');
  } else {
    resultadoDiv.textContent = `❌ El número ${numero} no está en la lista.`;
    confirmacionDiv.classList.add('hidden');
  }
}

async function confirmarAsistencia() {
  const numero = document.getElementById('phone-input').value.trim();
  const cantidad = document.getElementById('cantidad').value;
  const mensajeFinal = document.getElementById('mensaje-final');

  try {
    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ telefono: numero, confirmados: cantidad })
    });

    const text = await response.text();
    console.log('Respuesta del servidor:', text);
    mensajeFinal.textContent = text;
  } catch (error) {
    console.error('Error al enviar:', error);
    mensajeFinal.textContent = '❌ Error al enviar la confirmación.';
  }
}

window.onload = obtenerDatos;
