import https from "https";
https.get("https://api.voicerss.org/?key=12345678901234567890123456789012&hl=en-us&src=Hello", (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => console.log("Response:", data.substring(0, 50)));
});
