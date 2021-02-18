import { bindingInfo } from './bindingInfo'
import { saveBindingInfo } from './saveBindingInfo'
import { updateSalesChannel } from './orderForm'

export const mutations = {
  updateSalesChannel,
  saveBindingInfo,
}

export const queries = {
  bindingInfo,
}
