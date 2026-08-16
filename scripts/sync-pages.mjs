import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'

await rm('assets', { recursive: true, force: true })
await mkdir('assets', { recursive: true })
await cp('dist/assets', 'assets', { recursive: true })

const source = await readFile('dist/index.source.html', 'utf8')
await writeFile('dist/index.html', source)
await writeFile('index.html', source)
await writeFile('.nojekyll', '')

