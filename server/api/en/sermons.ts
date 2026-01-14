// English Index Page
const enSermons = [
  // { label: '1. Postil - Advent to Christmas', type: 'label' },

  { id: 11, postil: 'Advent', tag: 'Epistle', label: '1. Sun. Advent', bible: 'Rom 13: 11-14', value: '/en/advent#first-sunday-in-advent-romans-13-11-14' },
  { id: 12, postil: 'Advent', tag: 'Gospel', label: '1. Sun. Advent', bible: 'Matt 21: 1-9', value: '/en/advent#first-sunday-in-advent-matthew-21-1-9' },
  { id: 21, postil: 'Advent', tag: 'Epistle', label: '2. Sun. Advent', bible: 'Rom 15: 4-13', value: '/en/advent#second-sunday-in-advent-romans-15-4-13' },
  { id: 22, postil: 'Advent', tag: 'Gospel', label: '2. Sun. Advent', bible: 'Luke 21: 25-36', value: '/en/advent#second-sunday-in-advent-luke-21-25-36' },
  { id: 31, postil: 'Advent', tag: 'Epistle', label: '3. Sun. Advent', bible: '1 Cor 4: 1-5', value: '/en/advent#third-sunday-in-advent-1-corinthians-4-1-5' },
  { id: 32, postil: 'Advent', tag: 'Gospel', label: '3. Sun. Advent', bible: 'Matt 11: 2-10', value: '/en/advent#third-sunday-in-advent-matthew-11-2-10' },
  { id: 41, postil: 'Advent', tag: 'Epistle', label: '4. Sun. Advent', bible: 'Phil 4: 4-7', value: '/en/advent#fourth-sunday-in-advent-philippians-4-4-7' },
  { id: 42, postil: 'Advent', tag: 'Gospel', label: '4. Sun. Advent', bible: 'Joh 1: 19-28', value: '/en/advent#fourth-sunday-in-advent-john-1-19-28' },

  // { label: '2. Postil - Christmas to Epiphany', type: 'label' },

  { id: 241, postil: 'Christmas', tag: 'Epistle', label: 'Christmas Day', bible: 'Tit 2: 11-15', value: '/en/christmas#christmas-day-titus-2-11-15' },
  { id: 242, postil: 'Christmas', tag: 'Gospel', label: 'Christmas Day', bible: 'Luk 2: 1-14', value: '/en/christmas#early-christmas-service-luke-2-1-14' },
  { id: 251, postil: 'Christmas', tag: 'Epistle', label: 'Early Xmas', bible: 'Tit 3: 4-7', value: '/en/christmas#early-christmas-service-titus-3-4-7' },
  { id: 252, postil: 'Christmas', tag: 'Gospel', label: 'Early Xmas', bible: 'Luk 2: 15-20', value: '/en/christmas#early-christmas-service-luke-2-15-20' },
  { id: 253, postil: 'Christmas', tag: 'Epistle', label: 'Xmas Morning', bible: 'Heb 1: 1-12', value: '/en/christmas#christmas-morning-service-hebrews-1-1-12' },
  { id: 254, postil: 'Christmas', tag: 'Gospel', label: 'Principal Xmas', bible: 'Joh 1: 1-14', value: '/en/christmas#principal-christmas-service-john-1-1-14' },
  { id: 261, postil: 'Christmas', tag: 'Epistle', label: 'St. Steph.\'s Day', bible: 'Acts 6: 8-14 & 7:54-60', value: '/en/christmas#st-stephens-day-acts-6-8-14-7-54-60' },
  { id: 262, postil: 'Christmas', tag: 'Gospel', label: 'St. Steph.\'s Day', bible: 'Matt 23: 34-39', value: '/en/christmas#st-stephens-day-matthew-23-34-39' },
  { id: 271, postil: 'Christmas', tag: 'Epistle', label: 'Day of St. John', bible: 'Ecclus 15: 1-8', value: '/en/christmas#day-of-st-john-ecclesiasticus-15-1-8' },
  { id: 272, postil: 'Christmas', tag: 'Gospel', label: 'Day of St. John', bible: 'Joh 21: 19-24', value: '/en/christmas#day-of-st-john-john-21-19-24' },
  { id: 291, postil: 'Christmas', tag: 'Epistle', label: 'Sunday after Xmas', bible: 'Gal 4: 1-7', value: '/en/christmas#sunday-after-christmas-galatians-4-1-7' },
  { id: 292, postil: 'Christmas', tag: 'Gospel', label: 'Sunday after Xmas', bible: 'Luk 2: 33-40', value: '/en/christmas#sunday-after-christmas-luke-2-33-40' },
  { id: 321, postil: 'Christmas', tag: 'Epistle', label: 'New Year\'s Day', bible: 'Gal 3: 23-29', value: '/en/christmas#new-years-day-galatians-3-23-29' },
  { id: 331, postil: 'Christmas', tag: 'Epistle', label: 'Epiphany (1/2)', bible: 'Isaiah 60: 1-6', value: '/en/christmas#epiphany-isaiah-60-1-6' },
  { id: 332, postil: 'Christmas', tag: 'Gospel', label: 'Epiphany (2/2)', bible: 'Matt 2: 1-12', value: '/en/christmas#epiphany-matthew-2-1-12' },

  // { label: 'VinterPostil', type: 'label' },

  { id: 411, postil: 'Winter', tag: 'All', label: 'Winter Postil', bible: 'Epiphany - Holy Week', value: '/en/lent' },

  // { label: 'SommerPostil', type: 'label' },
  { id: 1011, postil: 'Easter', tag: 'All', label: 'Summer Postil', bible: 'Easter - Pentecost', value: '/en/easter' },

  // { label: 'Trinity I', type: 'label' },
  { id: 2011, postil: 'Trinity I', tag: 'All', label: 'Trinity I Postil', bible: '1. - 12.Sunday in Trinity', value: '/en/trinity1' },

  // { label: 'Trinity II', type: 'label' },
  { id: 2131, postil: 'Trinity II', tag: 'All', label: 'Trinity II Postil', bible: '13. - 26.Sunday in Trinity', value: '/en/trinity2' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return enSermons
})
