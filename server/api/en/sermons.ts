// English Index Page
const enSermons = [
  // { label: '1. Postil; Advent - Christmas', type: 'label' },

  { id: 11, postil: 'Advent', tag: 'Epistle', label: '1. Sun. Advent', bible: 'Rom 13: 11-14', value: '/en/advent#first-sunday-in-advent-romans-13-11-14' },
  { id: 12, postil: 'Advent', tag: 'Gospel', label: '1. Sun. Advent', bible: 'Matt 21: 1-9', value: '/en/advent#first-sunday-in-advent-matthew-21-1-9' },
  { id: 21, postil: 'Advent', tag: 'Epistle', label: '2. Sun. Advent', bible: 'Rom 15: 4-13', value: '/en/advent#second-sunday-in-advent-romans-15-4-13' },
  { id: 22, postil: 'Advent', tag: 'Gospel', label: '2. Sun. Advent', bible: 'Luke 21: 25-36', value: '/en/advent#second-sunday-in-advent-luke-21-25-36' },
  { id: 31, postil: 'Advent', tag: 'Epistle', label: '3. Sun. Advent', bible: '1 Cor 4: 1-5', value: '/en/advent#third-sunday-in-advent-1-corinthians-4-1-5' },
  { id: 32, postil: 'Advent', tag: 'Gospel', label: '3. Sun. Advent', bible: 'Matt 11: 2-10', value: '/en/advent#third-sunday-in-advent-matthew-11-2-10' },
  { id: 41, postil: 'Advent', tag: 'Epistle', label: '4. Sun. Advent', bible: 'Phil 4: 4-7', value: '/en/advent#fourth-sunday-in-advent-philippians-4-4-7' },
  { id: 42, postil: 'Advent', tag: 'Gospel', label: '4. Sun. Advent', bible: 'Joh 1: 19-28', value: '/en/advent#fourth-sunday-in-advent-john-1-19-28' },

  // { type: 'separator' }
  // { label: 'Christmas Postil; Christmas - Epiphany', type: 'label' },

  { id: 241, postil: 'Christmas', tag: 'Epistle', label: 'Christmas Day', bible: 'Tit 2: 11-15', value: '/en/christmas#christmas-day-titus-2-11-15' },
  { id: 242, postil: 'Christmas', tag: 'Gospel', label: 'Christmas Day', bible: 'Luk 2: 1-14', value: '/en/christmas#early-christmas-service-luke-2-1-14' },
  { id: 251, postil: 'Christmas', tag: 'Epistle', label: 'Early Xmas', bible: 'Tit 3: 4-7', value: '/en/christmas#early-christmas-service-titus-3-4-7' },
  { id: 252, postil: 'Christmas', tag: 'Gospel', label: 'Early Xmas', bible: 'Luk 2: 15-20', value: '/en/christmas#early-christmas-service-luke-2-15-20' },
  { id: 253, postil: 'Christmas', tag: 'Epistle', label: 'Xmas Morning', bible: 'Heb 1: 1-12', value: '/en/christmas#christmas-morning-service-hebrews-1-1-12' },
  { id: 254, postil: 'Christmas', tag: 'Gospel', label: 'Main Xmas S.', bible: 'Joh 1: 1-14', value: '/en/christmas#principal-christmas-service-john-1-1-14' },
  { id: 261, postil: 'Christmas', tag: 'Epistle', label: 'St. Steph.\'s D.', bible: 'Acts 6: 8-14 & 7:54-60', value: '/en/christmas#st-stephens-day-acts-6-8-14-7-54-60' },
  { id: 262, postil: 'Christmas', tag: 'Gospel', label: 'St. Steph.\'s D.', bible: 'Matt 23: 34-39', value: '/en/christmas#st-stephens-day-matthew-23-34-39' },
  { id: 271, postil: 'Christmas', tag: 'Epistle', label: 'Day of St. John', bible: 'Ecclus 15: 1-8', value: '/en/christmas#day-of-st-john-ecclesiasticus-15-1-8' },
  { id: 272, postil: 'Christmas', tag: 'Gospel', label: 'Day of St. John', bible: 'Joh 21: 19-24', value: '/en/christmas#day-of-st-john-john-21-19-24' },
  { id: 291, postil: 'Christmas', tag: 'Epistle', label: 'Xmas Sunday', bible: 'Gal 4: 1-7', value: '/en/christmas#sunday-after-christmas-galatians-4-1-7' },
  { id: 292, postil: 'Christmas', tag: 'Gospel', label: 'Xmas Sunday', bible: 'Luk 2: 33-40', value: '/en/christmas#sunday-after-christmas-luke-2-33-40' },
  { id: 321, postil: 'Christmas', tag: 'Epistle', label: 'New Year\'s D.', bible: 'Gal 3: 23-29', value: '/en/christmas#new-years-day-galatians-3-23-29' },
  { id: 331, postil: 'Christmas', tag: 'Epistle', label: 'Epiphany', bible: 'Isaiah 60: 1-6', value: '/en/christmas#epiphany-isaiah-60-1-6' },
  { id: 332, postil: 'Christmas', tag: 'Gospel', label: 'Epiphany', bible: 'Matt 2: 1-12', value: '/en/christmas#epiphany-matthew-2-1-12' },

  // { type: 'separator' }
  // { label: 'Winter Postil; Epiphany - The Holy Friday', type: 'label' },

  { id: 411, postil: 'Winter', tag: 'Epistle', label: '1. Sunday', bible: 'Rom 12: 1-6', value: '/da/lent#_1sunday-after-epiphany-rom-12-1-6' },
  { id: 412, postil: 'Winter', tag: 'Gospel', label: '1. Sunday', bible: 'Luk 2: 42-52', value: '/en/lent#_1sunday-after-epiphany-luke-2-41-52' },
  { id: 413, postil: 'Winter', tag: 'Gospel', label: '1. Sunday', bible: 'Luk 2: 42-52', value: '/en/lent#_1sunday-after-epiphany-2sermon-luke-2-41-52' },
  { id: 421, postil: 'Winter', tag: 'Epistle', label: '2. Sunday', bible: 'Rom 12: 6-16', value: '/en/lent#_2sunday-after-epiphany-rom-12-6-16' },
  { id: 422, postil: 'Winter', tag: 'Gospel', label: '2. Sunday', bible: 'Joh 2: 1-11', value: '/en/lent#_2sunday-after-epiphany-john-2-1-11' },
  { id: 431, postil: 'Winter', tag: 'Epistle', label: '3. Sunday', bible: 'Rom 12: 16-21', value: '/da/lent/epiphany-epistle03' },
  { id: 432, postil: 'Winter', tag: 'Gospel', label: '3. Sunday', bible: 'Matt 8: 1-13', value: '/da/lent/epiphany-gospel03' },
  { id: 441, postil: 'Winter', tag: 'Epistle', label: '4. Sunday', bible: 'Rom 13: 8-10', value: '/da/lent/epiphany-epistle04' },
  { id: 442, postil: 'Winter', tag: 'Gospel', label: '4. Sunday', bible: 'Matt 8: 23-27', value: '/da/lent/epiphany-gospel04' },
  { id: 451, postil: 'Winter', tag: 'Epistle', label: '5. Sunday', bible: 'Col 3: 12-17', value: '/da/lent/epiphany-epistle05' },
  { id: 452, postil: 'Winter', tag: 'Gospel', label: '5. Sunday', bible: 'Matt 13: 24-30', value: '/da/lent/epiphany-gospel05' },
  { id: 461, postil: 'Winter', tag: 'Epistle', label: 'Septuagesima', bible: '1 Cor 9: 24-10,5', value: '/da/lent/septuagesima-epistle' },
  { id: 462, postil: 'Winter', tag: 'Gospel', label: 'Septuagesima', bible: 'Matt 20: 1-16', value: '/da/lent/septuagesima-gospel' },
  { id: 471, postil: 'Winter', tag: 'Epistle', label: 'Sexsagesima', bible: '2 Cor 11: 19-12,9', value: '/da/lent/sexagesima-epistle' },
  { id: 472, postil: 'Winter', tag: 'Gospel', label: 'Sexsagesima', bible: 'Luk 8: 5-15', value: '/da/lent/sexagesima-gospel' },
  { id: 481, postil: 'Winter', tag: 'Epistle', label: 'Shrove Sun.', bible: '1 Cor 13: 1-13', value: '/da/lent/fastelavens-sondag-epistle' },
  { id: 482, postil: 'Winter', tag: 'Gospel', label: 'Shrove Sun.', bible: 'Luk 18, 31-43', value: '/da/lent/fastelavens-sondag-gospel' },

  // { type: 'separator' }
  // { label: 'Summer Postil; Easter - Trinitatis', type: 'label' },

  { id: 1011, postil: 'Easter', tag: 'Epistle', label: '1. Sunday', bible: '1 Joh 5: 4-12', value: '/da/easter/epistle01' },
  { id: 1012, postil: 'Easter', tag: 'Gospel', label: '1. Sunday', bible: 'Joh 20: 19-31', value: '/da/easter/gospel01' },
  { id: 1021, postil: 'Easter', tag: 'Epistle', label: '2. Sunday', bible: '1 Pet 2: 20-25', value: '/da/easter/epistle02' },
  { id: 1022, postil: 'Easter', tag: 'Gospel', label: '2. Sunday', bible: 'Joh 10: 11-16', value: '/da/easter/gospel02' },
  { id: 1031, postil: 'Easter', tag: 'Epistle', label: '3. Sunday', bible: '1 Pet 2: 11-20', value: '/da/easter/epistle03' },
  { id: 1032, postil: 'Easter', tag: 'Gospel', label: '3. Sunday', bible: 'Joh 16: 16-23', value: '/da/easter/gospel03' },
  { id: 1041, postil: 'Easter', tag: 'Epistle', label: '4. Sunday', bible: 'James 1: 16-21', value: '/da/easter/epistle04' },
  { id: 1042, postil: 'Easter', tag: 'Gospel', label: '4. Sunday', bible: 'Joh 16: 5-15', value: '/da/easter/gospel04' },

  // { type: 'separator' }
  // { label: 'Trinity I Postil; 1.- 12.Sun. after Trinitatis', type: 'label' },

  { id: 2011, postil: 'Trinity I', tag: 'Epistle', label: '1. Sunday', bible: 'Rom 11: 33-36', value: '/da/trinity1/epistle01' },
  { id: 2012, postil: 'Trinity I', tag: 'Gospel', label: '1. Sunday', bible: 'Luk 16: 19-31', value: '/da/trinity1/gospel01' },
  { id: 2021, postil: 'Trinity I', tag: 'Epistle', label: '2. Sunday', bible: '1 Joh 3: 13-18', value: '/da/trinity1/epistle2' },
  { id: 2022, postil: 'Trinity I', tag: 'Gospel', label: '2. Sunday', bible: 'Luk 14: 16-24', value: '/da/trinity1/gospel02' },
  { id: 2031, postil: 'Trinity I', tag: 'Epistle', label: '3. Sunday', bible: '1 Pet 5: 5-11', value: '/da/trinity1/epistle03' },
  { id: 2032, postil: 'Trinity I', tag: 'Gospel', label: '3. Sunday', bible: 'Luk 15: 1-10', value: '/da/trinity1/gospel03' },
  { id: 2041, postil: 'Trinity I', tag: 'Epistle', label: '4. Sunday', bible: 'Rom 8: 18-22', value: '/da/trinity1/epistle04' },
  { id: 2042, postil: 'Trinity I', tag: 'Gospel', label: '4. Sunday', bible: 'Luk 6: 36-42', value: '/da/trinity1/gospel04' },
  { id: 2051, postil: 'Trinity I', tag: 'Epistle', label: '5. Sunday', bible: '1 Pet 3: 8-15', value: '/da/trinity1/epistle05' },
  { id: 2052, postil: 'Trinity I', tag: 'Gospel', label: '5. Sunday', bible: 'Luk 5: 1-11', value: '/da/trinity1/gospel05' },
  { id: 2061, postil: 'Trinity I', tag: 'Epistle', label: '6. Sunday', bible: 'Rom 6: 3-11', value: '/da/trinity1/epistle06' },
  { id: 2062, postil: 'Trinity I', tag: 'Gospel', label: '6. Sunday', bible: 'Matt 5: 20-26', value: '/da/trinity1/gospel06' },
  { id: 2071, postil: 'Trinity I', tag: 'Epistle', label: '7. Sunday', bible: 'Rom 6: 19-23', value: '/da/trinity1/epistle07' },
  { id: 2072, postil: 'Trinity I', tag: 'Gospel', label: '7. Sunday', bible: 'Mark 8: 1-9', value: '/da/trinity1/gospel07' },
  { id: 2081, postil: 'Trinity I', tag: 'Epistle', label: '8. Sunday', bible: 'Rom 8: 12-17', value: '/da/trinity1/epistle08' },
  { id: 2082, postil: 'Trinity I', tag: 'Gospel', label: '8. Sunday', bible: 'Matt 7: 15-23', value: '/da/trinity1/gospel08' },
  { id: 2091, postil: 'Trinity I', tag: 'Epistle', label: '9. Sunday', bible: '1 Cor 10: 6-13', value: '/da/trinity1/epistle09' },
  { id: 2092, postil: 'Trinity I', tag: 'Gospel', label: '9. Sunday', bible: 'Luk 16: 1-9', value: '/da/trinity1/gospel09' },
  { id: 2101, postil: 'Trinity I', tag: 'Epistle', label: '10. Sunday', bible: '1 Cor 12: 1-11', value: '/da/trinity1/epistle10' },
  { id: 2102, postil: 'Trinity I', tag: 'Gospel', label: '10. Sunday', bible: 'Luk 19: 41-48', value: '/da/trinity1/gospel10' },
  { id: 2111, postil: 'Trinity I', tag: 'Epistle', label: '11. Sunday', bible: '1 Cor 15: 1-10', value: '/da/trinity1/epistle111' },
  { id: 2112, postil: 'Trinity I', tag: 'Gospel', label: '11. Sunday', bible: 'Luk 18: 9-14', value: '/da/trinity1/gospel1' },
  { id: 2121, postil: 'Trinity I', tag: 'Epistle', label: '12. Sunday', bible: '2 Cor 3: 4-11', value: '/da/trinity1/epistle12' },
  { id: 2122, postil: 'Trinity I', tag: 'Gospel', label: '12. Sunday', bible: 'Mark 7: 31-37', value: '/da/trinity1/gospel12' },

  // { type: 'separator' }
  // { label: 'Trinity II Postil; 13.- 26.Sun. after Trinitatis', type: 'label' },

  { id: 2131, postil: 'Trinity II', tag: 'Epistle', label: '13. Sunday', bible: 'Gal 3: 15-22', value: '/da/trinity2/epistle13' },
  { id: 2132, postil: 'Trinity II', tag: 'Gospel', label: '13. Sunday', bible: 'Luk 10, 23-37', value: '/da/trinity2/gospel13' },
  { id: 2141, postil: 'Trinity II', tag: 'Epistle', label: '14. Sunday', bible: 'Gal 5: 16-24', value: '/da/trinity2/epistle14' },
  { id: 2142, postil: 'Trinity II', tag: 'Gospel', label: '14. Sunday', bible: 'Luk 17: 11-19', value: '/da/trinity2/gospel14' },
  { id: 2151, postil: 'Trinity II', tag: 'Epistle', label: '15. Sunday', bible: 'Gal 5:25 - 6:10', value: '/da/trinity2/epistle15' },
  { id: 2152, postil: 'Trinity II', tag: 'Gospel', label: '15. Sunday', bible: 'Matt 6: 24-34', value: '/da/trinity2/gospel15' },
  { id: 2161, postil: 'Trinity II', tag: 'Epistle', label: '16. Sunday', bible: 'Eph 3: 13-21', value: '/da/trinity2/epistle16' },
  { id: 2162, postil: 'Trinity II', tag: 'Gospel', label: '16. Sunday', bible: 'Luk 7: 11-17', value: '/da/trinity2/gospel16' },
  { id: 2171, postil: 'Trinity II', tag: 'Epistle', label: '17. Sunday', bible: 'Eph 4: 1-6', value: '/da/trinity2/epistle17' },
  { id: 2172, postil: 'Trinity II', tag: 'Gospel', label: '17. Sunday', bible: 'Luk 14: 1-11', value: '/da/trinity2/gospel17' },
  { id: 2181, postil: 'Trinity II', tag: 'Epistle', label: '18. Sunday', bible: '1 Cor 1: 4-9', value: '/da/trinity2/epistle18' },
  { id: 2182, postil: 'Trinity II', tag: 'Gospel', label: '18. Sunday', bible: 'Matt 22: 34-46', value: '/da/trinity2/gospel18' },
  { id: 2191, postil: 'Trinity II', tag: 'Epistle', label: '19. Sunday', bible: 'Eph 4: 22-28', value: '/da/trinity2/epistle19' },
  { id: 2192, postil: 'Trinity II', tag: 'Gospel', label: '19. Sunday', bible: 'Matt 9: 1-8', value: '/da/trinity2/gospel19' },
  { id: 2201, postil: 'Trinity II', tag: 'Epistle', label: '20. Sunday', bible: 'Eph 5: 15-21', value: '/da/trinity2/epistle20' },
  { id: 2202, postil: 'Trinity II', tag: 'Gospel', label: '29. Sunday', bible: 'Matt 22: 1-14', value: '/da/trinity2/gospel20' },
  { id: 2211, postil: 'Trinity II', tag: 'Epistle', label: '21. Sunday', bible: 'Eph 6: 10-17', value: '/da/trinity2/epistle21' },
  { id: 2212, postil: 'Trinity II', tag: 'Gospel', label: '21. Sunday', bible: 'Joh 4: 46-54', value: '/da/trinity2/gospel21' },
  { id: 2215, postil: 'Trinity II', tag: 'Gospel', label: 'All Saint\'s Day', bible: 'Matt 5: 1-12', value: '/da/trinity2/evangelium-alle-helgens-dag' },
  { id: 2221, postil: 'Trinity II', tag: 'Epistle', label: '22. Sunday', bible: 'Phil 1: 3-11', value: '/da/trinity2/epistle22' },
  { id: 2222, postil: 'Trinity II', tag: 'Gospel', label: '22. Sunday', bible: 'Matt 18: 23-35', value: '/da/trinity2/gospel22' },
  { id: 2231, postil: 'Trinity II', tag: 'Epistle', label: '23. Sunday', bible: 'Phil 3: 17-21', value: '/da/trinity2/epistle23' },
  { id: 2232, postil: 'Trinity II', tag: 'Gospel', label: '23. Sunday', bible: 'Matt 22: 15-22', value: '/da/trinity2/gospel23' },
  { id: 2241, postil: 'Trinity II', tag: 'Epistle', label: '24. Sunday', bible: 'Col 1: 3-14', value: '/da/trinity2/epistle24' },
  { id: 2242, postil: 'Trinity II', tag: 'Gospel', label: '24. Sunday', bible: 'Matt 9: 18-26', value: '/da/trinity2/gospel24' },
  { id: 2251, postil: 'Trinity II', tag: 'Epistle', label: '25. Sunday', bible: '1 Thess 4: 13-18', value: '/da/trinity2/epistle25' },
  { id: 2252, postil: 'Trinity II', tag: 'Gospel', label: '25. Sunday', bible: 'Matt 24: 15-28', value: '/da/trinity2/gospel25' },
  { id: 2261, postil: 'Trinity II', tag: 'Epistle', label: '26. Sunday', bible: '2Thess 1: 3-10', value: '/da/trinity2/epistle26' },
  { id: 2262, postil: 'Trinity II', tag: 'Gospel', label: '26. Sunday', bible: 'Matt 25: 31-42', value: '/da/trinity2/gospel26' }

  // { type: 'separator' }
]

export default defineEventHandler(() => {
  return enSermons
})
