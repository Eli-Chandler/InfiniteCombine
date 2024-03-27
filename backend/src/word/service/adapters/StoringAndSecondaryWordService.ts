import {WordService} from "../word_service";
import {Word} from "../../model/word_model";
import {StoringWordRepository, WordRepository} from "../../repository/word_repository";

export class StoringAndSecondaryWordService extends WordService {
    private storingWordRepository: StoringWordRepository;
    private secondaryWordRepository: WordRepository
    constructor(storingWordRepository: StoringWordRepository, secondaryWordRepository: WordRepository) {
        super();
        this.storingWordRepository = storingWordRepository;
        this.secondaryWordRepository = secondaryWordRepository;
    }

    protected async combineWordsTemplate(word1: Word, word2: Word): Promise<Word | null> {
        let combinedWord = await this.storingWordRepository.getWordByWordCombination(word1, word2);
        if (combinedWord != null) {
            console.log("Found in storing repository")
            return combinedWord;
        }
        console.log("Not found in storing repository")

        combinedWord = await this.secondaryWordRepository.getWordByWordCombination(word1, word2);

        if (combinedWord != null) {
            combinedWord = await this.storingWordRepository.getWordByString(combinedWord.word) ?? combinedWord;
            await this.storingWordRepository.addWordCombination(word1, word2, combinedWord);
        }

        return combinedWord;
    }

    async getWordById(id: number): Promise<Word | null> {
        return await this.storingWordRepository.getWordById(id);
    }

    async getWordByString(wordString: string): Promise<Word | null> {
        return await this.storingWordRepository.getWordByString(wordString);
    }

    async addWord(word: Word): Promise<void> {
        await this.storingWordRepository.addWord(word);
    }

}