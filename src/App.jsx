import React, { useState, useEffect } from 'react';
import './App.css';

const imagens = {
  paisagem: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#87CEEB"/>
    <circle cx="80" cy="80" r="60" fill="#FDB813"/>
    <rect x="0" y="200" width="400" height="200" fill="#228B22"/>
    <polygon points="120,200 200,100 280,200" fill="#8B4513"/>
    <circle cx="320" cy="70" r="20" fill="white"/>
    <circle cx="350" cy="60" r="20" fill="white"/>
    <circle cx="380" cy="70" r="20" fill="white"/>
  </svg>`,
  gato: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#F0E68C"/>
    <circle cx="200" cy="200" r="150" fill="#808080"/>
    <circle cx="150" cy="150" r="30" fill="white"/>
    <circle cx="250" cy="150" r="30" fill="white"/>
    <circle cx="150" cy="150" r="15" fill="black"/>
    <circle cx="250" cy="150" r="15" fill="black"/>
    <path d="M150 250 Q200 300 250 250" fill="none" stroke="black" stroke-width="10"/>
    <path d="M180 120 L140 80 M220 120 L260 80" fill="none" stroke="black" stroke-width="10"/>
  </svg>`,
  abstrato: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#FFD700"/>
    <circle cx="100" cy="100" r="80" fill="#FF6347"/>
    <rect x="200" y="50" width="150" height="150" fill="#4169E1"/>
    <polygon points="200,200 300,300 100,300" fill="#32CD32"/>
    <ellipse cx="300" cy="100" rx="50" ry="30" fill="#FF1493"/>
  </svg>`
};

function App() {
  const [pecas, setPecas] = useState([]);
  const [imagemAtual, setImagemAtual] = useState('paisagem');
  const [imagemPersonalizada, setImagemPersonalizada] = useState(null);
  const [pecaSelecionada, setPecaSelecionada] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [vitoria, setVitoria] = useState(false);

  useEffect(() => {
    iniciarJogo();
  }, [imagemAtual, imagemPersonalizada]);

  function iniciarJogo() {
    const novasPecas = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      posicaoOriginal: i
    }));
    embaralharPecas(novasPecas);
  }

  function embaralharPecas(pecasParaEmbaralhar) {
    let pecasEmbaralhadas;
    do {
      pecasEmbaralhadas = [...pecasParaEmbaralhar].sort(() => Math.random() - 0.5);
    } while (verificarVitoria(pecasEmbaralhadas));

    setPecas(pecasEmbaralhadas);
  }

  function verificarVitoria(pecasParaVerificar) {
    return pecasParaVerificar.every((peca, index) => peca.id === index);
  }

  function trocarPeca(peca) {
    if (pecaSelecionada === null) {
      setPecaSelecionada(peca);
    } else {
      const novasPecas = pecas.map(p => {
        if (p.id === peca.id) return pecaSelecionada;
        if (p.id === pecaSelecionada.id) return peca;
        return p;
      });
      setPecas(novasPecas);
      setPecaSelecionada(null);
      setMensagem('');

      if (verificarVitoria(novasPecas)) {
        setVitoria(true);
      }
    }
  }

  function conferirQuebracabeca() {
    if (verificarVitoria(pecas)) {
      setVitoria(true);
    } else {
      setMensagem('Ops! Parece que ainda não está correto. Revise as peças e tente novamente.');
    }
  }

  function reiniciarJogo() {
    setVitoria(false);
    iniciarJogo();
    setMensagem('');
  }

  function mudarImagem(novaImagem) {
    setImagemAtual(novaImagem);
    setImagemPersonalizada(null);
  }

  function carregarImagemPersonalizada(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImagemPersonalizada(e.target.result);
        setImagemAtual('personalizada');
      }
      reader.readAsDataURL(file);
    }
  }

  const imagemAtualUrl = imagemPersonalizada || `data:image/svg+xml;base64,${btoa(imagens[imagemAtual])}`;

  return (
    <div className="container">
      <div className="jogo">
        <h1>Quebra-Cabeça de 16 Peças</h1>
        <div className="tabuleiro">
          {pecas.map((peca) => (
            <div
              key={peca.id}
              className={`peca ${pecaSelecionada === peca ? 'selecionada' : ''}`}
              style={{
                backgroundImage: `url("${imagemAtualUrl}")`,
                backgroundPosition: `${-(peca.posicaoOriginal % 4) * 100}px ${-Math.floor(peca.posicaoOriginal / 4) * 100}px`
              }}
              onClick={() => trocarPeca(peca)}
            />
          ))}
        </div>
      </div>
      <div className="gabarito-container">
        <h2>Gabarito</h2>
        <div
          className="gabarito"
          style={{ backgroundImage: `url(${imagemAtualUrl})` }}
        ></div>
        <select onChange={(e) => mudarImagem(e.target.value)} value={imagemAtual}>
          <option value="paisagem">Paisagem</option>
          <option value="gato">Gato</option>
          <option value="abstrato">Abstrato</option>
          {imagemPersonalizada && <option value="personalizada">Imagem Personalizada</option>}
        </select>
        <input type="file" accept="image/*" onChange={carregarImagemPersonalizada} />
        <button onClick={conferirQuebracabeca}>Conferir</button>
      </div>
      <div className="mensagem">{mensagem}</div>
      {vitoria && (
        <div className="vitoria">
          <h2>Parabéns!</h2>
          <p>Você completou o quebra-cabeça!</p>
          <button onClick={reiniciarJogo}>Jogar Novamente</button>
        </div>
      )}
    </div>
  );
}

export default App;
