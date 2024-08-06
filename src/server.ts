console.log("Connecting to server...");

const server = new WebSocket(new URL("https://backend.foreverplaced.net"));

server.onopen = () => {
    console.log("Connected to server!");
}

server.onmessage = (ev) => {
    console.log(ev.data);
}

server.onclose = (ev) => {
    postMessage({type: "error", code: ev.code, reason: ev.reason});
}