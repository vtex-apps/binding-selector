import type { InstanceOptions, IOContext, RequestConfig } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'

import { statusToError } from '../utils'

export class Checkout extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        ...(ctx.storeUserAuthToken
          ? { VtexIdclientAutCookie: ctx.storeUserAuthToken }
          : null),
      },
    })
  }

  public updateSalesChannel = (
    orderFormId: string,
    salesChannel: string,
    clientPreferencesData: CheckoutOrderForm['clientPreferencesData']
  ) => {
    return this.post<
      CheckoutOrderForm,
      CheckoutOrderForm['clientPreferencesData']
    >(
      this.routes.updateSalesChannel(orderFormId, salesChannel),
      {
        ...clientPreferencesData,
      },
      {
        metric: 'checkout-updateSalesChannel',
      }
    )
  }

  protected post = async <T, D>(
    url: string,
    data?: D,
    config: RequestConfig = {}
  ) => {
    config.headers = {
      ...config.headers,
    }
    try {
      return this.http.post<T>(url, data, config)
    } catch (e) {
      return (statusToError(e) as unknown) as CheckoutOrderForm
    }
  }

  private get routes() {
    const base = '/api/checkout/pub'

    return {
      updateSalesChannel: (orderFormId: string, salesChannel: string) =>
        `${base}/orderForm/${orderFormId}/attachments/clientPreferencesData?sc=${salesChannel}`,
    }
  }
}
