function displayGreeting(){
    var greetingElement = document.querySelector(".incoming_chat p")
    var today = new Date()
    var hourNow = today.getHours();
    var greeting;
    switch (true){
        case (hourNow > 18):
            greeting = "Good evening!";
            break;
        case(hourNow > 12):
            greeting = "Good afternoon!";
            break;
        case(hourNow > 0):
            greeting = "Good Morning!"
            break;
        default:
            greeting = "Welcome"
    }
    greetingElement.textContent = greeting + " How can I assist you today?";
}
window.onload = displayGreeting();
const mainChat = document.querySelector(".chat_body")
const chatInput = document.querySelector(".chat_footer textarea")
const sendChatBtn = document.querySelector(".send_button")
const chatbox = document.querySelector(".chat_body")


let userMsg;
const API_KEY = "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"
const inputHeight = chatInput.scrollHeight

const createChatLi = (message, className) =>{
    const chatLi = document.createElement("li")
    chatLi.classList.add("chat", className)
    let chatContent = className === "outgoing_chat"?`<p>${message}</p>`: `<p>${message}</p>`
    chatLi.innerHTML = chatContent
    chatLi.querySelector("p").textContent = message
    return chatLi
}

const generateResponse = (incomingChatLi, dotInterval) => {
    const API_URL = "https://api.openai.com/v1/chat/completions"
    const messageElement = incomingChatLi.querySelector("p")

    const requestOptions = {
        method: "POST", 
        headers:{
            "Content-Type":"application/json", 
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: userMsg}]
    })          
    }
    console.log("fetch start")
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        clearInterval(dotInterval)
        messageElement.textContent = data.choices[0].message.content
        console.log("Fetch end")
    }).catch((error) =>{
        console.error("Error:", error);
        messageElement.textContent = "Oops! Something went wrong. Please try again."
    }).finally(()=>chatbox.scrollTo(0, chatbox.scrollHeight))
}

const handleChat = () =>{
    userMsg = chatInput.value.trim()
    if(!userMsg) return
    chatInput.value = "";
    chatInput.style.height = `${chatInput.scrollHeight}px`

    chatbox.appendChild(createChatLi(userMsg, "outgoing_chat"))
    chatbox.scrollTo(0, chatbox.scrollHeight)

    setTimeout (() => {
        const incomingChatLi = createChatLi(".", "incoming_chat")
        chatbox.appendChild(incomingChatLi)
        chatbox.scrollTo(0, chatbox.scrollHeight)


 let dotCount = 1;
    const dotInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1; // Cycle between 1 and 3
        incomingChatLi.querySelector("p").textContent = ".".repeat(dotCount);
    }, 600);

    generateResponse(incomingChatLi, dotInterval);
}, 600);}

chatInput.addEventListener("input", () =>{
    chatInput.style.height = `${inputHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})

chatInput.addEventListener("keydown", (e) =>{
    if(e.key ==="Enter" && !e.shiftKey && window.innerWidth> 800){
        e.preventDefault();
        handleChat()
    }
})

sendChatBtn.addEventListener("click", handleChat)
