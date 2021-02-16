export default function translatedInfo(_: any, __: any, ctx: Context) {
    return ctx.clients.vbase
      .getJSON('account.binding', 'configs')
      .then((data: any) => {
        console.log('data', data.dataToSave)
        return data.dataToSave
      })
      .catch(err => console.log(err))
  }