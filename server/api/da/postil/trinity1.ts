// List of sermons in Luther's Church Postil
const postil5 = [
  // { label: '1. Trinity IPostil', type: 'label' },

  { id: 2011, postil: 'Trinity I', tag: 'Epistel', label: '1. Søndag', bible: 'Rom 11: 33-36', value: '/da/trinity1/epistle01' },
  { id: 2012, postil: 'Trinity I', tag: 'Evangelium', label: '1. Søndag', bible: 'Luk 16: 19-31', value: '/da/trinity1/gospel01' },
  { id: 2021, postil: 'Trinity I', tag: 'Epistel', label: '2. Søndag', bible: '1 Joh 3: 13-18', value: '/da/trinity1/epistle2' },
  { id: 2022, postil: 'Trinity I', tag: 'Evangelium', label: '2. Søndag', bible: 'Luk 14: 16-24', value: '/da/trinity1/gospel02' },
  { id: 2031, postil: 'Trinity I', tag: 'Epistel', label: '3. Søndag', bible: '1 Pet 5: 5-11', value: '/da/trinity1/epistle03' },
  { id: 2032, postil: 'Trinity I', tag: 'Evangelium', label: '3. Søndag', bible: 'Luk 15: 1-10', value: '/da/trinity1/gospel03' },
  { id: 2041, postil: 'Trinity I', tag: 'Epistel', label: '4. Søndag', bible: 'Rom 8: 18-22', value: '/da/trinity1/epistle04' },
  { id: 2042, postil: 'Trinity I', tag: 'Evangelium', label: '4. Søndag', bible: 'Luk 6: 36-42', value: '/da/trinity1/gospel04' },
  { id: 2051, postil: 'Trinity I', tag: 'Epistel', label: '5. Søndag', bible: '1 Pet 3: 8-15', value: '/da/trinity1/epistle05' },
  { id: 2052, postil: 'Trinity I', tag: 'Evangelium', label: '5. Søndag', bible: 'Luk 5: 1-11', value: '/da/trinity1/gospel05' },
  { id: 2061, postil: 'Trinity I', tag: 'Epistel', label: '6. Søndag', bible: 'Rom 6: 3-11', value: '/da/trinity1/epistle06' },
  { id: 2062, postil: 'Trinity I', tag: 'Evangelium', label: '6. Søndag', bible: 'Matt 5: 20-26', value: '/da/trinity1/gospel06' },
  { id: 2071, postil: 'Trinity I', tag: 'Epistel', label: '7. Søndag', bible: 'Rom 6: 19-23', value: '/da/trinity1/epistle07' },
  { id: 2072, postil: 'Trinity I', tag: 'Evangelium', label: '7. Søndag', bible: 'Mark 8: 1-9', value: '/da/trinity1/gospel07' },
  { id: 2081, postil: 'Trinity I', tag: 'Epistel', label: '8. Søndag', bible: 'Rom 8: 12-17', value: '/da/trinity1/epistle08' },
  { id: 2082, postil: 'Trinity I', tag: 'Evangelium', label: '8. Søndag', bible: 'Matt 7: 15-23', value: '/da/trinity1/gospel08' },
  { id: 2091, postil: 'Trinity I', tag: 'Epistel', label: '9. Søndag', bible: '1 Kor 10: 6-13', value: '/da/trinity1/epistle09' },
  { id: 2092, postil: 'Trinity I', tag: 'Evangelium', label: '9. Søndag', bible: 'Luk 16: 1-9', value: '/da/trinity1/gospel09' },
  { id: 2101, postil: 'Trinity I', tag: 'Epistel', label: '10. Søndag', bible: '1 Kor 12: 1-11', value: '/da/trinity1/epistle10' },
  { id: 2102, postil: 'Trinity I', tag: 'Evangelium', label: '10. Søndag', bible: 'Luk 19: 41-48', value: '/da/trinity1/gospel10' },
  { id: 2111, postil: 'Trinity I', tag: 'Epistel', label: '11. Søndag', bible: '1 Kor 15: 1-10', value: '/da/trinity1/epistle111' },
  { id: 2112, postil: 'Trinity I', tag: 'Evangelium', label: '11. Søndag', bible: 'Luk 18: 9-14', value: '/da/trinity1/gospel1' },
  { id: 2121, postil: 'Trinity I', tag: 'Epistel', label: '12. Søndag', bible: '2 Kor 3: 4-11', value: '/da/trinity1/epistle12' },
  { id: 2122, postil: 'Trinity I', tag: 'Evangelium', label: '12. Søndag', bible: 'Mark 7: 31-37', value: '/da/trinity1/gospel12' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return postil5
})

// All bible book references need be like the one in Mdc/TableComponent.vue
