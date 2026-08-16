# BEATRICE

Book Extraction And Transcription with Review, Image Correction and Export.

BEATRICE is a browser application for transcribing photographed or scanned printed documents. It manages source images, recognized text, manual review, page status, and document export.

The interface is available in English and Portuguese.

## Current version

The application is static and runs without a backend. Data is stored in IndexedDB under the current browser profile.

| Area | Implementation |
| --- | --- |
| Projects | Create, edit, and delete |
| Pages | Multiple upload, numbering, sorting, and gap detection |
| Images | Original file, processed copy, rotation, zoom, and grayscale processing |
| Text recognition | Tesseract.js with Portuguese and English models |
| Review | Editable transcription, autosave, navigation, and page status |
| Export | TXT, Markdown, HTML, DOCX, PDF, and JSON |
| Interface | English and Portuguese |

## Transcription data

Each page stores three text fields:

- `rawOcrText`: unchanged output from text recognition;
- `reviewedText`: text checked and edited by the user;
- `normalizedText`: optional modernized text.

Changing the reviewed text does not modify the raw recognition result. A new recognition run does not replace an existing reviewed transcription.

The page status can be:

- `uploaded`
- `pending`
- `processing`
- `transcribed`
- `needs_review`
- `reviewed`
- `error`

## Supported images

- JPEG
- PNG
- TIFF
- WEBP

The upload limit is 25 MB per file. The original file is stored unchanged. Image processing creates a separate PNG copy. For multi-page TIFF files, the current version uses the first image.

## Text recognition

OCR (Optical Character Recognition) converts text visible in an image into editable text. BEATRICE uses Tesseract.js in the browser.

The project language selects the recognition model:

- `por`: Portuguese
- `eng`: English

Recognition results require manual review. Word confidence and bounding boxes are stored when returned by Tesseract.js.

## Storage

IndexedDB contains three object stores:

- `projects`
- `pages`
- `revisions`

There is no remote synchronization. Data belongs to the browser profile and site origin. Clearing site data deletes the stored projects.

## Development

Requirements:

- Node.js 22 or later
- npm

Install and run:

```bash
npm install
npm run dev
```

Tests:

```bash
npm test
```

Production build:

```bash
npm run build
```

The build command creates `dist/` and synchronizes a production copy to the repository root for GitHub Pages.

## Source structure

```text
src/
  i18n.js
  main.js
  router.js
  services/
    database.js
    export-service.js
    image-service.js
    ocr-service.js
    project-service.js
  ui/
    components.js
    export.js
    home.js
    project.js
    review.js
  styles.css
```

## Tests

The test suite covers:

- page-number inference;
- invalid image rejection;
- missing-page detection;
- project statistics;
- English and Portuguese translations;
- TXT, Markdown, HTML, and JSON content generation.

## Limitations

- No synchronization between devices
- No user accounts or collaborative editing
- No PDF import
- No full-project backup and restore
- No TEI XML or EPUB export
- Browser storage and memory limits apply

---

## Português

BEATRICE é uma aplicação de navegador para transcrição de documentos impressos fotografados ou digitalizados. O sistema gerencia imagens, reconhecimento de texto, revisão manual, estado das páginas e exportação.

### Versão atual

A aplicação é estática e não possui backend. Os dados são armazenados no IndexedDB do perfil atual do navegador.

| Área | Implementação |
| --- | --- |
| Projetos | Criação, edição e exclusão |
| Páginas | Upload múltiplo, numeração, ordenação e detecção de lacunas |
| Imagens | Arquivo original, cópia processada, rotação, zoom e escala de cinza |
| Reconhecimento | Tesseract.js com modelos em português e inglês |
| Revisão | Texto editável, salvamento automático, navegação e estado da página |
| Exportação | TXT, Markdown, HTML, DOCX, PDF e JSON |
| Interface | Português e inglês |

### Dados da transcrição

Cada página possui três campos de texto:

- `rawOcrText`: resultado original do reconhecimento;
- `reviewedText`: texto conferido e editado pelo usuário;
- `normalizedText`: versão modernizada opcional.

A edição do texto revisado não altera o resultado original. Uma nova execução do reconhecimento não substitui uma transcrição revisada já existente.

### Imagens

São aceitos JPEG, PNG, TIFF e WEBP, com limite de 25 MB por arquivo. O original é armazenado sem alterações. O processamento gera uma cópia PNG separada. Em arquivos TIFF com várias páginas, a versão atual utiliza a primeira imagem.

### Reconhecimento de texto

OCR é a sigla em inglês para reconhecimento óptico de caracteres. O processo converte o texto visível na imagem em texto editável. O BEATRICE usa Tesseract.js no navegador, com os modelos `por` e `eng`.

O resultado deve ser conferido manualmente. Confiança por palavra e coordenadas são armazenadas quando fornecidas pelo Tesseract.js.

### Armazenamento

O IndexedDB possui três coleções: `projects`, `pages` e `revisions`. Não existe sincronização remota. A limpeza dos dados do site apaga os projetos armazenados.

### Desenvolvimento

```bash
npm install
npm run dev
```

Testes e build:

```bash
npm test
npm run build
```

### Limitações

- Sem sincronização entre dispositivos
- Sem contas de usuário ou edição colaborativa
- Sem importação de PDF
- Sem backup e restauração do projeto completo
- Sem exportação TEI XML ou EPUB
- Sujeito aos limites de armazenamento e memória do navegador
