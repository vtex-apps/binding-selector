import { CLOUDFRONT_VIEWER_COUNTRY, VTEX_IO_VIEWER_COUNTRY } from '../constants'

export async function viewerCountry(ctx: Context) {
  const {
    request: { header },
  } = ctx

  const countryCode =
    header[CLOUDFRONT_VIEWER_COUNTRY] || header[VTEX_IO_VIEWER_COUNTRY] || null

  ctx.body = countryCode
}
