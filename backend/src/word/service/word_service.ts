import { Word } from '../model/word_model';

export abstract class WordService {
    abstract getWordByString(wordString: string): Promise<Word | null>;
    abstract getWordById(id: number | string): Promise<Word | null>;
    abstract addWord(word: Word): Promise<void>;
    async combineWords(word1: Word, word2: Word): Promise<Word | null> {
        // sort the words alphabetically
        if (word1.word < word2.word) {
            return await this.combineWordsTemplate(word1, word2);
        } else {
            return await this.combineWordsTemplate(word2, word1);
        }
    }

    protected abstract combineWordsTemplate(word1: Word, word2: Word): Promise<Word | null>;
}