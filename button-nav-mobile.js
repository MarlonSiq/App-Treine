function ativar(botaoClicado) {
  document.querySelectorAll('.option-mob').forEach(btn => {
    btn.classList.remove('active');
  });

  botaoClicado.classList.add('active');
}


/* const buttons = document.querySelectorAll('.option-mob');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
}); */


  /* const buttons = document.querySelectorAll('.option-mob');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove o active de todos
      buttons.forEach(b => b.classList.remove('active'));
      // Adiciona o active no que foi clicado
      button.classList.add('active');
    });
  }); */