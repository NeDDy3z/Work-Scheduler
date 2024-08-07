function applyArguments(args) {
    try {
        for (i = 0; i < args.length; i++) {
            if (args[i].includes("--port")) {
                process.env.PORT = parseInt([i].split("=")[1]);
            }
            if (args[i].includes("--config")) {
                process.env.CONFIG_PATH = args[i].split("=")[1];
            }
            if (args[i] == "--no-login") {
                process.env.BYPASS_LOGIN = true;
            }
            if (args[i] == "--no-auth") {
                process.env.BYPASS_AUTH = true;
            }
        }
    } catch (e) {
        console.log("Error while applying arguments:", e);
    }

}



module.export = { applyArguments };