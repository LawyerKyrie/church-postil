// List of sermons in Luther's Church Postil
const postil3 = [
  // { label: '1. VinterPostil', type: 'label' },

  { id: 411, postil: 'Vinter', tag: 'Epistel', label: '1. Søndag', bible: 'Rom 13: 11-14', value: '/da/lent/epiphany-epistle01' },
  { id: 412, postil: 'Vinter', tag: 'Evangelium', label: '1. Søndag', bible: 'Matt 21: 1-9', value: '/da/lent/epiphany-gospel01' },
  { id: 421, postil: 'Vinter', tag: 'Epistel', label: '2. Søndag', bible: 'Rom 15: 4-13', value: '/da/lent/epiphany-epistle02' },
  { id: 422, postil: 'Vinter', tag: 'Evangelium', label: '2. Søndag', bible: 'Luke 21: 25-36', value: '/da/lent/epiphany-gospel02' },
  { id: 431, postil: 'Vinter', tag: 'Epistel', label: '3. Søndag', bible: '1 Cor 4: 1-5', value: '/da/lent/epiphany-epistle03' },
  { id: 432, postil: 'Vinter', tag: 'Evangelium', label: '3. Søndag', bible: 'Matt 11: 2-10', value: '/da/lent/epiphany-gospel03' },
  { id: 441, postil: 'Vinter', tag: 'Epistel', label: '4. Søndag', bible: 'Phil 4: 4-7', value: '/da/lent/epiphany-epistle04' },
  { id: 442, postil: 'Vinter', tag: 'Evangelium', label: '4. Søndag', bible: 'John 1: 19-28', value: '/da/lent/epiphany-gospel04' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil3
})
