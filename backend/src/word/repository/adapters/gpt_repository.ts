import { WordRepository } from "../word_repository";
import { Word } from "../../model/word_model";
import { OpenAI } from "openai";
import dotenv from 'dotenv';

dotenv.config();

export class GptWordRepository extends WordRepository {
    private openai: OpenAI;

    constructor() {
        super();
        this.openai = new OpenAI();
    }

    async getWordByWordCombination(word1: Word, word2: Word): Promise<Word | null> {
        const promptMessage = this.createPromptMessage(word1.word, word2.word);
        const completion = await this.fetchCompletion(promptMessage);
        return this.parseCompletionResult(completion) ?? null;
    }

    private createPromptMessage(word1: string, word2: string): string {
        return `Combine these words: <${word1}, ${word2}>`;
    }

    private async fetchCompletion(prompt: string): Promise<OpenAI.ChatCompletion> {
        return this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: `Your job is to combine two words given by the user, similar to the game 'little alchemy'
                    You should do this in the following way:
                    
                    Reasoning - Combination: 10 words deciding what a combination of these words would be.
                    Reasoning - emoji: 10 words deciding what emojis best represents the combined word. You can use 1-3 emojis to represent it.
                    Result: In this exact format:
                    --BEGIN RESULT--
                    \`\`\`json
                    {
                        "combination": "the combination",
                        "emoji": "the emoji"
                    }
                    \`\`\`
                    --END RESULT--
                    `
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        });
    }

    private parseCompletionResult(completion: OpenAI.ChatCompletion): Word | undefined {
        // Improved regex to handle any number of whitespace characters including new lines before and after the JSON content
        const resultPattern = /--BEGIN RESULT--\s*```json\s*({[\s\S]*?})\s*```\s*--END RESULT--/m;
        const match = completion.choices[0].message.content?.match(resultPattern);

        if (match && match[1]) {
            try {
                const result = JSON.parse(match[1].trim());
                return new Word(result.combination, result.emoji);
            } catch (error) {
                console.error("Error parsing JSON result:", error);
                return undefined;
            }
        } else {
            console.log(`No valid result found in the completion. Completion: ${completion.choices[0].message.content}`);
            return undefined;
        }
    }
}