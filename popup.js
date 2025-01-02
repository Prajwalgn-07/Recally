document.getElementById("ask-btn").addEventListener("click", async () => {
    const query = document.getElementById("user-query").value;
    if (!query) return;

    const responseContainer = document.getElementById("response-container");
    responseContainer.textContent = "Processing...";

    const response = await chrome.runtime.sendMessage({ type: "query_history", query });
    responseContainer.textContent = response || "No insights found.";
});