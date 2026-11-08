# Portfólio — Sofia Oliveira Gonçalves

Site estático responsivo para apresentar desenvolvimento Full Stack, Lookdev 3D, formação e contatos.

## Como executar

1. Extraia a pasta `portfolio-sofia`.
2. Abra a pasta no Visual Studio Code.
3. Abra `index.html` no navegador ou use a extensão **Live Server** do VS Code.
4. A página não precisa de Python, Java ou servidor de banco de dados para funcionar. A interação é feita com JavaScript no navegador.

O efeito de rolagem suave usa a biblioteca Lenis pelo CDN jsDelivr. Se a biblioteca ou a conexão externa não estiver disponível, o site continua navegável com a rolagem nativa do navegador. As fontes são carregadas pelo Google Fonts; fontes de sistema são usadas como alternativa.

## Estrutura

```text
portfolio-sofia/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    ├── images/
    │   ├── sofia.webp
    │   └── haka-chatbot.jpg
    └── certificates/
        ├── diploma-design-animacao-redigido.jpg
        ├── nano-programacao-web.png
        └── nano-formacao-social-sustentabilidade.png
```

## Interações incluídas

- Rolagem suave com Lenis e alternativa nativa.
- Destaques de entrada ativados conforme a rolagem.
- Iluminação de fundo e cursor personalizado em dispositivos com mouse.
- Movimento sutil da foto e inclinação dos cartões de projeto ao mover o cursor.
- Barra de progresso total e marcador de seção no formato `01 / 06`.
- Menu adaptado a telas pequenas.
- Filtros de projetos por Front-end, Banco de Dados, Python, Java e IA.
- Galeria horizontal de Lookdev com arraste no desktop e gesto lateral no celular.
- Ampliação dos certificados em uma janela acessível por teclado.
- Respeito à preferência do sistema por movimento reduzido.

## Onde atualizar o conteúdo

- **Foto:** substitua `assets/images/sofia.webp` e mantenha o mesmo nome, ou altere o caminho no `index.html`.
- **Chatbot:** substitua `assets/images/haka-chatbot.jpg` pela captura mais atual, mantendo o nome ou atualizando o caminho no HTML.
- **Lookdev:** no `index.html`, procure por `look-art-one`, `look-art-two` e `look-art-three`. Substitua os elementos ilustrativos pelos seus renders finais. Para uma imagem, use por exemplo `<img src="assets/lookdev/lookdev-01.jpg" alt="Descrição do render">` e ajuste o CSS para `width: 100%; height: 100%; object-fit: cover;`.
- **Projetos:** os links do GitHub já estão preenchidos. Os cartões de Banco de Dados, Python e Java estão marcados como espaços em desenvolvimento para receber projetos e repositórios reais.
- **Certificados:** as imagens já estão na pasta `assets/certificates/`. O certificado da Méliès usado neste portfólio tem os campos de RG e CPF ocultos para não publicar identificadores pessoais.
- **Dados de contato:** procure por `sofiaolivagolivafiap@gmail.com` e pelos links de redes sociais no `index.html` para atualizá-los futuramente.

## Personalização visual

As cores, fontes, espaçamentos e tamanhos principais estão organizados no início de `css/style.css`, dentro de `:root`. A paleta usa fundo ameixa escuro, lavanda e amarelo pastel, com contraste pensado para leitura.

## Observações

- O site não inventa experiências profissionais. A apresentação destaca a formação em Design de Animação, os estudos atuais em ADS e os projetos informados.
- Os três espaços de Lookdev são placeholders visuais, não renders finais. Troque-os pelas imagens dos trabalhos correspondentes.
- O contador `01 / 06` acompanha as seis grandes seções da página; a barra superior indica o progresso total da rolagem.
