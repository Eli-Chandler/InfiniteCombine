import {Word} from "../model/word_model";

export abstract class WordRepository {

    abstract getWordByWordCombination(word1: Word, word2: Word): Promise<Word | null>;
}

export abstract class StoringWordRepository extends WordRepository {
    abstract getWordById(id: number | string): Promise<Word | null>;
    abstract getWordByString(word: string): Promise<Word | null>;
    abstract addWord(word: Word): Promise<void>;
    abstract addWordCombination(word1: Word, word2: Word, result: Word): Promise<void>;
}