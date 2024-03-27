import express, { Express, Request, Response } from "express";
import { MemoryWordRepository } from "./word/repository/adapters/memory_repository";
import { GptWordRepository } from "./word/repository/adapters/gpt_repository";
import {StoringAndSecondaryWordService} from "./word/service/adapters/StoringAndSecondaryWordService";
import {Word} from "./word/model/word_model";
import cors from "cors";



const app: Express = express();
const port: number = 3000;
const wordService = new StoringAndSecondaryWordService( new MemoryWordRepository(), new GptWordRepository() );

app.use(cors<Request>());

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
    const wordString1: string = req.query.word1 as string;
    const wordString2: string = req.query.word2 as string;

    if (!wordString1 || !wordString2) {
        res.status(400).send("Missing query params wordString1 or wordString2");
        return;
    }

    // Combine the words
    let word1: Word | null = await wordService.getWordByString(wordString1);
    let word2: Word | null = await wordService.getWordByString(wordString2);

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

app.listen(port, async () => {
    await wordService.addWord(new Word("Fire", "🔥"))
    await wordService.addWord(new Word("Water", "💧"))
    await wordService.addWord(new Word("Earth", "🌍"))
    await wordService.addWord(new Word("Air", "💨"))
    console.log(`[server]: Server is running at http://localhost:${port}`);
});