function ativar(botaoClicado) {
  document.querySelectorAll('.option').forEach(btn => {
    btn.classList.remove('active');
  });

  botaoClicado.classList.add('active');
}

