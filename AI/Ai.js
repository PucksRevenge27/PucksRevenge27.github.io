const chatContent = document.getElementById("chatbox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("chatInput");
const contextMenu = document.getElementById("contextMenu");
const deleteMessageOption = document.getElementById("deleteMessageOption");
const deleteAllMessagesOption = document.getElementById("deleteAllMessagesOption");

// Memory to store the conversation
let conversationHistory = [];
let selectedMessage = null; // Track the currently right-clicked message

// Function to fetch response from the server
async function fetchResponse(userMessage) {
    const apiUrl = "https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5IZkJDMlNyYUVUTjIyZVN3UWFNX3BFTU85SWpCM2NUMUk3T2dxejhLSzBhNWNMMXNzZlp3c09BSTR6YW1Sc1BmdGNTVk1GY0liT1RoWDZZX1lNZlZ0Z1dqd3c9PQ==";
    const fullConversation = conversationHistory.map(entry => `${entry.sender}: ${entry.message}`).join("\n");
    const bodyContent = { prompt: `${fullConversation}\nUser: ${userMessage}\nAssistant:` };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyContent)
        });

        if (!response.ok) {
            console.error("Error:", response.statusText);
            return "There was an error. Please try again later.";
        }

        const data = await response.json();
        return data.status === "success" ? data.text : "There was an error. Please try again later.";
    } catch (error) {
        console.error("Error:", error);
        return "There was an error. Please try again later.";
    }
}

// Function to create a message element
function createMessageElement(message, fromUser) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message");
    messageElement.classList.add(fromUser ? "user-message" : "assistant-message");
    messageElement.textContent = message;

    // Add right-click functionality for context menu
    messageElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        selectedMessage = messageElement;
        showContextMenu(event.pageX, event.pageY);
    });

    return messageElement;
}

// Function to clear all messages
function clearAllMessages() {
    const messages = document.querySelectorAll(".chat-message");
    messages.forEach((message) => {
        message.classList.add("shrink-effect");
        message.addEventListener("animationend", () => message.remove());
    });
    conversationHistory = []; // Reset conversation history
}

// Function to show the context menu
function showContextMenu(x, y) {
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.display = "block";
}

// Function to hide the context menu
function hideContextMenu() {
    contextMenu.style.display = "none";
}

// Event listener for Delete Message
deleteMessageOption.addEventListener("click", () => {
    if (selectedMessage) {
        selectedMessage.classList.add("shrink-effect");
        selectedMessage.addEventListener("animationend", () => selectedMessage.remove());
        selectedMessage = null;
    }
    hideContextMenu();
});

// Event listener for Delete All Messages
deleteAllMessagesOption.addEventListener("click", () => {
    clearAllMessages();
    hideContextMenu();
});

// Show context menu when right-clicking on the chatbox background
chatContent.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    selectedMessage = null; // No specific message is selected
    showContextMenu(event.pageX, event.pageY);
});

// Hide the context menu when clicking outside
document.addEventListener("click", (event) => {
    if (!contextMenu.contains(event.target)) {
        hideContextMenu();
    }
});

// Event listener for form submission
chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Display user message
    const userMessageElement = createMessageElement(userMessage, true);
    chatContent.appendChild(userMessageElement);

    // Add user message to conversation history
    conversationHistory.push({ sender: "User", message: userMessage });

    userInput.value = ""; // Clear input field

    // Fetch and display assistant response
    const botResponse = await fetchResponse(userMessage);
    const botMessageElement = createMessageElement(botResponse, false);
    chatContent.appendChild(botMessageElement);

    // Add assistant response to conversation history
    conversationHistory.push({ sender: "Assistant", message: botResponse });

    // Scroll to the bottom
    chatContent.scrollTop = chatContent.scrollHeight;
});

// Automatically focus on the input field when the page loads
userInput.focus();
