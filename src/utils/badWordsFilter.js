import badWordsData from "@/utils/bannedWords.json"

export const findBadWords = (text) =>
  badWordsData.RECORDS.reduce((acc, wordData) => {
    if (text.includes(wordData.word)) {
      acc.push(wordData.word)
    }

    return acc
  }, [])
