import https from "https";

https.get("https://api.voicerss.org/?key=f149c49a9bf8446c16ddf8b703d23b04076d9009&hl=en-us&src=Hello", (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data.substring(0, 100)); // might be binary
  });
});
