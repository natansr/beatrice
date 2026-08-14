# BEATRICE

**Book Extraction And Transcription with Review, Image Correction and Export**

BEATRICE is a web application for OCR, transcription, and review of scanned books and historical printed documents.

It runs entirely in the browser. Projects, images, OCR results, and reviewed text are stored locally using IndexedDB.

## Features

- Project and page management
- Multiple image upload
- JPG, PNG, TIFF, and WEBP support
- Missing page detection
- Image rotation and preprocessing
- OCR with Tesseract.js
- Portuguese and English interface
- Separate raw OCR, reviewed text, and normalized text
- Autosave and page review status
- TXT, Markdown, HTML, DOCX, PDF, and JSON export

## Development

Requirements:

- Node.js 22 or later
- npm

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the tests:

```bash
npm test
```

## Project structure

```text
src/
  i18n.js
  main.js
  router.js
  services/
  ui/
  styles.css
```

- `services/database.js`: IndexedDB storage
- `services/image-service.js`: image validation and processing
- `services/ocr-service.js`: Tesseract.js integration
- `services/export-service.js`: document export
- `ui/`: application screens
- `i18n.js`: Portuguese and English translations

## Notes

- Data is stored in the current browser profile.
- Clearing site data removes locally stored projects.
- The first OCR run downloads the selected Tesseract language model.
- Large images may require significant browser memory.

---

## Português

BEATRICE é uma aplicação web para OCR, transcrição e revisão de livros digitalizados e documentos históricos impressos.

A aplicação funciona inteiramente no navegador. Projetos, imagens, resultados do OCR e textos revisados são armazenados localmente com IndexedDB.

### Funcionalidades

- Gerenciamento de projetos e páginas
- Upload múltiplo de imagens
- Suporte a JPG, PNG, TIFF e WEBP
- Detecção de páginas ausentes
- Rotação e pré-processamento de imagens
- OCR com Tesseract.js
- Interface em português e inglês
- OCR bruto, texto revisado e texto normalizado separados
- Salvamento automático e status de revisão
- Exportação TXT, Markdown, HTML, DOCX, PDF e JSON

### Execução

```bash
npm install
npm run dev
```

Testes e build:

```bash
npm test
npm run build
```

Os dados ficam armazenados no navegador. A limpeza dos dados do site remove os projetos locais.
