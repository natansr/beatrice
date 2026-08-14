# BEATRICE

**Book Extraction And Transcription with Review, Image Correction and Export**

BEATRICE é uma aplicação web local-first para digitalização, OCR, transcrição fiel e revisão de documentos históricos. Ela roda inteiramente no navegador e pode ser publicada no GitHub Pages: imagens, OCR e transcrições permanecem no dispositivo do usuário.

Aplicação: `https://natansr.github.io/beatrice/` (disponível após a primeira publicação do repositório).

## Princípios

1. A imagem é a fonte de verdade.
2. Nunca modernizar grafia histórica silenciosamente.
3. Nunca inventar conteúdo ilegível.
4. Preservar imagem original e OCR bruto.
5. Manter texto revisado e normalizado separados.
6. Tornar incerteza visível e exportações reproduzíveis.

## Funcionalidades

- criação, edição e exclusão de projetos;
- upload múltiplo de JPG, PNG, TIFF e WEBP, com limite de 25 MB por arquivo;
- imagens e registros armazenados em IndexedDB;
- preservação do TIFF original e conversão local da primeira página para visualização;
- numeração inferida do nome, ordenação e detecção de páginas ausentes;
- escala de cinza, contraste, threshold, rotação e upscale com Canvas;
- OCR no navegador com Tesseract.js e idioma português;
- preservação de texto OCR, confiança e bounding boxes;
- revisão lado a lado, zoom, página anterior/próxima e autosave;
- transcrição diplomática e normalizada em campos separados;
- histórico em momentos editoriais significativos;
- exportação TXT, Markdown, HTML, DOCX, PDF pesquisável e JSON;
- execução sem conta, servidor ou envio dos documentos a uma API do BEATRICE.

## Arquitetura

```text
src/
  main.js                    composição da SPA
  router.js                  rotas por hash compatíveis com GitHub Pages
  services/
    database.js              IndexedDB
    project-service.js       projetos, progresso e lacunas
    image-service.js         validação, TIFF e Canvas
    ocr-service.js           Tesseract.js
    export-service.js        seis formatos de exportação
  ui/                        dashboard, projeto, revisão e exportação
  styles.css                 identidade visual responsiva
.github/workflows/
  deploy-pages.yml           testes, build e deploy automático
app/, tests/, requirements.txt
                              MVP FastAPI anterior, preservado no primeiro commit
```

O frontend usa Vite, JavaScript moderno, IndexedDB (`idb`), Tesseract.js, UTIF, `docx` e jsPDF. OCR e exportadores pesados são carregados apenas quando usados.

## Desenvolvimento

Requer Node.js 22 ou posterior.

```bash
npm install
npm run dev
```

Para simular exatamente o caminho do GitHub Pages:

```bash
npm run build
npm run preview
```

A build usa o prefixo `/beatrice/` definido em `vite.config.js`.

## Testes e segurança

```bash
npm test
npm run build
npm audit
```

Os testes cobrem regras de numeração, lacunas, progresso, validação de upload e exportações textuais/estruturadas. A publicação somente ocorre se testes e build passarem.

## Publicação no GitHub Pages

1. Crie o repositório público `natansr/beatrice`.
2. Envie a branch `main`.
3. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions**.
4. O workflow `.github/workflows/deploy-pages.yml` executará testes, build e deploy.
5. Acesse `https://natansr.github.io/beatrice/`.

Atualizações na branch `main` são publicadas automaticamente.

## Privacidade e armazenamento

IndexedDB pertence ao navegador e à origem `natansr.github.io`. Limpar os dados do site pode apagar todos os projetos. Não use janela anônima para trabalho permanente. Faça exportações regulares; uma futura versão incluirá backup/restauração integral do banco.

O primeiro OCR baixa o worker, o mecanismo WebAssembly e o modelo do idioma selecionado. Depois disso, o navegador pode reutilizar o cache, mas a primeira execução requer internet.

## Limitações atuais

- os projetos não sincronizam automaticamente entre navegadores ou dispositivos;
- a capacidade depende da cota de armazenamento do navegador;
- somente a primeira imagem de arquivos TIFF multipágina é usada;
- documentos muito grandes podem consumir bastante memória durante OCR/PDF;
- PDF usa as fontes internas do jsPDF, adequadas ao português comum, mas não a todos os alfabetos;
- não há autenticação, colaboração simultânea, importação de PDF ou TEI XML;
- a versão FastAPI anterior continua no primeiro commit para eventual edição servidor/desktop, mas não participa da build do Pages.

## Roadmap

Backup/restauração de projetos, PWA offline, armazenamento persistente solicitado ao navegador, importação de PDF, processamento em Web Workers, comparação entre OCRs, destaque texto–imagem por bounding boxes, notas estruturadas, TEI XML, EPUB, pesquisa textual e sincronização opcional criptografada.
