// var energyUsage = [46523, 38220, 25721, 28484, 36863, 42085, 46669, 39965, 30508, 27986, 32415, 37850];
//
// var elecCostpKWh = 0.13;
// var solarEnPercent = 0.22;
// var gridEnPercent = 0.78;
//
// var weekdaysRatio = 0.8;
// var weekendsRatio = 0.2;
//
// var earlyMornsRatio = 0.05;
// var dayTimeRatio = 0.80;
// var lateNightRatio = 0.15;
//
// function randomEneGenPM(energyUsage) {
//   var res = [];
//   var d = new Date();
//   d.setMonth(d.getMonth() + 1);
//   d.setDate(1);
//   d.setHours(0);
//   d.setMinutes(0);
//   d.setSeconds(-1);
//   for (var i = 0; i < 12; i++) {
//     var endTime = new Date(d);
//     if (i > 0) {
//       d.setMonth(d.getMonth() - 1);
//       endTime = new Date(d);
//       endTime.setMonth(endTime.getMonth() + 1);
//       endTime.setDate(1);
//       endTime.setHours(0);
//       endTime.setMinutes(0);
//       endTime.setSeconds(-1);
//     }
//     var dateTime = new Date(d);
//     dateTime.setDate(1);
//     dateTime.setHours(0);
//     dateTime.setMinutes(0);
//     dateTime.setSeconds(0);
//     var rec = {
//       dateTime: dateTime.toISOString(),
//       endTime: endTime.toISOString(),
//       reading: energyUsage[i],
//       solarEnergy: (energyUsage[i] * solarEnPercent).toFixed(2),
//       gridEnergy: (energyUsage[i] * gridEnPercent).toFixed(2),
//       costSaving: '$' + ((energyUsage[i] * solarEnPercent * elecCostpKWh)).toFixed(2),
//       unit: 'kWh'
//     };
//     res.push(rec);
//   }
//   return res;
// }
//
// function randomEneGenPD(energyPM) {
//   var res = [];
//   var d = new Date(energyPM.endTime);
//   var daysInMnth = d.getDate();
//   var avgWeekDayRead = energyPM.reading * weekdaysRatio / getWeekDays(d);
//   var avgWeekEndRead = energyPM.reading * weekendsRatio / (daysInMnth - getWeekDays(d));
//   var sumWeekDay = 0;
//   var sumWeekEnd = 0;
//   var weekDayCnt = 0;
//   var weekEndCnt = 0;
//   for (var i = 0; i < daysInMnth; i++) {
//     var endTime = new Date(d);
//     if (i > 0) {
//       d.setDate(d.getDate() - 1);
//       endTime = new Date(d);
//       endTime.setDate(endTime.getDate() + 1);
//       endTime.setHours(0);
//       endTime.setMinutes(0);
//       endTime.setSeconds(-1);
//     }
//     var dateTime = new Date(d);
//     dateTime.setHours(0);
//     dateTime.setMinutes(0);
//     dateTime.setSeconds(0);
//     var rec = {
//       dateTime: dateTime.toISOString(),
//       endTime: endTime.toISOString(),
//       unit: energyPM.unit
//     };
//     var tmp = 0;
//     var reading = 0;
//     if (d.getDay() > 0 && d.getDay() < 6) {
//       weekDayCnt++;
//       tmp = avgWeekDayRead * (Math.random() * 0.2 + 0.1);
//       if (tmp > avgWeekDayRead) {
//         tmp = tmp - (avgWeekDayRead * (tmp % avgWeekDayRead));
//       }
//       sumWeekDay += avgWeekDayRead;
//       if (sumWeekDay > (avgWeekDayRead * weekDayCnt)) {
//         sumWeekDay -= tmp;
//         reading = avgWeekDayRead - tmp;
//       } else {
//         sumWeekDay += tmp;
//         reading = avgWeekDayRead + tmp;
//       }
//       rec.reading = reading.toFixed(2);
//       rec.solarEnergy = (reading * solarEnPercent).toFixed(2);
//       rec.gridEnergy = (reading * gridEnPercent).toFixed(2);
//       rec.costSaving = '$' + ((reading * solarEnPercent) * elecCostpKWh).toFixed(2);
//     } else {
//       weekEndCnt++;
//       tmp = avgWeekEndRead * (Math.random() * 0.2 + 0.1);
//       if (tmp > avgWeekEndRead) {
//         tmp = tmp - (avgWeekEndRead * (tmp % avgWeekEndRead));
//       }
//       sumWeekEnd += avgWeekEndRead;
//       if (sumWeekEnd > (avgWeekEndRead * weekEndCnt)) {
//         sumWeekEnd -= tmp;
//         reading = avgWeekEndRead - tmp;
//       } else {
//         sumWeekEnd += tmp;
//         reading = avgWeekEndRead + tmp;
//       }
//       rec.reading = reading.toFixed(2);
//       rec.solarEnergy = (reading * solarEnPercent).toFixed(2);
//       rec.gridEnergy = (reading * gridEnPercent).toFixed(2);
//       rec.costSaving = '$' + ((reading * solarEnPercent) * elecCostpKWh).toFixed(2);
//     }
//     res.push(rec);
//   }
//   return res;
// }
//
// function randomEneGenPH(energyPD) {
//   var res = [];
//   var d = new Date(energyPD.endTime);
//   d.setSeconds(-1);
//   var avgEH1 = energyPD.reading * earlyMornsRatio / 9;
//   var avgEH = energyPD.reading * dayTimeRatio / 8;
//   var avgEH2 = energyPD.reading * lateNightRatio / 7;
//   var sumEH = 0;
//   var sumEH1 = 0;
//   var sumEH2 = 0;
//   var cntEH = 0;
//   var cntEH1 = 0;
//   var cntEH2 = 0;
//   var tmp = 0;
//   var reading = 0;
//   var totalHrs = d.getHours();
//   for (var i = 0; i <= totalHrs; i++) {
//     var endTime = new Date(d);
//     if (i > 0) {
//       endTime.setMinutes(0);
//       endTime.setSeconds(-1);
//       d.setHours(d.getHours() - 1);
//     }
//     var dateTime = new Date(d);
//     dateTime.setMinutes(0);
//     dateTime.setSeconds(0);
//     var rec = {
//       dateTime: dateTime.toISOString(),
//       endTime: endTime.toISOString(),
//       unit: energyPD.unit
//     };
//     if (d.getHours() >= 0 && d.getHours() < 9) {
//       cntEH1++;
//       sumEH1 += avgEH1;
//       tmp = avgEH1 * (Math.random() * 0.2 + 0.1);
//       if (tmp > avgEH1) {
//         tmp = tmp - (avgEH1 * (tmp % avgEH1));
//       }
//       if (sumEH1 > (avgEH1 * cntEH1)) {
//         sumEH1 -= tmp;
//         reading = avgEH1 - tmp;
//       } else {
//         sumEH1 += tmp;
//         reading = avgEH1 + tmp;
//       }
//       rec.reading = reading.toFixed(2);
//       rec.solarEnergy = (reading * solarEnPercent).toFixed(2);
//       rec.gridEnergy = (reading * gridEnPercent).toFixed(2);
//       rec.costSaving = '$' + ((reading * solarEnPercent) * elecCostpKWh).toFixed(2);
//     } else if (d.getHours() >= 9 && d.getHours() <= 17) {
//       cntEH++;
//       sumEH += avgEH;
//       tmp = avgEH * (Math.random() * 0.2 + 0.1);
//       if (tmp > avgEH) {
//         tmp = tmp - (avgEH * (tmp % avgEH));
//       }
//       if (sumEH > (avgEH * cntEH)) {
//         sumEH -= tmp;
//         reading = avgEH - tmp;
//       } else {
//         sumEH += tmp;
//         reading = avgEH + tmp;
//       }
//       rec.reading = reading.toFixed(2);
//       rec.solarEnergy = (reading * solarEnPercent).toFixed(2);
//       rec.gridEnergy = (reading * gridEnPercent).toFixed(2);
//       rec.costSaving = '$' + ((reading * solarEnPercent) * elecCostpKWh).toFixed(2);
//     } else {
//       cntEH2++;
//       sumEH2 += avgEH2;
//       tmp = avgEH2 * (Math.random() * 0.2 + 0.1);
//       if (tmp > avgEH2) {
//         tmp = tmp - (avgEH2 * (tmp % avgEH2));
//       }
//       if (sumEH2 > (avgEH2 * cntEH2)) {
//         sumEH2 -= tmp;
//         reading = avgEH2 - tmp;
//       } else {
//         sumEH2 += tmp;
//         reading = avgEH2 + tmp;
//       }
//       rec.reading = reading.toFixed(2);
//       rec.solarEnergy = (reading * solarEnPercent).toFixed(2);
//       rec.gridEnergy = (reading * gridEnPercent).toFixed(2);
//       rec.costSaving = '$' + ((reading * solarEnPercent) * elecCostpKWh).toFixed(2);
//     }
//     res.push(rec);
//   }
//   return res;
// }
//
// function getWeekDays(dt) {
//   var res = 0;
//   if (dt.getDay() > 0 && dt.getDay() < 6) {
//     res++;
//   }
//   return res;
// }
//
// var monthlyEne = randomEneGenPM(energyUsage);
// var dailyEne = randomEneGenPD(monthlyEne[0]);
//
// function getNdaysPH(n, dailyEn) {
//   var res = [];
//   for (var i = 0; i < n; i++) {
//     res.push(randomEneGenPH(dailyEn[i]));
//   }
//   res = _.flattenDeep(res);
//   return res;
// }
//
// console.log('monthly energy usage: ', monthlyEne);
// console.log('daily energy usage: ', dailyEne);
// console.log('hourly energy usage: ', getNdaysPH(30, dailyEne));