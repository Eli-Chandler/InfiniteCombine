import {StoringWordRepository, WordRepository} from "../word_repository";
import {Word} from "../../model/word_model";

export class MemoryWordRepository extends  StoringWordRepository {
    private wordIdDb: Map<Number, Word> = new Map();
    private wordCombinationDb: Map<[Word, Word], Word> = new Map();
    private wordStringDb: Map<string, Word> = new Map();
    private idCounter: number = 0;

    async getWordById(id: number): Promise<Word | undefined> {
        return this.wordIdDb.get(id);
    }

    async getWordByString(word: string): Promise<Word | undefined> {
        return this.wordStringDb.get(word);
    }

    async getWordByWordCombination(word1: Word, word2: Word): Promise<Word | undefined> {
        return this.wordCombinationDb.get([word1, word2]);
    }

    async addWord(word: Word) {
        if (word.id == null) {
            word.id = this.idCounter++;
        }

        this.wordIdDb.set(word.id, word);
        this.wordStringDb.set(word.word, word);
    }

    async addWordCombination(word1: Word, word2: Word, result: Word) {
        this.addWord(word1);
        this.addWord(word2);
        this.addWord(result);
        this.wordCombinationDb.set([word1, word2], result);
    }
}