interface TranslatedInfoArray {
  id: string
  label: string
  canonicalBaseAddress: string
  defaultLocale: string
}

interface ResultResponse {
  chosenId: string
  resolverResponse: [TranslatedInfoArray]
}

export default function saveTranslatedInfo(
  _: any,
  {
    chosenId,
    translatedLocales,
  }: {
    chosenId: string
    translatedLocales: any[]
  },
  ctx: Context
) {

  return ctx.clients.vbase
    .getJSON('account.binding', 'configs')
    .then((data: any) => {
      const newData = {
        chosenId,
        translatedLocales,
      }

      let dataToSave : ResultResponse[]
      let resolverResponse
      if (data.dataToSave.length) {
        const filteredFromChosenId = data.dataToSave.filter(
          (item: { chosenId: string }) => item.chosenId !== chosenId
        )

        filteredFromChosenId.push(newData)
        dataToSave = filteredFromChosenId
      } else {
        const bindingsInfo = [] as ResultResponse[]

        data.dataToSave.push(newData)
        dataToSave = bindingsInfo
      }

      ctx.clients.vbase
        .saveJSON('account.binding', 'configs', { dataToSave })
        .then((_: any) => {
          resolverResponse = dataToSave
        })
        .catch((err: any) => {
          resolverResponse = {
            errorMessage: 'Error in saving data',
            error: err
          }
        })
        return resolverResponse
    })
    .catch((err: any) => {
      const resolverResponse = {
        errorMessage: 'Error in saving data',
        error: err
      }
      return resolverResponse
    })
}
