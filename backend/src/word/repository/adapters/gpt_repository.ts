import { WordRepository } from "../word_repository";
import { Word } from "../../model/word_model";
import { OpenAI } from "openai";

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
            model: process.env.OPENAI_MODEL_ID || 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        `
Your job is to determine the result of mixing the two words given by the user. Inspired by the game 'Little Alchemy'.
Here are some guidelines to follow:
Do's and Don'ts:

- Do use REAL words only. No made-up words or names.

- Don't just combine the two inputs, like mud + energy = mudergy. Instead, think about how the two words could combine to create something new.

- Do follow realistic principles for combinations, like "earth + seed" equals "seedling", keeping results grounded in real-world logic.

- Do aim for simplicity over complexity. The best results are often the simplest.

- Do follow the little alchemy's original combinations as a guide for any existing combinations.

- Don't include anything other than the resulting word in the result, for example "earth + seed = seedling", "combination": "seedling"., NOT "combination": "earth + seed = seedling".

- Do use proper capitalisation in the final result.

Before you give any response you should do the following:

Before deciding on the combination, ruminate on the elements provided. Think about how they could logically combine to create something new. Consider the properties of each element and how they might interact.
Do this in 2-3 short sentences. Then and only then, conclude with the combination and an appropriate emoji to represent it.

Finally, give the result in this format (include the --BEGIN RESULT--, --END RESULT--, \`\`\`json and \`\`\` tags):
--BEGIN RESULT--
\`\`\`json
{
    "combination": "[The combination]",
    "emoji": "[Appropriate emoji]"
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
        const resultPattern = /--BEGIN RESULT--\s*```json\s*([\s\S]*?)\s*```\s*--END RESULT--/m;
        const match = completion.choices[0].message.content?.match(resultPattern);

        if (match && match[1]) {
            const jsonContent = match[1].trim();
            try {
                const result = JSON.parse(jsonContent);
                return new Word(result.combination, result.emoji);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                // Here, it might be helpful to log the jsonContent to see what's failing
                return undefined;
            }
        } else {
            console.log(`No valid result found. Content: ${completion.choices[0].message.content}`);
            return undefined;
        }
    }
}