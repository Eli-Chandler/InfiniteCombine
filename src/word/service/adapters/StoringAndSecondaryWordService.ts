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

    protected async combineWordsTemplate(word1: Word, word2: Word): Promise<Word | undefined> {
        let combination: Word | undefined;

        combination = await this.storingWordRepository.getWordByWordCombination(word1, word2);

        if (combination != undefined) {
            return combination;
        }

        combination = await this.secondaryWordRepository.getWordByWordCombination(word1, word2);

        if (combination == undefined) {
            return undefined;
        }

        this.storingWordRepository.addWordCombination(word1, word2, combination);

        return combination;
    }

    async getWordById(id: number): Promise<Word | undefined> {
        return await this.storingWordRepository.getWordById(id);
    }

    async getWordByString(wordString: string): Promise<Word | undefined> {
        return await this.storingWordRepository.getWordByString(wordString);
    }

    async addWord(word: Word): Promise<void> {
        await this.storingWordRepository.addWord(word);
    }

}