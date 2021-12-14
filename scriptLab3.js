var xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", '/getData', false);
xmlHttp.send(null);

var data = JSON.parse(xmlHttp.responseText).inputText;

let notificationBar = document.getElementsByClassName('notify')[0];
let span = notificationBar.getElementsByTagName('span')[0];
span.innerText = data;

