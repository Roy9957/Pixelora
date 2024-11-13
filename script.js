

const apiToken = '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';

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) throw new Error("𝑰𝒎𝒂𝒈𝒆 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒐𝒏 𝒇𝒂𝒊𝒍𝒆𝒅");

    const result = await response.blob();
    const imageURL = URL.createObjectURL(result);
    return imageURL;
}

async function generateImage() {
    const inputText = document.getElementById("inputText").value;
    if (inputText === "") {
        alert("𝑷𝒍𝒆𝒂𝒔𝒆 𝒆𝒏𝒕𝒆𝒓 𝒂 𝒅𝒆𝒔𝒄𝒓𝒊𝒑𝒕𝒊𝒐𝒏.");
        return;
    }

    const loadingIndicator = document.getElementById("loading");
    const progressBarContainer = document.getElementById("progressBarContainer");
    const progressBar = document.getElementById("progressBar");
    const retryButton = document.querySelector(".retry-button");
    const historyContainer = document.getElementById("history-container");

    loadingIndicator.style.display = "block";
    progressBarContainer.style.display = "block";
    retryButton.style.display = "none";

    let progress = 0;
    const interval = setInterval(() => {
        progress = Math.min(progress + 10, 90);
        progressBar.style.width = progress + "%";
    }, 500);

    try {
        const imageURL = await query({ "inputs": inputText });
        progressBar.style.width = "100%";
        clearInterval(interval);

        const imageContainer = document.getElementById("image-container");
        imageContainer.innerHTML = "";
        const imgElement = document.createElement("img");
        imgElement.src = imageURL;
        
        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑰𝒎𝒂𝒈𝒆";
        downloadBtn.className = "download-button";
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.href = imageURL;
            link.download = "generated_image.png";
            link.click();
        };

        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(downloadBtn);

        const historyImg = document.createElement("img");
        historyImg.src = imageURL;
        historyImg.style.marginTop = "10px";
        historyContainer.appendChild(historyImg);
        
    } catch (error) {
        console.error("𝑬𝒓𝒓𝒐𝒓 𝒈𝒆𝒏𝒆𝒓𝒂𝒕𝒊𝒏𝒈 𝒊𝒎𝒂𝒈𝒆:", error);
        alert("𝘍𝘢𝘪𝘭𝘦𝘥 𝘵𝘰 𝘨𝘦𝘯𝘦𝘳𝘢𝘵𝘦 𝘪𝘮𝘢𝘨𝘦. 𝘗𝘭𝘦𝘢𝘴𝘦 𝘵𝘳𝘺 𝘢𝘨𝘢𝘪𝘯.");
        retryButton.style.display = "inline-block";
    } finally {
        clearInterval(interval);
        loadingIndicator.style.display = "none";
        progressBarContainer.style.display = "none";
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    
    const icon = document.querySelector(".toggle-theme i");
    icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
    
    // Store the theme preference
    localStorage.setItem("theme", newTheme);
}

// Set initial theme from localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    
    const icon = document.querySelector(".toggle-theme i");
    icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
});
