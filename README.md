# BEATRICE

**Book Extraction And Transcription with Review, Image Correction and Export**

BEATRICE helps turn photographs or scans of printed pages into reviewed, editable documents. It is intended for books and historical sources where spelling, punctuation, accents, and page order must be preserved.

The application runs in the browser and stores its data on the user's device.

## How it works

1. Create a project for a book or document.
2. Add photographs or scans of its pages.
3. Run OCR to obtain an initial transcription.
4. Compare the text with the page image and correct recognition mistakes.
5. Mark checked pages as reviewed.
6. Export the finished transcription.

### What is OCR?

OCR means **Optical Character Recognition**. It is a process that identifies letters and words inside an image and converts them into editable text.

OCR is a starting point, not a final transcription. Old typefaces, damaged paper, shadows, and historical spelling can cause mistakes. BEATRICE therefore keeps the page image beside the text and requires human review.

## Transcription modes

- **Diplomatic transcription** preserves the original spelling, accents, punctuation, capitalization, abbreviations, and paragraph structure.
- **Normalized transcription** is a separate version that may use current spelling. It never replaces the diplomatic transcription.

If a passage cannot be read reliably, use a visible marker such as `[illegible]` or `[?]` instead of guessing.

## Main features

- Project and page management
- Multiple image upload
- JPG, PNG, TIFF, and WEBP support
- Missing page detection
- Image rotation and preprocessing
- OCR with Tesseract.js
- Portuguese and English interface
- Separate raw OCR, reviewed text, and normalized text
- Autosave and review status
- TXT, Markdown, HTML, DOCX, PDF, and JSON export

## Storage and privacy

BEATRICE is local-first: images and transcriptions are stored in IndexedDB, a database provided by the browser. Documents are not sent to a BEATRICE server.

Clearing the browser's site data removes locally stored projects. Avoid private browsing for long-term work and export your transcriptions regularly.

The first OCR run downloads the selected language model. Later runs may reuse the browser cache.

## Development

Node.js 22 or later is recommended.

```bash
npm install
npm run dev
```

Tests and production build:

```bash
npm test
npm run build
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

- `services/database.js`: browser storage
- `services/image-service.js`: image validation and processing
- `services/ocr-service.js`: text recognition
- `services/export-service.js`: document export
- `ui/`: application screens
- `i18n.js`: Portuguese and English text

---

## Português

O BEATRICE ajuda a transformar fotografias ou digitalizações de páginas impressas em documentos editáveis e revisados. Ele foi pensado para livros e fontes históricas nos quais é importante preservar grafia, pontuação, acentuação e ordem das páginas.

### Como funciona

1. Crie um projeto para o livro ou documento.
2. Adicione fotografias ou digitalizações das páginas.
3. Execute o OCR para obter uma transcrição inicial.
4. Compare o texto com a imagem e corrija os erros de reconhecimento.
5. Marque como revisadas as páginas já conferidas.
6. Exporte a transcrição final.

### O que é OCR?

OCR é a sigla em inglês para **Reconhecimento Óptico de Caracteres**. É o processo de identificar letras e palavras dentro de uma imagem e convertê-las em texto editável.

O resultado do OCR é apenas um ponto de partida. Tipografia antiga, papel danificado, sombras e grafia histórica podem causar erros. Por isso, o BEATRICE mostra a imagem ao lado do texto e mantém uma etapa de revisão humana.

### Modos de transcrição

- **Transcrição diplomática:** preserva grafia, acentuação, pontuação, maiúsculas, abreviações e estrutura do original.
- **Transcrição normalizada:** permite criar separadamente uma versão com ortografia atual. Ela nunca substitui a transcrição diplomática.

Quando não for possível ler um trecho com segurança, use um marcador visível como `[ilegível]` ou `[?]`, em vez de adivinhar.

### Armazenamento

Imagens e textos ficam no IndexedDB, um banco de dados do próprio navegador. Os documentos não são enviados para um servidor do BEATRICE.

Limpar os dados do site remove os projetos armazenados. Evite usar navegação anônima para trabalhos longos e exporte suas transcrições regularmente.

### Execução local

```bash
npm install
npm run dev
```

Testes e build:

```bash
npm test
npm run build
```
