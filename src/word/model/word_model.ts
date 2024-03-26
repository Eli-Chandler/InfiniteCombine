export class Word {
    id: number | null;
    word: string;
    emoji: string;

    constructor(word: string, emoji: string, id: number | null = null) {
        this.id = id;
        this.word = word;
        this.emoji = emoji;
    }
}