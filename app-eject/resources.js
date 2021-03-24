// initalize the server (now accessible via localhost:1234)
// using http bridge to serve connections

httpBridge.start(5561, "http_service", (request) => {
  // you can use request.url, request.type and request.postData here
  if (request.type === "GET" && request.url.split("/")[1] === "users") {
    httpBridge.respond(
      request.requestId,
      200,
      "application/json",
      '{"message": "OK"}'
    );
  } else {
    httpBridge.respond(
      request.requestId,
      400,
      "application/json",
      '{"message": "Bad Request"}'
    );
  }
});
