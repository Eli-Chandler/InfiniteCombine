export interface WordDTO {
    word: string
    emoji: string
    id: number
    isNew: boolean
}

export interface WordListProp {
    words: WordDTO[]
}

export interface WordFormProp {
    addWord: (word: WordDTO) => void;
}