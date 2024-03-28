import axios from 'axios';
import { WordDTO } from "../props/Word";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

export async function fetchInitialWords(): Promise<WordDTO[]> {
    let response = await axios.get(`${baseUrl}/words/initial`)
    return response.data.map(
        (wordData: {word: string, emoji: string, id: number}) => ({
            word: wordData.word,
            emoji: wordData.emoji,
            wordId: wordData.id,
            isNew: false
        })
    )
}

export async function combineWords(word1: number, word2: number): Promise<WordDTO> {
    let response = await axios.get(`${baseUrl}/words/combine?word1=${word1}&word2=${word2}`)
    return {
        word: response.data.word,
        emoji: response.data.emoji,
        wordId: response.data.id,
        isNew: false
    }
}