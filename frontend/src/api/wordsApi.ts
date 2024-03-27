import axios from 'axios';
import { WordDTO } from "../props/Word";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

export async function fetchInitialWords(): Promise<WordDTO[]> {
    let response = await axios.get(`${baseUrl}/words/initial`)
    return response.data.map(
        (wordData: WordDTO) => ({
            word: wordData.word,
            emoji: wordData.emoji,
            id: wordData.id,
            isNew: false
        })
    )
}

export async function combineWords(word1: string, word2: string): Promise<WordDTO> {
    let response = await axios.get(`${baseUrl}/words/combine?word1=${word1}&word2=${word2}`)
    return {
        word: response.data.word,
        emoji: response.data.emoji,
        id: response.data.id,
        isNew: false
    }
}