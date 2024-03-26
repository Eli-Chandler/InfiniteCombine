import {Word} from "../model/word_model";

export abstract class WordRepository {

    abstract getWordByWordCombination(word1: Word, word2: Word): Promise<Word | undefined>;
}

export abstract class StoringWordRepository extends WordRepository {
    abstract getWordById(id: number): Promise<Word | undefined>;
    abstract getWordByString(word: string): Promise<Word | undefined>;
    abstract addWord(word: Word): Promise<void>;
    abstract addWordCombination(word1: Word, word2: Word, result: Word): Promise<void>;
}