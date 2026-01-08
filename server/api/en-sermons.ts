// English Index Page
const sermons = [
  // { label: '1. Postil - Advent to Christmas', type: 'label' },

  { label: '1. Sun. in Advent - Rom 13: 11-14', value: '/en/advent#first-sunday-in-advent-romans-13-11-14' },
  { label: '1. Sun. in Advent - Matt 21: 1-9', value: '/en/advent#first-sunday-in-advent-matthew-21-1-9' },
  { label: '2. Sun. in Advent - Rom 15: 4-13', value: '/en/advent#second-sunday-in-advent-romans-15-4-13' },
  { label: '2. Sun. in Advent - Luke 21: 25-36', value: '/en/advent#second-sunday-in-advent-luke-21-25-36' },
  { label: '3. Sun. in Advent - 1 Cor 4: 1-5', value: '/en/advent#third-sunday-in-advent-1-corinthians-4-1-5' },
  { label: '3. Sun. in Advent - Matt 11: 2-10', value: '/en/advent#third-sunday-in-advent-matthew-11-2-10' },
  { label: '4. Sun. in Advent - Phil 4: 4-7', value: '/en/advent#fourth-sunday-in-advent-philippians-4-4-7' },
  { label: '4. Sun. in Advent - John 1: 19-28', value: '/en/advent#fourth-sunday-in-advent-john-1-19-28' },

  // { label: '2. Postil - Christmas to Epiphany', type: 'label' },

  { label: 'Christmas Day - Titus 2: 11-15', value: '/en/christmas#christmas-day-titus-2-11-15' },
  { label: 'Christmas Day - Luke 2: 1-14', value: '/en/christmas#early-christmas-service-luke-2-1-14' },
  { label: 'Early Xmas Serv - Tit 3: 4-7', value: '/en/christmas#early-christmas-service-titus-3-4-7' },
  { label: 'Early Xmas Serv - Luk 2: 15-20', value: '/en/christmas#early-christmas-service-luke-2-15-20' },
  { label: 'Xmas Morning Serv. - Heb 1: 1-12', value: '/en/christmas#christmas-morning-service-hebrews-1-1-12' },
  { label: 'Principal Xmas Serv. - Joh 1: 1-14', value: '/en/christmas#principal-christmas-service-john-1-1-14' },
  { label: 'St. Stephens\'s Day - Acts 6: 8-14 & 7:54-60', value: '/en/christmas#st-stephens-day-acts-6-8-14-7-54-60' },
  { label: 'St. Steph.\'s Day - Matt 23: 34-39', value: '/en/christmas#st-stephens-day-matthew-23-34-39' },
  { label: 'Day of St. John - Ecclus 15: 1-8', value: '/en/christmas#day-of-st-john-ecclesiasticus-15-1-8' },
  { label: 'Day of St. John - John 21: 19-24', value: '/en/christmas#day-of-st-john-john-21-19-24' },
  { label: 'Sunday after Xmas - Gal 4: 1-7', value: '/en/christmas#sunday-after-christmas-galatians-4-1-7' },
  { label: 'Sunday after Xmas - Luk 2: 33-40', value: '/en/christmas#sunday-after-christmas-luke-2-33-40' },
  { label: 'New Year\'s Day - Gal 3: 23-29', value: '/en/christmas#new-years-day-galatians-3-23-29' },
  { label: 'Epiphany - Isaiah 60: 1-6', value: '/en/christmas#epiphany-isaiah-60-1-6' },
  { label: 'Epiphany - Matthew 2: 1-12', value: '/en/christmas#epiphany-matthew-2-1-12' },

  // { label: 'VinterPostil', type: 'label' },

  { label: 'Lent Postil is coming soon', value: '/en/lent' },

  // { label: 'SommerPostil', type: 'label' },
  { label: 'Summer Postil is coming soon', value: '/en/easter' },

  // { label: 'Trinity I', type: 'label' },
  { label: 'Trinity I Postil is coming soon', value: '/en/trinity1' },

  // { label: 'Trinity II', type: 'label' },
  { label: 'Trinity II Postil is coming soon', value: '/en/trinity2' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return sermons
})
