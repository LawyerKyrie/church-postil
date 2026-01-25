// English Index Page
export default defineEventHandler(() => {
  const enSermons = [

    { id: 2001, postil: 'Christmas', tags: 'Epistle', label: 'Christmas D.', bible: 'Tit 2: 11-15', value: '/en/christmas#christmas-day-titus-2-11-15' },
    { id: 2002, postil: 'Christmas', tags: 'Gospel', label: 'Christmas D.', bible: 'Luk 2: 1-14', value: '/en/christmas#early-christmas-service-luke-2-1-14' },
    { id: 2011, postil: 'Christmas', tags: 'Epistle', label: 'Early Xmas', bible: 'Tit 3: 4-7', value: '/en/christmas#early-christmas-service-titus-3-4-7' },
    { id: 2012, postil: 'Christmas', tags: 'Gospel', label: 'Early Xmas', bible: 'Luk 2: 15-20', value: '/en/christmas#early-christmas-service-luke-2-15-20' },
    { id: 2013, postil: 'Christmas', tags: 'Epistle', label: 'Xmas Morn.', bible: 'Heb 1: 1-12', value: '/en/christmas#christmas-morning-service-hebrews-1-1-12' },
    { id: 2014, postil: 'Christmas', tags: 'Gospel', label: 'Main Xmas S.', bible: 'Joh 1: 1-14', value: '/en/christmas#principal-christmas-service-john-1-1-14' },
    { id: 2021, postil: 'Christmas', tags: 'Epistle', label: 'St. Steph.\'s D.', bible: 'Acts 6: 8-14 & 7:54-60', value: '/en/christmas#st-stephens-day-acts-6-8-14-7-54-60' },
    { id: 2022, postil: 'Christmas', tags: 'Gospel', label: 'St. Steph.\'s D.', bible: 'Matt 23: 34-39', value: '/en/christmas#st-stephens-day-matthew-23-34-39' },
    { id: 2031, postil: 'Christmas', tags: 'Epistle', label: 'St. John Day', bible: 'Ecclus 15: 1-8', value: '/en/christmas#day-of-st-john-ecclesiasticus-15-1-8' },
    { id: 2032, postil: 'Christmas', tags: 'Gospel', label: 'St. John Day', bible: 'Joh 21: 19-24', value: '/en/christmas#day-of-st-john-john-21-19-24' },
    { id: 2041, postil: 'Christmas', tags: 'Epistle', label: 'Xmas Sunday', bible: 'Gal 4: 1-7', value: '/en/christmas#sunday-after-christmas-galatians-4-1-7' },
    { id: 2042, postil: 'Christmas', tags: 'Gospel', label: 'Xmas Sunday', bible: 'Luk 2: 33-40', value: '/en/christmas#sunday-after-christmas-luke-2-33-40' },
    { id: 2051, postil: 'Christmas', tags: 'Epistle', label: 'New Year\'s D.', bible: 'Gal 3: 23-29', value: '/en/christmas#new-years-day-galatians-3-23-29' },
    { id: 2061, postil: 'Christmas', tags: 'Epistle', label: 'Epiphany', bible: 'Isaiah 60: 1-6', value: '/en/christmas#epiphany-isaiah-60-1-6' },
    { id: 2062, postil: 'Christmas', tags: 'Gospel', label: 'Epiphany', bible: 'Matt 2: 1-12', value: '/en/christmas#epiphany-matthew-2-1-12' }

  ]

  console.log('Api call from api/en/ssrapitest3.ts - enSermons = ', enSermons)

  return enSermons
})
