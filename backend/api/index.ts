import express, { Express, Request, Response } from "express";
import {MemoryWordRepository} from "../src/word/repository/adapters/memory_repository";
import {GptWordRepository} from "../src/word/repository/adapters/gpt_repository";
import {StoringAndSecondaryWordService} from "../src/word/service/adapters/StoringAndSecondaryWordService";
import {Word} from "../src/word/model/word_model";
import cors from "cors";
import { config } from "dotenv";
import {WordService} from "../src/word/service/word_service";
import {PostgresWordRepository} from "../src/word/repository/adapters/postgres_repository";
import {Client} from "pg";

config();


const app: Express = express();
const port: number = 3000;

async function getWordService(): Promise<WordService> {
const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
        return new StoringAndSecondaryWordService(new PostgresWordRepository(dbUrl), new GptWordRepository());
    } else {
        return new StoringAndSecondaryWordService(new MemoryWordRepository(), new GptWordRepository());
    }

}
let wordService: WordService;

app.use(cors<Request>());

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/words/initial", async (req: Request, res: Response) => {
    res.send(
        JSON.stringify([
            await wordService.getWordByString("Fire"),
            await wordService.getWordByString("Water"),
            await wordService.getWordByString("Earth"),
            await wordService.getWordByString("Air")
        ])
    );
});

app.get("/words/combine", async (req: Request, res: Response) => {
    // Get query params of wordString1, wordString2

    const wordId1: string = req.query.word1 as string;
    const wordId2: string = req.query.word2 as string;

    if (!wordId1 || !wordId2) {
        res.status(400).send("Missing query params wordId1 or wordId2");
        return;
    }

    // Combine the words
    let word1: Word | null = await wordService.getWordById(wordId1);
    let word2: Word | null = await wordService.getWordById(wordId2);

    if (word1 == undefined || word2 == undefined) {
        res.status(404).send("Word not found");
        return;
    }

    let result: Word | null = await wordService.combineWords(word1, word2);

    if (result == null) {
        res.status(500).send("Error combining words");
        return;
    }

    res.send(JSON.stringify(result));
});

async function initializeWords() {
    await wordService.addWord(new Word("Fire", "🔥", 1));
    await wordService.addWord(new Word("Water", "💧", 2));
    await wordService.addWord(new Word("Earth", "🌍", 3));
    await wordService.addWord(new Word("Air", "💨", 4));
}

// Modify this part to wait for initialization before listening
async function startServer() {
    wordService = await getWordService(); // Wait for the service to be created
    await initializeWords(); // Wait for the initialization to complete
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
}

startServer(); // Start the server after initialization

export default app;