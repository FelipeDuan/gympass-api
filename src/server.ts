import { app } from "./app";

app
	.listen({
		host: "0.0.0.0",
		port: 3100,
	})
	.then(() => {
		console.log("HTTP Server running...");
	});
