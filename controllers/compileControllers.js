// controllers/compileController.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
// Compile-time functionality
function compileCode(req, res) {
    console.log(req.body);
    const { Code, Language } = req.body;
    const compilerCommand = getCompilerCommand(Language, Code);
    console.log('Compiler Command:', compilerCommand); 

    exec(compilerCommand, (error, stdout, stderr) => {
        if (error || stderr) {
        console.error(`Error: ${error ? error.message : stderr}`);
        return res.status(500).json({ isError: 1, result: 'Compilation failed' });
        }
        const outputPath = path.join(outputDir, 'output.txt');
        const outputContent = fs.readFileSync(outputPath, 'utf8');
        res.json({ isError: 0, result: outputContent });
    });
}

function getCompilerCommand(Language, Code) {
    switch (Language) {
        case 1:
          const cppCodePath = path.join(tempDir, 'code.cpp');
          console.log('C++ Code Path:', cppCodePath); 
    
          fs.writeFileSync(cppCodePath, Code);
          const cppCodeContent = fs.readFileSync(cppCodePath, 'utf-8');
          console.log('C++ Code Content:', cppCodeContent);
          return `g++ -o ${outputDir}/cpp_output ${cppCodePath} && ${outputDir}/cpp_output > ${outputDir}/output.txt`;
    
        case 2:
          return `python -c "${Code}"`;
        default:
          throw new Error('Unsupported language');
      }}

module.exports = {
    getData,
    compileCode,
};
