import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
  databaseURL : "https://champion-database-c91f8-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const championListDB = ref(database, "messageList");

const messageInputEl = document.getElementById("message-input");
const fromInputEl = document.getElementById("from-input");
const toInputEl = document.getElementById("to-input");
const publishEl = document.getElementById("publish-button");
const championListEl = document.getElementById("champion-list");

const array = {
  message: messageInputEl,
  from: fromInputEl,
  to: toInputEl
}


publishEl.addEventListener("click", function(){
  let arrayList = [array.message.value, array.from.value, array.to.value];
  push(championListDB, arrayList);
  clearInputFieldEl();
})

onValue(championListDB, function(snapshot){
  if(snapshot.exists()){
    let messageList = Object.entries(snapshot.val());
    clearChampionsEl()

    for(let i = 0; i < messageList.length; i++){
      let lister = messageList[i]
      publishMessage(lister);
    }
  }
  else{
    championListEl.innerHTML = "";
  }
})

function clearInputFieldEl(){
  messageInputEl.value = "";
  fromInputEl.value = "";
  toInputEl.value = "";
}

function clearChampionsEl(){
  championListEl.innerHTML = "";
}

function publishMessage(values){
  let itemID = values[0];
  let itemValue = values[1];
  
  //element maker
  let div = document.createElement("div");
  div.className = "diver";
  let messageEl = document.createElement("li");
  let fromEl = document.createElement("p");
  fromEl.className = "from";
  let toEl = document.createElement("p");
  toEl.className = "to";
  messageEl.textContent = `${itemValue[0]}`;
  fromEl.textContent = `From: ${itemValue[1]}`;
  toEl.textContent = `To: ${itemValue[2]}`;

  //remove when clicked
  div.addEventListener("click", function(){
    let removeLocationID = ref(database, `messageList/${itemID}`);
    remove(removeLocationID);
  })

  // Scenarios
  if(itemValue[1] != ""){
    div.append(fromEl);
  }
  if(itemValue[0] != ""){
    div.append(messageEl);
  }
  if(itemValue[2] != ""){
    div.append(toEl);
  }
  championListEl.prepend(div);
}