import { NotFoundError } from '@vtex/api'

export async function viewerCountry(ctx: Context) {
  const {
    request: { header },
  } = ctx

  try {
    const countryCode = header['cloudfront-viewer-country']

    ctx.body = countryCode
  } catch {
    throw new NotFoundError('Viewer country could not be found')
  }
}
