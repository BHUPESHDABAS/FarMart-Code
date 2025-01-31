const fs = require("fs");
const readline = require("readline");
const path = require("path");


async function extractLogs(date) {
    const inputFile = "./test_logs.log"; // Log file path
    const outputDir = "output";
    const outputFile = path.join(outputDir, `output_${date}.txt`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read the file
    const fileStream = fs.createReadStream(inputFile, { encoding: "utf-8" });
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const outputStream = fs.createWriteStream(outputFile, { encoding: "utf-8" });

    let matchCount = 0;

    console.log(`Extracting logs for ${date}...`);
    
    for await (const line of rl) {
        if (line.startsWith(date)) {
            outputStream.write(line + "\n");
            matchCount++;
        }
    }

    outputStream.end();
    console.log(`Extraction complete. Found ${matchCount} log entries.`);
    console.log(`Logs saved to ${outputFile}`);
}

//date argument from the command line
const dateArg = process.argv[2];
if (!dateArg || !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
    console.error("Usage: node extract_logs.js YYYY-MM-DD");
    process.exit(1);
}

extractLogs(dateArg).catch((err) => {
    console.error("Error processing the file:", err);
});
