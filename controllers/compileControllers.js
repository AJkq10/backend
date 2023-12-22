// controllers/compileController.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const async = require('async'); // Import the async library

const tempDir = path.join(__dirname, '..', 'temp');
const outputDir = path.join(__dirname, '..', 'output');

async function getData(req, res) {
    console.log('Received a request directly from:', req.ip);
    const data = {
      message: 'Hello from the backend!',
      timestamp: new Date().toISOString(),
    };
    res.json(data);
}
const compileQueue = async.queue((task, callback) => {
  console.log(task);
  const { Code, Language, Input, res } = task;
  const compilerCommand = getCompilerCommand(Language, Code, Input);
  console.log('Compiler Command:', compilerCommand);

  exec(compilerCommand, (error, stdout, stderr) => {
      if (error || stderr) {
          console.error(`Error: ${error ? error.message : stderr}`);
          res.status(500).json({ isError: 1, result: 'Compilation failed' });
      } else {
          const outputPath = path.join(outputDir, 'output.txt');
          const outputContent = fs.readFileSync(outputPath, 'utf8');
          res.json({ isError: 0, result: outputContent });
      }
      callback(); // Release the queue task
  });
}, 1); // Concurrency is set to 1 for synchronous processing

// Compile-time functionality
function compileCode(req, res) {
    console.log(req.body);
    const { Code, Language,Input } = req.body;    
    compileQueue.push({ Code, Language, Input, res });

    };


function getCompilerCommand(Language, Code,Input) {
  switch (Language) {
    case 1:
        // C++ logic (unchanged from your original code)
        const cppCodePath = path.join(tempDir, 'code.cpp');
        const cppInputPath = path.join(tempDir, 'input.txt');
        console.log('C++ Code Path:', cppCodePath);

        fs.writeFileSync(cppCodePath, Code);
        fs.writeFileSync(cppInputPath, Input);

        const cppCodeContent = fs.readFileSync(cppCodePath, 'utf-8');
        console.log('C++ Code Content:', cppCodeContent);

        return `g++ -o ${outputDir}/cpp_output ${cppCodePath} && ${outputDir}/cpp_output < ${cppInputPath} > ${outputDir}/output.txt`;

    case 2:
        const javaCodePath = path.join(tempDir, 'Main.java');
        const javaInputPath = path.join(tempDir, 'input.txt');
        console.log('Java Code Path:', javaCodePath);

        fs.writeFileSync(javaCodePath, Code);
        fs.writeFileSync(javaInputPath, Input);

        const javaCodeContent = fs.readFileSync(javaCodePath, 'utf-8');
        console.log('Java Code Content:', javaCodeContent);
        return `javac ${javaCodePath} && java -cp ${tempDir} Main < ${javaInputPath} > ${outputDir}/output.txt`;

    case 3:
        const pythonCodePath = path.join(tempDir, 'code.py');
        const pythonInputPath = path.join(tempDir, 'input.txt');
        console.log('Python Code Path:', pythonCodePath);

        fs.writeFileSync(pythonCodePath, Code);
        fs.writeFileSync(pythonInputPath, Input);

        const pythonCodeContent = fs.readFileSync(pythonCodePath, 'utf-8');
        console.log('Python Code Content:', pythonCodeContent);

        return `python ${pythonCodePath} < ${pythonInputPath} > ${outputDir}/output.txt`;

    default:
        throw new Error('Unsupported language');
}}

module.exports = {
    getData,
    compileCode,
};
