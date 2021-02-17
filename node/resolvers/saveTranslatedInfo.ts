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
      console.log('here 1')
      let dataToSave: ResultResponse[]
      // let resolverResponse

      if (data.dataToSave.length) {
        console.log('here')
        const filteredFromChosenId = data.dataToSave.filter(
          (item: { chosenId: string }) => item.chosenId !== chosenId
        )

        filteredFromChosenId.push(newData)
        dataToSave = filteredFromChosenId

      } else {
        console.log('hero')
        const bindingsInfo = [] as ResultResponse[]

        data.dataToSave.push(newData)
        dataToSave = bindingsInfo
      }

      ctx.clients.vbase
        .saveJSON('account.binding', 'configs', { dataToSave })
        .then(() => {
          // resolverResponse = data
          return 'string'
          // return resolverResponse
        })
        .catch((err: any) => {
          return err
        })

      return 'success'
    })
    .catch((err: any) => {
      return err
    })
}
