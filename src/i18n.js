const messages = {
  'pt-BR': {
    projects: 'Projetos', newProject: 'Novo projeto', noProjects: 'Nenhum projeto.',
    updated: 'Atualizado', title: 'Título', author: 'Autor', authorMissing: 'Autor não informado', documentLanguage: 'Idioma do documento', transcriptionType: 'Tipo de transcrição',
    diplomatic: 'Diplomática — preservar o original', normalized: 'Normalizada — atualizar a grafia', description: 'Descrição', handwritten: 'Incluir notas marginais manuscritas',
    createProject: 'Criar projeto', edit: 'Editar', delete: 'Excluir', export: 'Exportar', addPages: 'Adicionar páginas',
    portuguese: 'Português', english: 'Inglês', pages: 'Páginas', processed: 'Processadas', withOcr: 'Com texto', reviewed: 'Revisadas', toReview: 'A revisar',
    reviewedCount: '{reviewed} de {total} revisadas', missingPages: 'Possíveis páginas ausentes:', noPlaceholder: 'Nenhuma página fictícia foi criada.', noPages: 'Nenhuma página enviada.',
    chooseImages: 'Arraste imagens ou escolha arquivos', imageHelp: 'JPG, PNG, TIFF ou WEBP · até 25 MB', fallbackPage: 'Número da primeira página', importPages: 'Importar páginas',
    editProject: 'Editar projeto', save: 'Salvar', confirmProjectDelete: 'Excluir “{title}” e todas as imagens armazenadas neste navegador?', confirmPageDelete: 'Excluir esta página?', imported: '{count} página(s) importada(s).',
    previous: 'Anterior', next: 'Próxima', page: 'Página', saved: 'Salvo', unsaved: 'Alterações não salvas', original: 'Original', processedImage: 'Processada', fit: 'Ajustar',
    processImage: 'Processar imagem', runOcr: 'Reconhecer texto', ocrTitle: 'Converter o texto da imagem em texto editável.', markReview: 'Marcar para revisão', markReviewed: 'Marcar revisada', transcriptionPlaceholder: 'Texto da página',
    processHelp: 'Corrigir sombras e contraste da fotografia. O original é preservado.',
    processing: 'Processando…', preparingImage: 'Corrigindo sombras e contraste…', recognitionPass: 'Leitura {current} de {total}: {value}%', imageProcessed: 'Imagem processada sem alterar o original.', ocrFailed: 'Reconhecimento falhou: {message}', ocrConfidence: 'Confiança: {value}%',
    backProject: 'Voltar ao projeto', exportProject: 'Exportar projeto', format: 'Formato', transcription: 'Transcrição', diplomaticReviewed: 'Diplomática (texto revisado)',
    includePageNumbers: 'Incluir números de página', preserveBoundaries: 'Preservar limites de página', includeUnreviewed: 'Incluir páginas não revisadas', includeMetadata: 'Incluir metadados', titlePage: 'Adicionar página de título',
    generateDownload: 'Gerar e baixar', generating: 'Gerando…', exportDone: 'Exportação concluída.', exportFailed: 'Falha na exportação.', notFound: 'Página não encontrada', back: 'Voltar', close: 'Fechar',
    noPagesToExport: 'Nenhuma página corresponde às opções de exportação.', noTextToExport: 'As páginas selecionadas não possuem texto para exportar.',
    status_reviewed: '✓ Revisada', status_needs_review: '⚠ A revisar', status_uploaded: '○ Enviada', status_pending: '○ Pendente', status_processing: '◌ Processando', status_transcribed: '○ Transcrita', status_error: '× Erro',
    pageMarker: 'PÁGINA', metadataAuthor: 'Autor', localeCode: 'pt-BR', languageName: 'English',
  },
  'en-US': {
    projects: 'Projects', newProject: 'New project', noProjects: 'No projects.',
    updated: 'Updated', title: 'Title', author: 'Author', authorMissing: 'Author not provided', documentLanguage: 'Document language', transcriptionType: 'Transcription type',
    diplomatic: 'Diplomatic — preserve the original', normalized: 'Normalized — update spelling', description: 'Description', handwritten: 'Include handwritten marginal notes',
    createProject: 'Create project', edit: 'Edit', delete: 'Delete', export: 'Export', addPages: 'Add pages',
    portuguese: 'Portuguese', english: 'English', pages: 'Pages', processed: 'Processed', withOcr: 'With text', reviewed: 'Reviewed', toReview: 'Needs review',
    reviewedCount: '{reviewed} of {total} reviewed', missingPages: 'Possible missing pages:', noPlaceholder: 'No placeholder page was created.', noPages: 'No pages uploaded.',
    chooseImages: 'Drop images here or choose files', imageHelp: 'JPG, PNG, TIFF, or WEBP · up to 25 MB', fallbackPage: 'First page number', importPages: 'Import pages',
    editProject: 'Edit project', save: 'Save', confirmProjectDelete: 'Delete “{title}” and every image stored in this browser?', confirmPageDelete: 'Delete this page?', imported: '{count} page(s) imported.',
    previous: 'Previous', next: 'Next', page: 'Page', saved: 'Saved', unsaved: 'Unsaved changes', original: 'Original', processedImage: 'Processed', fit: 'Fit',
    processImage: 'Process image', runOcr: 'Recognize text', ocrTitle: 'Convert text in the image into editable text.', markReview: 'Mark as needs review', markReviewed: 'Mark as reviewed', transcriptionPlaceholder: 'Page text',
    processHelp: 'Correct shadows and contrast in the photograph. The original is preserved.',
    processing: 'Processing…', preparingImage: 'Correcting shadows and contrast…', recognitionPass: 'Reading {current} of {total}: {value}%', imageProcessed: 'Image processed without changing the original.', ocrFailed: 'Recognition failed: {message}', ocrConfidence: 'Confidence: {value}%',
    backProject: 'Back to project', exportProject: 'Export project', format: 'Format', transcription: 'Transcription', diplomaticReviewed: 'Diplomatic (reviewed text)',
    includePageNumbers: 'Include page numbers', preserveBoundaries: 'Preserve page boundaries', includeUnreviewed: 'Include unreviewed pages', includeMetadata: 'Include metadata', titlePage: 'Add title page',
    generateDownload: 'Generate and download', generating: 'Generating…', exportDone: 'Export complete.', exportFailed: 'Export failed.', notFound: 'Page not found', back: 'Back', close: 'Close',
    noPagesToExport: 'No pages match the export options.', noTextToExport: 'The selected pages contain no text to export.',
    status_reviewed: '✓ Reviewed', status_needs_review: '⚠ Needs review', status_uploaded: '○ Uploaded', status_pending: '○ Pending', status_processing: '◌ Processing', status_transcribed: '○ Transcribed', status_error: '× Error',
    pageMarker: 'PAGE', metadataAuthor: 'Author', localeCode: 'en-US', languageName: 'Português',
  },
}

export const getLocale = () => (typeof localStorage !== 'undefined' && localStorage.getItem('beatrice-locale')) || (typeof navigator !== 'undefined' && navigator.language?.startsWith('pt') ? 'pt-BR' : 'en-US')
export const setLocale = locale => { if (typeof localStorage !== 'undefined') localStorage.setItem('beatrice-locale', locale) }
export function t(key, values = {}) {
  const locale = getLocale(), template = messages[locale]?.[key] ?? messages['en-US'][key] ?? key
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template)
}
export const toggleLocale = () => setLocale(getLocale() === 'pt-BR' ? 'en-US' : 'pt-BR')
