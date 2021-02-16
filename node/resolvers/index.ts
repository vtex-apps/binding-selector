import token from './token'
import saveToken from './saveToken'
import translatedInfo from './translatedInfo'
import saveTranslatedInfo from './saveTranslatedInfo'

export const mutations = {
  saveToken,
  saveTranslatedInfo,
}

export const queries = {
  token,
  translatedInfo,
}
