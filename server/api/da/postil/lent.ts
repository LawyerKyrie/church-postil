// List of sermons in Luther's Church Postil
const postil3 = [
  // { label: '1. VinterPostil', type: 'label' },

  { id: 411, postil: 'Vinter', tag: 'Epistel', label: '1. Søndag', bible: 'Rom 12: 1-6', value: '/da/lent/epiphany-epistle01' },
  { id: 412, postil: 'Vinter', tag: 'Evangelium', label: '1. Søndag', bible: 'Luk 2: 42-52', value: '/da/lent/epiphany-gospel01' },
  { id: 421, postil: 'Vinter', tag: 'Epistel', label: '2. Søndag', bible: 'Rom 12: 6-16', value: '/da/lent/epiphany-epistle02' },
  { id: 422, postil: 'Vinter', tag: 'Evangelium', label: '2. Søndag', bible: 'Joh 2: 1-11', value: '/da/lent/epiphany-gospel02' },
  { id: 431, postil: 'Vinter', tag: 'Epistel', label: '3. Søndag', bible: 'Rom 12: 16-21', value: '/da/lent/epiphany-epistle03' },
  { id: 432, postil: 'Vinter', tag: 'Evangelium', label: '3. Søndag', bible: 'Matt 8: 1-13', value: '/da/lent/epiphany-gospel03' },
  { id: 441, postil: 'Vinter', tag: 'Epistel', label: '4. Søndag', bible: 'Rom 13: 8-10', value: '/da/lent/epiphany-epistle04' },
  { id: 442, postil: 'Vinter', tag: 'Evangelium', label: '4. Søndag', bible: 'Matt 8: 23-27', value: '/da/lent/epiphany-gospel04' },
  { id: 411, postil: 'Vinter', tag: 'Epistel', label: '5. Søndag', bible: 'Kol 3: 12-17', value: '/da/lent/epiphany-epistle05' },
  { id: 412, postil: 'Vinter', tag: 'Evangelium', label: '5. Søndag', bible: 'Matt 13: 24-30', value: '/da/lent/epiphany-gospel05' },
  { id: 421, postil: 'Vinter', tag: 'Epistel', label: 'Septuagesima søn.', bible: '1 Kor 9: 24-10, 5', value: '/da/lent/septuagesima-epistle' },
  { id: 422, postil: 'Vinter', tag: 'Evangelium', label: 'Septuagesima søn.', bible: 'Matt 20: 1-16', value: '/da/lent/septuagesima-gospel' },
  { id: 431, postil: 'Vinter', tag: 'Epistel', label: 'Seksagesima søn.', bible: '2 Kor 11: 19-12, 9', value: '/da/lent/sexagesima-epistle' },
  { id: 432, postil: 'Vinter', tag: 'Evangelium', label: 'Seksagesima søn.', bible: 'Luk 8: 5-15', value: '/da/lent/sexagesima-gospel' },
  { id: 441, postil: 'Vinter', tag: 'Epistel', label: 'Fastelavens søn', bible: '1 Kor 13: 1-13', value: '/da/lent/fastelavens-sondag-epistle' },
  { id: 442, postil: 'Vinter', tag: 'Evangelium', label: 'Fastelavens søn.', bible: 'Luk 18, 31-43', value: '/da/lent/fastelavens-sondag-gospel' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil3
})
