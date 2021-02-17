import { translatedInfo } from './translatedInfo'
import { saveTranslatedInfo } from './saveTranslatedInfo'
import { updateSalesChannel } from './orderForm'

export const mutations = {
  updateSalesChannel,
  saveTranslatedInfo,
}

export const queries = {
  translatedInfo,
}
