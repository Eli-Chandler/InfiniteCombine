import { Word } from '../model/word_model';

export abstract class WordService {
    abstract getWordByString(wordString: string): Promise<Word | undefined>;
    abstract getWordById(id: number): Promise<Word | undefined>;
    abstract addWord(word: Word): Promise<void>;
    async combineWords(word1: Word, word2: Word): Promise<Word | undefined> {
        // sort the words alphabetically
        if (word1.word < word2.word) {
            return this.combineWordsTemplate(word1, word2);
        } else {
            return this.combineWordsTemplate(word2, word1);
        }
    }

    protected abstract combineWordsTemplate(word1: Word, word2: Word): Promise<Word | undefined>;
}