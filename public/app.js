const socket = io();

const userlist = document.getElementById("active_users_list");
const  roomlist = document.getElementById("active_rooms_list");
const  message = document.getElementById("messageInput");
const  sendMessageBtn = document.getElementById("send_message_btn");
const  roomInput = document.getElementById("roomInput");
const  createRoomBtn = document.getElementById("room_add_icon_holder");
const  chatDisplay = document.getElementById("chat");

const currentRoom = "globalChat"
let myUserName = ""


socket.on("connect", () =>{
myUserName = prompt("Enter Your Username")
socket.emit("createUser", myUserName)


})

socket.on("updateChat", (username,  data) =>{
    if(username === "INFO"){
        chatDisplay.innerHTML = `<div class = "announcement" > <span> ${data} </span>  </div>`
    }else{
        chatDisplay.innerHTML += `<div class="message_holder ${
            username === myUserName ? "me" : ""
          }">
                                      <div class="pic"></div>
                                      <div class="message_box">
                                        <div id="message" class="message">
                                          <span class="message_name">${username}</span>
                                          <span class="message_text">${data}</span>
                                        </div>
                                      </div>
                                    </div>`;
    }
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
    
})

sendMessageBtn.addEventListener("click", () =>{
    socket.emit("sendMessage",  message.value)
    message.value = ""

  })
  socket.on("updateRooms", function (rooms, newRoom) {
    roomlist.innerHTML = "";
  
    for (var index in rooms) {
      roomlist.innerHTML += `<div class="room_card" id="${rooms[index].name}"
                                  onclick="changeRoom('${rooms[index].name}')">
                                  <div class="room_item_content">
                                      <div class="pic"></div>
                                      <div class="roomInfo">
                                      <span class="room_name">#${rooms[index].name}</span>
                                      <span class="room_author">${rooms[index].creator}</span>
                                      </div>
                                  </div>
                              </div>`;
    }
  
    document.getElementById(currentRoom).classList.add("active_item");
  });
 

function changeRoom(room) {
    if(room != currentRoom){
        socket.emit("updateRoom", room)
        document.getElementById(currentRoom).classList.remove("active_item");
        currentRoom = room;
        document.getElementById(currentRoom).classList.add("active_item");
    }

}

createRoomBtn.addEventListener("click", function () {
    // socket.emit("createRoom", prompt("Enter new room: "));
    let roomName = roomInput.value.trim();
    if (roomName !== "") {
      socket.emit("createRoom", roomName);
      roomInput.value = "";
    }
  });