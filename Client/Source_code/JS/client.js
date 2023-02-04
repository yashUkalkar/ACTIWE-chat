const socket = io("http://127.0.0.1:3000/");

//Global object for a single user
const user = {
  name: "",
  username: "",
  language: "",
  translation: false,
  chatId: "",
};

//Getting user details from login page
const details = new URLSearchParams(window.location.search);
details.forEach((value, key) => {
  switch (key) {
    case "name":
      user.name = value;
      break;
    case "username":
      user.username = value;
      break;
    case "language":
      user.language = value;
  }
});

/* ========================================================================================== */
/* ========================================================================================== */

/* CHAT AREA JS */

//Stored messages JS
const stored_msg_btn = document.querySelector(
  ".stored-messages-container > button"
);
const stored_msg_card = document.querySelector(".stored-messages-card");

stored_msg_btn.addEventListener("click", () => {
  if (stored_msg_card.classList.contains("closed")) {
    stored_msg_card.style.opacity = "1";
    stored_msg_card.style.pointerEvents = "auto";

    stored_msg_card.classList.remove("closed");
    stored_msg_card.classList.add("open");
  } else {
    stored_msg_card.style.opacity = "0";
    stored_msg_card.style.pointerEvents = "none";

    stored_msg_card.classList.remove("open");
    stored_msg_card.classList.add("closed");
  }
});
stored_msg_card.addEventListener("focusout", () => {
  stored_msg_card.style.opacity = "0";
  stored_msg_card.style.pointerEvents = "none";
});

const store_msg_btn = document.querySelector(".store-new-message");
store_msg_btn.addEventListener("click", () => {
  const new_msg = prompt("Enter message to store");

  if (new_msg != "") {
    const users_messages = document.querySelector(".user-stored-messages");

    const msg_to_store = document.createElement("p");
    msg_to_store.innerText = new_msg;
    msg_to_store.classList.add("stored-message");

    msg_to_store.addEventListener("click", () => {
      const message_text = msg_to_store.innerText;

      //Send message to server
      socket.emit(
        "send-event",
        "sent-message",
        user.username,
        message_text,
        user.language
      );
      //Display message on sender's device
      displayMessage(
        "sent-message",
        user.username,
        message_text,
        user.language
      );
    });

    users_messages.appendChild(msg_to_store);
  }
});

//Toggling the translation feature
const translation_toggle = document.querySelector(".translation-toggle button");
translation_toggle.addEventListener("click", () => {
  //If translation is enabled before click
  if (user.translation === true) {
    user.translation = false;

    //Change button styles and state
    translation_toggle.innerText = "OFF";
    translation_toggle.style.color = "black";
    translation_toggle.style.border = "1px solid black";
    translation_toggle.style.backgroundColor = "white";
  }
  //If translation is disabled before click
  else {
    user.translation = true;

    //Change button styles and state
    translation_toggle.innerText = "ON";
    translation_toggle.style.color = "white";
    translation_toggle.style.border = "none";
    translation_toggle.style.backgroundColor = "#2200FF";
  }
});

//Logout button
const logout_button = document.querySelector(".logout");
logout_button.addEventListener("click", () => {
  socket.disconnect();
  window.location.href = "../HTML/index.html";
});

//Messaging JS

socket.on("connect", () => {
  user.chatId = socket.id;
  socket.emit("new-user", user.username);
});

//Sending a message
const send_button = document.querySelector(".send-button");
send_button.addEventListener("click", () => {
  //Text box for message
  const message_box = document.querySelector(".message-box");
  const to_box = document.querySelector(".to-box");

  const message_text = message_box.value;
  const msg_recipient = to_box.value;

  if (message_text === "") return;

  message_box.value = "";

  //Send message to server
  socket.emit(
    "send-event",
    "sent-message",
    user.username,
    message_text,
    user.language,
    msg_recipient
  );
  //Display message on sender's device
  displayMessage("sent-message", user.username, message_text, user.language);
});
//Send-error
socket.on("send-error", (recipient) => {
  alert("Message was not sent! Username:" + recipient + " is not active.");
});

//Receiving a message
socket.on("receive-event", (message_type, sender, message_text, lang_code) => {
  //Translating message
  if (user.translation) {
    //Translate text before displaying
    translate_n_display(
      message_text,
      user.language,
      lang_code,
      message_type,
      sender
    );
  } else {
    displayMessage(message_type, sender, message_text);
  }
});

/* CHAT AREA JS END */

/* ========================================================================================== */
/* ========================================================================================== */

/* FUNCTIONS */

//Translate given text
async function translate_n_display(
  msg,
  target_lang,
  src_lang,
  msg_type,
  msg_sender
) {
  /* USING Frengly free translation API */
  // let res = await fetch('https://frengly.com/frengly/data/translateREST', {
  //      method: "POST",
  //      body: JSON.stringify({
  //          src: src_lang,
  //          dest: target_lang,
  //          text: msg,
  //          email: 'yash.ukalkar2020@vitbhopal.ac.in',
  //          password: 'randompassword'
  //      }),
  //      headers: { "Content-Type": "application/json" }
  // })

  // let jsonRes = await res.json();
  // let message_text = jsonRes.translation;
  // displayMessage(msg_type,msg_sender,message_text);

  /* Using MICROSOFT translation API using RapidApi */
  // const data = JSON.stringify([
  //   {
  //     Text: msg,
  //   },
  // ]);

  // const xhr = new XMLHttpRequest();
  // xhr.withCredentials = true;

  // xhr.addEventListener("readystatechange", function () {
  //   if (this.readyState === this.DONE) {
  //     /* EXAMPLE RESPONSE
  //              [
  //                  0:{
  //                      "detectedLanguage":{...}
  //                      "translations":[
  //                          0:{
  //                              "text":""
  //                              "transliteration":{...}
  //                              "to":""
  //                              "alignment":{...}
  //                              "sentLen":{...}
  //                          }
  //                      ]
  //                  }
  //              ]
  //           */

  //     let jsonRes = JSON.parse(this.responseText);
  //     let translated_msg = jsonRes[0].translations[0].text;

  displayMessage(msg_type, msg_sender, msg);
  //   }
  // });

  // xhr.open(
  //   "POST",
  //   `https://microsoft-translator-text.p.rapidapi.com/translate?to=${target_lang}&api-version=3.0&profanityAction=NoAction&textType=plain`,
  //   false
  // );
  // xhr.setRequestHeader("content-type", "application/json");
  // xhr.setRequestHeader(
  //   "x-rapidapi-host",
  //   "microsoft-translator-text.p.rapidapi.com"
  // );
  // xhr.setRequestHeader(
  //   "x-rapidapi-key",
  //   "3bb52cc4d0msh93a8d91074f2cbep166adfjsnd84338a335e4"
  // );

  // xhr.send(data);
}

//Display sent/received message event
function displayMessage(message_type, sender, message_to_display) {
  //Message view area container
  const message_area = document.querySelector(".chat-view-area");

  //Clear default message if this is first message
  if (message_area.contains(document.querySelector(".default-message"))) {
    const default_message = document.querySelector(".default-message");
    default_message.remove();
  }

  //container for a message
  const new_message = document.createElement("div");
  new_message.classList.add("message-container");

  //Name of the sender
  if (sender === user.username) {
    sender = "You";
  }
  const sender_name = document.createElement("p");
  sender_name.innerHTML = sender;
  sender_name.classList.add("chat-name");

  //Message to be sent
  const msg = document.createElement("p");
  msg.innerHTML = message_to_display;
  msg.classList.add("message", message_type);
  //Message type is 'received-message' if received

  //Add content to message container
  new_message.appendChild(sender_name);
  new_message.appendChild(msg);

  //Add message to the html file
  message_area.appendChild(new_message);

  //Scroll to this latest message
  message_area.scrollTop = message_area.scrollHeight;
}
