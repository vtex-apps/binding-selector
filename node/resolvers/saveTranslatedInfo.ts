interface TranslatedInfoArray {
  id: string
  label: string
  canonicalBaseAddress: string
  defaultLocale: string
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
      console.log('data', data)

      const newData = {
        chosenId,
        translatedLocales,
      }

      let dataToSave

      if (data.dataToSave.length) {
        const filteredFromChosenId = data.dataToSave.filter(
          (item: { chosenId: string }) => item.chosenId !== chosenId
        )

        filteredFromChosenId.push(newData)
        dataToSave = filteredFromChosenId
      } else {
        const bindingsInfo = [] as TranslatedInfoArray[]

        data.dataToSave.push(newData)
        dataToSave = bindingsInfo
      }

      ctx.clients.vbase
        .saveJSON('account.binding', 'configs', { dataToSave })
        .then((_: any) => {
          console.log('success', _)

          return 'success'
        })
        .catch((err: any) => {
          console.log(err)

          return 'fail'
        })
    })
    .catch((err: any) => {
      console.log('fail', err)

      return 'fail'
    })
}
