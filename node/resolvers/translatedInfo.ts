export default function token(_: any, __: any, ctx: Context) {
    return ctx.clients.vbase
      .getJSON('account.binding', 'configs')
      .then((data: any) => data.dataToSave)
  }