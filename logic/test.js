/*
let yr = 2024
let mon = 7 - 1;
let startDate = new Date(yr, mon, 1);
let endDate = new Date(yr, mon + 1, 0);


// Create calendar
let currentDate = new Date(startDate);

// Adjust start day to Monday (1st column)
currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);

let formattedDate = new Date(yr, mon-1, 2);
formattedDate = (new Date(formattedDate.setDate(currentDate.getDate()+1))).toISOString().split('T')[0];

console.log(formattedDate);
*/

date = "2024-07-31"



console.log(newDateStr);

