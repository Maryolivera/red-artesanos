const socket = io();

if (typeof usuarioId !== 'undefined' && usuarioId !== null) {
  socket.emit('register', usuarioId);
}

socket.on('friendRequestResponse', (data) => {
  const mensaje = data.accepted
    ? `${data.fromName} aceptó tu solicitud de amistad`
    : `${data.fromName} rechazó tu solicitud de amistad`;
  alert(mensaje);
});

socket.on('friendRequest', (data) => {
  const mensaje = `Nueva solicitud de amistad de ${data.from.nombre}`;
  alert(mensaje);
});
