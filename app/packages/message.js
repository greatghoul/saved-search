function showMessage(message, status = 'info') {
  const old = document.getElementById('app-message-toast');
  if (old) old.remove();

  const div = document.createElement('div');
  div.id = 'app-message-toast';
  div.className = `app-message-toast app-message-toast-${status}`;
  div.textContent = message;
  document.body.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 3000);
}

const message = {
  success(msg) { showMessage(msg, 'success'); },
  error(msg) { showMessage(msg, 'error'); },
  info(msg) { showMessage(msg, 'info'); }
};

export default message;