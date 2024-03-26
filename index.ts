import express, { Express, Request, Response } from "express";
import { MemoryWordRepository } from "./src/word/repository/adapters/memory_repository";
import { GptWordRepository } from "./src/word/repository/adapters/gpt_repository";
import {StoringAndSecondaryWordService} from "./src/word/service/adapters/StoringAndSecondaryWordService";
import {Word} from "./src/word/model/word_model";



const app: Express = express();
const port: number = 3000;
const wordService = new StoringAndSecondaryWordService( new MemoryWordRepository(), new GptWordRepository() );

app.get("/combine", async (req: Request, res: Response) => {
    // Get query params of wordString1, wordString2
    const wordString1: string = req.query.word1 as string;
    const wordString2: string = req.query.word2 as string;

    if (!wordString1 || !wordString2) {
        res.status(400).send("Missing query params wordString1 or wordString2");
        return;
    }

    // Combine the words
    let word1: Word | undefined = await wordService.getWordByString(wordString1);
    let word2: Word | undefined = await wordService.getWordByString(wordString2);

    if (word1 == undefined || word2 == undefined) {
        res.status(404).send("Word not found");
        return;
    }

    let result: Word | undefined = await wordService.combineWords(word1, word2);

    if (result == undefined) {
        res.status(500).send("Error combining words");
        return;
    }

    res.send(result.word);
});

app.listen(port, async () => {
    wordService.addWord(
        new Word("Fire", "🔥")
    )
    wordService.addWord(
        new Word("Water", "💧")
    )
    wordService.addWord(
        new Word("Earth", "🌍")
    )
    wordService.addWord(
        new Word("Air", "💨")
    )
    console.log(`[server]: Server is running at http://localhost:${port}`);
});