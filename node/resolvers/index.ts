import { bindingInfo } from './bindingInfo'
import { saveBindingInfo } from './saveBindingInfo'
import { updateSalesChannel } from './orderForm'
import { toggleSalesChannel } from './toggleSalesChannel'
import { salesChannel } from './salesChannel'

export const mutations = {
  updateSalesChannel,
  saveBindingInfo,
  toggleSalesChannel,
}

export const queries = {
  bindingInfo,
  salesChannel,
}
