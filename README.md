# BEATRICE

Book Extraction And Transcription with Review, Image Correction and Export

BEATRICE is a browser-based workspace for transcribing scanned books and historical printed documents. It keeps the source image, raw OCR output, and reviewed transcription as separate records.

[Open BEATRICE](https://natansr.github.io/beatrice/)

English and Brazilian Portuguese are available from the language switcher in the header.

## What it does

- Organizes pages into projects.
- Stores projects and images locally in IndexedDB.
- Imports JPG, PNG, TIFF, and WEBP files.
- Detects gaps in page numbering.
- Applies grayscale, contrast, threshold, rotation, and resizing in the browser.
- Runs Portuguese or English OCR with Tesseract.js.
- Keeps raw OCR separate from reviewed and normalized text.
- Saves edits automatically and tracks page status.
- Exports TXT, Markdown, HTML, DOCX, PDF, and JSON.

The application does not upload documents to a BEATRICE server. Processing and storage happen in the browser.

## Running locally

Node.js 22 or later is recommended.

```bash
npm install
npm run dev
```

Production build:

```bash
npm test
npm run build
npm run preview
```

The Vite base path is `/beatrice/`, matching the GitHub Pages project URL.

## Project structure

```text
src/
  i18n.js                 English and Portuguese interface strings
  main.js                 application entry point
  router.js               hash-based routing
  services/
    database.js           IndexedDB storage
    image-service.js      image validation, TIFF decoding, and Canvas processing
    ocr-service.js        Tesseract.js integration
    export-service.js     TXT, Markdown, HTML, DOCX, PDF, and JSON exports
    project-service.js    project statistics and missing-page detection
  ui/                     dashboard, project, review, and export views
```

The original FastAPI prototype remains in the repository history and under `app/`. It is not included in the GitHub Pages build.

## Data and privacy

Projects belong to the browser profile and the `natansr.github.io` origin. Clearing site data can remove them. Private browsing should not be used for long transcription work. Export work regularly until full project backup and restore are implemented.

The first OCR run downloads the Tesseract worker and the selected language model. Later runs may use the browser cache.

## Tests

```bash
npm test
npm audit
```

GitHub Actions runs the tests and production build before deploying to Pages.

## Current limitations

- Projects do not synchronize between devices.
- Storage capacity depends on the browser quota.
- For multi-page TIFF files, only the first image is displayed.
- Large images and PDFs can require substantial memory.
- There is no PDF import, TEI XML export, or collaborative editing yet.

## Português

O BEATRICE é uma aplicação local-first para transcrição e revisão de livros digitalizados e documentos históricos. Projetos, imagens e textos ficam armazenados no IndexedDB do navegador. O OCR é executado localmente com Tesseract.js, sem envio dos documentos para um servidor do BEATRICE.

A interface pode ser alternada entre português e inglês pelo botão no cabeçalho. A aplicação preserva separadamente a imagem original, o OCR bruto, a transcrição revisada e o texto normalizado.

Para executar localmente:

```bash
npm install
npm run dev
```

Antes de contribuir, execute:

```bash
npm test
npm run build
```

## License

No license has been selected yet.
