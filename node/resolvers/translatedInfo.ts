export default function translatedInfo(_: any, __: any, ctx: Context) {
    return ctx.clients.vbase
      .getJSON('account.binding', 'configs')
      .then((data: any) => {
        return data.dataToSave
      })
      .catch(err => {
        const resolverResponse = {
          errorMessage: 'Error in saving data',
          error: err
        }
        return resolverResponse
      })
  }