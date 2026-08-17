# BEATRICE

BEATRICE extracts editable text from photographs and scans of printed pages. It also provides page organization, manual review, and export to TXT, Markdown, HTML, DOCX, PDF, and JSON.

Use the application at [natansr.github.io/beatrice](https://natansr.github.io/beatrice/).

## How to use

1. Create a project and select the document language.
2. Add page images in JPEG, PNG, TIFF, or WEBP format.
3. Open a page and select **Recognize text**.
4. Check and edit the generated text.
5. Mark reviewed pages and export the project.

Images and text remain in the browser. Clearing the site's browser data removes saved projects. Recognition is automatic but errors may occur with shadows, curved pages, handwriting, or damaged print.

## Development

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

The application is static and has no server or Python dependency.

---

## Português

O BEATRICE extrai texto editável de fotografias e digitalizações de páginas impressas. Também permite organizar páginas, revisar o texto e exportar em TXT, Markdown, HTML, DOCX, PDF e JSON.

Use a aplicação em [natansr.github.io/beatrice](https://natansr.github.io/beatrice/).

### Como usar

1. Crie um projeto e informe o idioma do documento.
2. Adicione imagens em JPEG, PNG, TIFF ou WEBP.
3. Abra uma página e selecione **Reconhecer texto**.
4. Confira e edite o texto gerado.
5. Marque as páginas revisadas e exporte o projeto.

As imagens e os textos permanecem no navegador. A limpeza dos dados do site apaga os projetos salvos. O reconhecimento é automático, mas pode errar em páginas com sombras, curvatura, escrita à mão ou impressão danificada.

### Desenvolvimento

É necessário ter Node.js 22 ou mais recente.

```bash
npm install
npm run dev
```

```bash
npm test
npm run build
```

A aplicação é estática e não depende de servidor nem de Python.
