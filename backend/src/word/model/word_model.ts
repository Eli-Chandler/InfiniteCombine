export class Word {
    id: number | string | null;
    word: string;
    emoji: string;

    constructor(word: string, emoji: string, id: number | null | string = null) {
        this.id = id;
        this.word = word;
        this.emoji = emoji;
    }
}