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
    pendingMsgs.push(`${data.from.nombre} te ha enviado una solicitud`);
    updateBadge();
  });

  //  Escuchar respuesta a tu solicitud (aceptada/rechazada)
  socket.on('friendRequestResponse', ({ requestId, accepted }) => {
    console.log('[CLIENT] EVENT friendRequestResponse llegó:', { requestId, accepted });
    pendingMsgs.push(
      accepted
        ? '¡Tu solicitud fue aceptada!'
        : 'Tu solicitud fue rechazada.'
    );
    updateBadge();
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

  
function showToast(message) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerText = message;
  document.body.appendChild(t);
  setTimeout(() => {
    t.classList.add('hide');
    setTimeout(() => t.remove(), 500);
  }, 3000);
}})
