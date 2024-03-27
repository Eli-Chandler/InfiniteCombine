import {StoringWordRepository, WordRepository} from "../word_repository";
import {Word} from "../../model/word_model";

export class MemoryWordRepository extends  StoringWordRepository {
    private wordIdDb: Map<Number, Word> = new Map();
    private wordCombinationDb: Map<string, Word> = new Map();
    private wordStringDb: Map<string, Word> = new Map();
    private idCounter: number = 0;

    async getWordById(id: number): Promise<Word | null> {
        return this.wordIdDb.get(id) ?? null;
    }

    async getWordByString(word: string): Promise<Word | null> {
        return this.wordStringDb.get(word) ?? null;
    }

    async getWordByWordCombination(word1: Word, word2: Word): Promise<Word | null> {
        return this.wordCombinationDb.get(this.serializeWordCombination(word1, word2)) ?? null;
    }

    async addWord(word: Word) {
        if (word.id == null) {
            word.id = this.idCounter++;
        }

        this.wordIdDb.set(word.id, word);
        this.wordStringDb.set(word.word, word);
    }

    async addWordCombination(word1: Word, word2: Word, result: Word) {
        word1 = await this.getWordByString(word1.word) ?? word1;
        word2 = await this.getWordByString(word2.word) ?? word2;
        result = await this.getWordByString(result.word) ?? result;

        this.wordCombinationDb.set(this.serializeWordCombination(word1, word2), result);
    }

    private serializeWordCombination(word1: Word, word2: Word): string {
        return `${word1.word}+${word2.word}`;
    }
}