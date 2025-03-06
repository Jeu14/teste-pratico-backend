import vine from '@vinejs/vine'

const PurchaseValidator = vine.object({
  clientName: vine.string().minLength(3),
  clientEmail: vine.string().email(),
  products: vine
    .array(
      vine.object({
        id: vine.number(),
        quantity: vine.number().min(1),
      })
    )
    .minLength(1),
  cardNumber: vine.string().regex(/^\d{16}$/),
  cvv: vine.string().regex(/^\d{3}$/),
})

export default PurchaseValidator
