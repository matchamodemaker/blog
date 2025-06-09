import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Client } from 'pg'

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432
})

async function run() {
    await client.connect()

    const filePath = path.join(__dirname, '/dummy.md')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { content, data } = matter(raw)

    await client.query(
        'INSERT INTO posts (slug, title, content) VALUES ($1, $2, $3)',
        [path.basename(filePath, '.md'), data.title || '', content]
    )

    await client.end()
}

run().catch(console.error)
