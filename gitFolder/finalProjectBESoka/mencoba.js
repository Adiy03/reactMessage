// var teammate=[
//   player1={
//     name:'sumina',
//     position:'GK',
//   //  jumlah:1,
//     team:'A'},

const { count } = require("./Booking_Microservice/models/mongodb/booking");

//   player2={
//       name:'naruto',
//       position:'MF',
//     // jumlah:1,
//       team:'A'
//     },
//     player3={
//       name:'tenmari',
//       position:'MF',
//       //jumlah:2,
//       team:'A'
//     },
//     player4={
//       name:'gaara',
//       position:'MF',
//     //jumlah:2,
//       team:'B'
//     }
// ]


// var baru=[]
// var posisi=[]
// var baruB=[]
// var posisiB=[]



//   for (var i = 0; i < teammate.length; i++) {
//   if (teammate[i].team=='A'){
//     baru.push(teammate[i].jumlah)
// }}

// for (var i = 0; i < teammate.length; i++) {
//   if (teammate[i].team=='A'){
//     posisi.push(teammate[i].position)

// }}

// for (var i = 0; i < teammate.length; i++) {
//   if (teammate[i].team=='B'){
//     baruB.push(teammate[i].jumlah)
// }}

// for (var i = 0; i < teammate.length; i++) {
//   if (teammate[i].team=='B'){
//     posisiB.push(teammate[i].position)

// }}

// var d = new Date ('2006/10/25')
// //var data = posisi.find('GK')
// //console.log(data);
// console.log(d);
// console.log(posisi);
// console.log(baruB);
// console.log(posisiB);

// console.log(d);

// total=  baru.reduce((a, b) => a + b, 0)
// console.log(total);
// sisa=5-total
//   if (sisa<=0){
//     console.log('slot is full');
//   }
//   if ((sisa-1)<=0){
//     console.log('slot is full');
//   }


// var array1 = ['1','2','3','4','5','6']
// var array2 = ['1','5','6']
// var newarray=[]


// var filtered = array1.filter(
//   function(e) {
//     return this.indexOf(e) < 0;
//   },
//  array2
// );
// console.log(filtered);  
var object = {};
var result = []; 
var array = ['1','2','2','3','4','4','5','6','7','8','8','8','9','9','9','9','9']
var array2 = ['2','4','6']
var array3 =['1','7']
var array4 =['8']

var total = [array2,array3,array4]
var team = ['A','B']

console.log(total);

for (let i = 0; i < total.length; i++) {
    var panjang=total[i].length;
    for (let j = 0; j < panjang; j++) {
        result.push(total[i][j]);
        
    }
       
}
console.log(result);







// array.forEach(function (item) {
//   if (!object[item])
//     object[item] = 0;
//   object[item] += 1;
// })

// for (var prop in object) {
//   if (object[prop] >= 2) {
//     result.push(prop);
//   }
// }

// var filtered = array.filter(
//   function(e) {
//     return this.indexOf(e) < 0;
//   },
//  result
// );

// var filtered=team.filter(function(x){
//   return x!=='A'
// })

// console.log(filtered);

// var time=new Date('2015-04-03')

// console.log(time);

// var today = new Date();
// var dd = String(today.getDate()).padStart(2, '0');
// var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
// var yyyy = today.getFullYear();

// today = yyyy + '-' + mm + '-' + dd;
// console.log('ini'+today)
// var d = Date.parse(today);
// var b = Date.parse(time)
// console.log(d);
// console.log(b);

// if (d>b){
//   console.log('ini bener');

// for (let i = 0; i < array2.length; i++) {
//   var n = array2.includes(array[i])
//   console.log(n)
// }
// console.log(n); // console.log(result);
// console.log(array);
// console.log(filtered);  
