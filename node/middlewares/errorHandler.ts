export async function errorHandler(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: { logger },
  } = ctx

  try {
    await next()
  } catch (error) {
    logger.error({
      message: 'Viewer country could not be retrieved',
      error,
    })

    ctx.status = 404
    ctx.body = 'Viewer country could not be retreived'
    ctx.app.emit('error', error, ctx)
  }
}
