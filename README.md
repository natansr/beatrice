# BEATRICE

**Book Extraction And Transcription with Review, Image Correction and Export**

BEATRICE é uma plataforma web local para transcrição fiel e preservação digital de documentos históricos impressos. A imagem permanece como fonte de verdade; o OCR bruto nunca é substituído; e a revisão humana é armazenada separadamente, sem modernização silenciosa da grafia.

> Screenshot placeholder: dashboard e revisão lado a lado serão documentados aqui após a primeira publicação.

## Funcionalidades do MVP

- criação, edição e exclusão confirmada de projetos;
- upload múltiplo seguro de JPG/JPEG, PNG, TIFF e WEBP, com miniaturas;
- nomes internos aleatórios e originais preservados em diretórios por projeto;
- numeração inferida do nome, ordenação e alerta de lacunas na sequência;
- processamento não destrutivo com escala de cinza, redução de ruído, contraste e limiar adaptativo;
- OCR Tesseract abstraído por `BaseOCRProvider`, com confiança e bounding boxes preservados;
- OCR bruto, transcrição diplomática revisada e versão normalizada em campos separados;
- revisão lado a lado com original/processada, zoom, navegação, autosave e status;
- histórico em momentos significativos (antes de novo OCR e ao marcar como revisada);
- dashboard de progresso;
- exportação TXT, Markdown, HTML, DOCX, PDF pesquisável e JSON;
- API REST e interface web responsiva em português.

## Tecnologias e arquitetura

Python 3.12+, FastAPI, SQLAlchemy 2, Pydantic, SQLite, Jinja2, Bootstrap 5, JavaScript, OpenCV, Pillow, pytesseract, python-docx, ReportLab e pytest. `DATABASE_URL` deixa a persistência preparada para PostgreSQL; providers e exportadores são extensíveis sem alterar as rotas.

```text
app/
  api/          rotas REST de projetos, páginas, exportação e configuração
  models/       Project, Page e PageRevision
  schemas/      contratos Pydantic
  services/     regras de projeto, imagem, OCR, páginas e exportação
  providers/    abstrações de OCR/visão e Tesseract/Mock
  exporters/    um exportador por formato
  templates/    dashboard, projeto, revisão e exportação
  static/       CSS e JavaScript
  main.py       composição da aplicação e rotas HTML
data/projects/  originais, processadas e exportações por UUID
tests/          testes de API, upload, regras e formatos
```

Cada projeto usa `data/projects/<uuid>/originals`, `processed` e `exports`. O arquivo SQLite padrão é `beatrice.db`.

## Instalação

Requer Python 3.12 ou posterior e Tesseract para executar OCR (a aplicação e os demais recursos funcionam sem o binário, mas a rota de OCR mostrará uma mensagem amigável).

```bash
python -m venv .venv
source .venv/bin/activate       # Linux/macOS
# .venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Acesse <http://localhost:8000>. A documentação OpenAPI fica em <http://localhost:8000/docs>.

## Tesseract e português

macOS com Homebrew:

```bash
brew install tesseract tesseract-lang
tesseract --list-langs | grep por
```

Ubuntu/Debian:

```bash
sudo apt update
sudo apt install tesseract-ocr tesseract-ocr-por
tesseract --list-langs | grep por
```

Windows: instale uma distribuição do Tesseract com o pacote `por.traineddata` e defina no `.env` o caminho completo, por exemplo `TESSERACT_CMD=C:\Program Files\Tesseract-OCR\tesseract.exe`.

## Configuração

```dotenv
BEATRICE_ENV=development
DATABASE_URL=sqlite:///./beatrice.db
TESSERACT_CMD=
MAX_UPLOAD_SIZE_MB=25
DATA_DIR=./data
```

Não grave credenciais no repositório. O `MockVisionProvider` e o prompt diplomático estão preparados para uma futura integração multimodal, mas nenhuma API externa é chamada.

## Fluxo de uso

1. Em **Novo projeto**, informe título, autor, idioma e modo.
2. Abra o projeto, escolha **Adicionar páginas** e envie imagens. Números no fim do nome são usados como página; a página inicial serve de fallback.
3. Abra uma página, confira a imagem e use **Processar imagem** quando necessário.
4. Use **Executar OCR**. O resultado bruto é preservado e copiado para revisão somente se ela ainda estiver vazia.
5. Corrija fielmente o texto; o autosave ocorre após 1,2 segundo sem digitação. Marque a página como revisada ou pendente.
6. Em **Exportar**, escolha formato, transcrição e opções. Por segurança editorial, páginas não revisadas ficam fora por padrão.

## Testes

```bash
source .venv/bin/activate
pytest -q
```

A suíte cobre criação/edição, upload e validação, número/ordenação, lacunas, texto revisado, status e todos os seis exportadores. Para testar OCR manualmente, use uma imagem real e confirme que `por` aparece em `tesseract --list-langs`.

## API principal

- `GET/POST /api/projects`, `GET/PUT/DELETE /api/projects/{id}`;
- `GET/POST /api/projects/{id}/pages`;
- `GET/PUT/DELETE /api/pages/{id}`;
- `POST /api/pages/{id}/process`, `/ocr`, `/mark-reviewed`, `/mark-needs-review`;
- `POST /api/projects/{id}/export`.

## Limitações atuais

- uso local e monousuário, sem autenticação nem filas assíncronas;
- tabelas são criadas automaticamente; migrações Alembic ainda não foram incluídas;
- deskew, perspectiva, rotação, substituição e reordenação visual ainda não têm controles na interface;
- não há importação de PDF, análise semântica de notas/blocos nem recuperação de revisões pela interface;
- o PDF usa fontes padrão do ReportLab: português/acentos usuais são suportados, mas alfabetos fora de Latin-1 exigirão fonte Unicode configurável;
- Bootstrap é carregado via CDN; para funcionamento totalmente offline deve ser empacotado localmente;
- marcadores de páginas ausentes estão reservados no contrato de exportação, sem inserção automática no texto.

## Roadmap

Alembic/PostgreSQL, Docker, autenticação e múltiplos usuários; processamento assíncrono; opções avançadas de OpenCV; PaddleOCR e comparação de motores; integração multimodal; realce texto–imagem por bounding boxes; estrutura semântica para notas/citações/ilegíveis; importação de PDF; TEI XML, EPUB e ODT; pesquisa textual; recuperação avançada de versões e publicação de coleções.

## Princípios editoriais

1. A imagem é a fonte de verdade.
2. Nunca modernizar grafia histórica silenciosamente.
3. Nunca inventar conteúdo ilegível.
4. Preservar imagem, OCR bruto e proveniência da página.
5. Manter revisão humana e normalização separadas.
6. Tornar incerteza visível e exportações reproduzíveis.
