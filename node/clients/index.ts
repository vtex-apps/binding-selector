import { IOClients } from '@vtex/api'

import { Checkout } from './checkout'
import { Sphinx } from './sphinx'
import { VtexId } from './vtexId'

export class Clients extends IOClients {
  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }

  public get sphinx() {
    return this.getOrSet('sphinx', Sphinx)
  }
}
