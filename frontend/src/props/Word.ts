export interface WordDTO {
    word: string
    emoji: string
    wordId: number
    isNew: boolean
}

export interface WordListProp {
    words: WordDTO[]
    addWord: (word: WordDTO) => void;
}

export interface WordFormProp {
    addWord: (word: WordDTO) => void;
}