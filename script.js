document.getElementById("formReserva").addEventListener("submit", async function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  const reserva = { nombre, telefono, fecha, hora };

  try {
    const response = await fetch("http://192.168.1.118:3000/reservar", {   
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva)
    });

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    alert("Error al guardar la reserva");
    console.error(error);
  }
});