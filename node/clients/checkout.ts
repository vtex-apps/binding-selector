import type {
  InstanceOptions,
  IOContext,
  RequestConfig,
  SegmentData,
} from '@vtex/api'
import { JanusClient } from '@vtex/api'
import type { OrderForm as CheckoutOrderForm } from 'vtex.checkout-graphql'

import { checkoutCookieFormat, statusToError } from '../utils'

interface CustomIOContext extends IOContext {
  segment?: SegmentData
  orderFormId: string
}

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
    salesChannel: string,
    clientPreferencesData: CheckoutOrderForm['clientPreferencesData']
  ) => {
    const { orderFormId } = (this.context as unknown) as CustomIOContext

    this.post<CheckoutOrderForm, CheckoutOrderForm['clientPreferencesData']>(
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
      ...this.getCommonHeaders(),
    }
    try {
      return this.http.post<T>(url, data, config)
    } catch (e) {
      return statusToError(e) as unknown
    }
  }

  private getCommonHeaders = () => {
    const { orderFormId } = (this.context as unknown) as CustomIOContext
    const checkoutCookie = orderFormId ? checkoutCookieFormat(orderFormId) : ''

    return {
      Cookie: `${checkoutCookie}vtex_segment=${this.context.segmentToken};vtex_session=${this.context.sessionToken};`,
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
