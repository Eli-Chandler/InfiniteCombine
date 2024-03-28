import {StoringWordRepository} from "../word_repository";
import {Word} from "../../model/word_model";
import { Pool} from "pg";


export class PostgresWordRepository extends StoringWordRepository {
    private pool: Pool;

    constructor(dbUrl: string) {
        super();
        this.pool = new Pool({connectionString: dbUrl});

    }

    async getWordById(id: number | string): Promise<Word | null> {
        const client = await this.pool.connect();
        const res = await client.query<{word: string, emoji: string, id: string}>('SELECT * FROM words WHERE id = $1', [id]);
        client.release();

        if (res.rows.length == 0) {
            return null;
        }

        return new Word(res.rows[0].word, res.rows[0].emoji, res.rows[0].id);
    }

    async getWordByString(word: string): Promise<Word | null> {
        const client = await this.pool.connect();
        const res = await client.query('SELECT * FROM words WHERE word = $1', [word]);
        client.release();

        if (res.rows.length == 0) {
            return null;
        }

        return new Word(res.rows[0].word, res.rows[0].emoji, res.rows[0].id);
    }

    async getWordByWordCombination(word1: Word, word2: Word): Promise<Word | null> {

        const query = 'SELECT combination_word_id FROM word_combinations WHERE word1_id = $1 AND word2_id = $2';
        const values = [word1.id, word2.id];

        const client = await this.pool.connect();
        const res = await client.query<{combination_word_id: number}>(query, values);
        client.release();

        if (res.rows.length == 0) {
            return null;
        }

        return await this.getWordById(res.rows[0].combination_word_id);
    }

    async addWord(word: Word) {
        // upsert, returning id
        console.log('Adding word', word.word, word.emoji)
        // Connect to the database if not already connected

        const query = `
        INSERT INTO words (word, emoji) VALUES ($1, $2)
        ON CONFLICT(word) DO UPDATE SET word = $1, emoji = $2
        RETURNING id
        ` // Dummy update so that the query always returns the id

        const values = [word.word, word.emoji];

        const client = await this.pool.connect();
        const res = await client.query<{id: number}>(query, values);
        client.release();

        console.log(res.rows)

        word.id = res.rows[0].id;
        return;
    }

    async addWordCombination(word1: Word, word2: Word, result: Word) {
        await this.addWord(word1);
        await this.addWord(word2);
        await this.addWord(result);


        if (word1.id == null || word2.id == null || result.id == null) {
            throw new Error('Word IDs must be set');
        }

        const query = 'INSERT INTO word_combinations (word1_id, word2_id, combination_word_id) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING';
        // Sort the words by id to ensure that the same combination is always stored the same way
        // Sort alphabetically
        const [firstWord, secondWord] = word1.id < word2.id ? [word1, word2] : [word2, word1];
        const values = [firstWord.id, secondWord.id, result.id];

        const client = await this.pool.connect();
        await client.query<{}>(query, values);
        client.release();
    }
}