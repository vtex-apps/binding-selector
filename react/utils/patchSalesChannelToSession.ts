export const patchSalesChannelToSession = (salesChannel: string): void => {
  fetch('/api/sessions', {
    method: 'POST',
    body: JSON.stringify({
      public: {
        sc: salesChannel,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
