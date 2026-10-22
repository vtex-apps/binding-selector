import { requireAdminSession } from '../middlewares/requireAdminSession'

export const saveBindingInfo = async (
  _: unknown,
  args: {
    data: [TranslatedBinding]
  },
  ctx: Context
) => {
  await requireAdminSession(ctx)

  const { clients } = ctx
  const { data } = args
  const { vbase } = clients

  await vbase.saveJSON('account.binding', 'configs', {
    data,
  })

  return data
}
