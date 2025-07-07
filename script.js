setInterval(() => {
  fetch('/last')
    .then(res => res.json())
    .then(data => {
      document.getElementById("message").innerText = data.message || "No message";
    });
}, 5000);
