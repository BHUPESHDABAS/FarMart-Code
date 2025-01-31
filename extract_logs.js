const fs = require("fs"); 
const readline = require("readline"); 
const path = require("path"); 


async function extractLogsForDate(date) {
    const logFilePath = "logs_2024.log"; 
    const outputDirectory = "output"; 
    const outputFilePath = path.join(outputDirectory, `extracted_logs_${date}.txt`); 

    // Check if output directory exists, else create
    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
    }

    
    const logFileStream = fs.createReadStream(logFilePath, { encoding: "utf-8" });
    const logReader = readline.createInterface({ input: logFileStream, crlfDelay: Infinity });
    const outputFileStream = fs.createWriteStream(outputFilePath, { encoding: "utf-8" });

    let logEntriesFound = 0; 

    console.log(`Starting the extraction of logs for the date: ${date}...`);

    
    for await (const logLine of logReader) {
        // If the line starts with the specified date, it's a match
        if (logLine.startsWith(date)) {
            outputFileStream.write(logLine + "\n"); 
            logEntriesFound++; 
        }
    }

    
    outputFileStream.end();

   
    console.log(`Extraction complete! Found ${logEntriesFound} matching log entries.`);
    console.log(`The extracted logs have been saved to: ${outputFilePath}`);
}


const dateArg = process.argv[2];


if (!dateArg || !/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
    console.error("Usage: node extract_logs.js YYYY-MM-DD");
    process.exit(1); 
}


extractLogsForDate(dateArg).catch((err) => {
    console.error("An error occurred while processing the log file:", err);
});
