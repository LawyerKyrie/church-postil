// English Index Page
export default defineEventHandler(() => {
  const enSermons = [

    { id: 1011, postil: 'Advent', tags: 'Epistle', label: '1.Sun. Advent', bible: 'Rom 13: 11-14', value: '/en/advent#first-sunday-in-advent-romans-13-11-14' },
    { id: 1012, postil: 'Advent', tags: 'Gospel', label: '1.Sun. Advent', bible: 'Matt 21: 1-9', value: '/en/advent#first-sunday-in-advent-matthew-21-1-9' },
    { id: 1021, postil: 'Advent', tags: 'Epistle', label: '2.Sun. Advent', bible: 'Rom 15: 4-13', value: '/en/advent#second-sunday-in-advent-romans-15-4-13' },
    { id: 1022, postil: 'Advent', tags: 'Gospel', label: '2.Sun. Advent', bible: 'Luk 21: 25-36', value: '/en/advent#second-sunday-in-advent-luke-21-25-36' },
    { id: 1031, postil: 'Advent', tags: 'Epistle', label: '3.Sun. Advent', bible: '1 Cor 4: 1-5', value: '/en/advent#third-sunday-in-advent-1-corinthians-4-1-5' },
    { id: 1032, postil: 'Advent', tags: 'Gospel', label: '3.Sun. Advent', bible: 'Matt 11: 2-10', value: '/en/advent#third-sunday-in-advent-matthew-11-2-10' },
    { id: 1041, postil: 'Advent', tags: 'Epistle', label: '4.Sun. Advent', bible: 'Phil 4: 4-7', value: '/en/advent#fourth-sunday-in-advent-philippians-4-4-7' },
    { id: 1042, postil: 'Advent', tags: 'Gospel', label: '4.Sun. Advent', bible: 'Joh 1: 19-28', value: '/en/advent#fourth-sunday-in-advent-john-1-19-28' }

  ]

  console.log('Api call from api/en/ssrapitest2.ts - enSermons = ', enSermons)

  return enSermons
})
