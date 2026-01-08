// List of sermons in Luther's Church Postil
const sermons1 = [
  // { label: '1. AdventPostil', type: 'label' },

  { id: 101, postil: 'Advent', tag: 'Epistel', label: '1. Søndag', bible: 'Rom 13: 11-14', value: '/en/advent/epistle1' },
  { id: 102, postil: 'Advent', tag: 'Evangelium', label: '1. Søndag', bible: 'Matt 21: 1-9', value: '/en/advent/gospel1' },
  { id: 201, postil: 'Advent', tag: 'Epistel', label: '2. Søndag', bible: 'Rom 15: 4-13', value: '/en/advent/epistle2' },
  { id: 202, postil: 'Advent', tag: 'Evangelium', label: '2. Søndag', bible: 'Luke 21: 25-36', value: '/en/advent/gospel2' },
  { id: 301, postil: 'Advent', tag: 'Epistel', label: '3. Søndag', bible: '1 Cor 4: 1-5', value: '/en/advent/epistle3' },
  { id: 302, postil: 'Advent', tag: 'Evangelium', label: '3. Søndag', bible: 'Matt 11: 2-10', value: '/en/advent/gospel3' },
  { id: 401, postil: 'Advent', tag: 'Epistel', label: '4. Søndag', bible: 'Phil 4: 4-7', value: '/en/advent/epistle4' },
  { id: 402, postil: 'Advent', tag: 'Evangelium', label: '4. Søndag', bible: 'John 1: 19-28', value: '/en/advent/gospel4' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return sermons1
})
