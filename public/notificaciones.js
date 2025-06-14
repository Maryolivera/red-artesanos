document.addEventListener('DOMContentLoaded', () => {
  const socket = io({ transports: ['websocket'] });
  const pendingMsgs = [];

  socket.on('connect', () => {
    console.log('[CLIENT] conectado con id socket:', socket.id);
    console.log('[CLIENT] registrando en room', window.CURRENT_USER_ID);
    socket.emit('register', window.CURRENT_USER_ID);
  });

  //  Escuchar nueva solicitud (al enviar)
  socket.on('friendRequest', data => {
    console.log('[CLIENT] EVENT friendRequest llegó:', data);
    // data.from.nombre contiene el nombre de quien envía
    pendingMsgs.push(`${data.fronName} te ha enviado una solicitud`);
    updateBadge();
  });

  //  Escuchar respuesta a tu solicitud (aceptada/rechazada)
  socket.on('friendRequestResponse', ({ requestId, accepted, fronName }) => {
  const msg = accepted
    ? `${fronName} aceptó tu solicitud.`
    : `${fronName} rechazó tu solicitud.`;
  showPersistentToast(msg, {
    label: 'OK',
    onAction: () => window.location.href = '/muro'
  });
})

  // cuando llegue un comentario
socket.on('imageComment', data => {
  console.log('[SOCKET] comentario en mi imagen:', data);
  incrementBadge();
  showPersistentToast(`${data.from} comentó tu imagen: "${data.texto}"`);
});


  // Función común para incrementar badge
  function updateBadge() {
    const badge = document.getElementById('notif-count');
    if (!badge) return;
    badge.innerText = (parseInt(badge.innerText, 10) || 0) + 1;
  }


const notifIcon = document.querySelector('.notif-icon');
if (notifIcon) {
  notifIcon.addEventListener('click', () => {
    //  los mensajes pendientes
    pendingMsgs.forEach(msg => showToast(msg));
    pendingMsgs.length = 0;

    //  Resetea el badge
    const badge = document.getElementById('notif-count');
    if (badge) badge.innerText = '0';

    setTimeout(() => {
      window.location.href = '/muro';
    }, 3000); 
  });
}

 function showPersistentToast(message) {
  const t = document.createElement('div');
  t.className = 'toast persistent';
  t.innerText = message + ' (Enter para cerrar)';
  document.body.appendChild(t);

  function closeOnEnter(e) {
    if (e.key === 'Enter') {
      t.remove();
      document.removeEventListener('keydown', closeOnEnter);
    }
  }
  document.addEventListener('keydown', closeOnEnter);
}
 
})