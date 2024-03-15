import { Server } from "http";
import app from "./app";

const port = process.env.PORT || 3000;

async function main() {
    const server: Server = app.listen(port, () => {
        console.log(`Server is running on the ${port} Port`);
    })
}

main();