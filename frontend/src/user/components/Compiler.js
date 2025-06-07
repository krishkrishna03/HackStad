import React, { useState, useRef } from "react";
import { Box, Button, Menu, MenuItem, Typography, Select, MenuItem as MuiMenuItem, InputLabel, FormControl } from "@mui/material";
import { Editor } from "@monaco-editor/react";
import axios from "axios";

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

const CODE_SNIPPETS = {
    javascript: `function greet(name) {
      console.log("Hello, " + name + "!");
    }
  
    greet("HackStad");`,
    
    typescript: `type Params = {
      name: string;
    }
  
    function greet(data: Params) {
      console.log("Hello, " + data.name + "!");
    }
  
    greet({ name: "HackStad" });`,
    
    python: `def greet(name):
      print("Hello, " + name + "!")
  
    greet("HackStader")`,
    
    java: `public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello World");
      }
    }`,
    
    csharp: `using System;
  
    namespace HelloWorld {
      class Hello { 
          static void Main(string[] args) {
              Console.WriteLine("Hello World in C#");
          }
      }
    }`,
    
    php: `<?php
    $name = 'Alex';
    echo $name;
    ?>`,
  };
  

  const LanguageSelector = ({ language, onSelect }) => {
    return (
      <Box
        sx={{
          marginLeft: 2,
          marginBottom: 4,
          backgroundColor: "#1c1c2b", // Contrasting background color
          padding: 2,
          borderRadius: 1,
          border: "1px solid #333", // Border to separate from background
        }}
      >
        <Typography variant="h6" mb={2} color="white">
          Select Language:
        </Typography>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>Language</InputLabel>
          <Select
            label="Language"
            value={language}
            onChange={(e) => onSelect(e.target.value)}
            sx={{
              backgroundColor: "#2c2c3c", // Dropdown background
              color: "white", // Text color
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#555", // Outline color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#777", // Outline color on hover
              },
            }}
          >
            {Object.keys(LANGUAGE_VERSIONS).map((lang) => (
              <MuiMenuItem key={lang} value={lang}>
                {lang}
              </MuiMenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };
  

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      setIsError(true);
      setOutput(["Error: Unable to execute the code."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "50%" }}>
      <Typography variant="h6" mb={2}>
        Output
      </Typography>
      <Button
        variant="outlined"
        color="success"
        sx={{ marginBottom: 4 }}
        onClick={runCode}
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Code"}
      </Button>
      <Box
        sx={{
          height: "75vh",
          padding: 2,
          border: "1px solid",
          borderRadius: 1,
          borderColor: isError ? "red" : "#333",
          color: isError ? "red" : "inherit",
        }}
      >
        {output ? output.map((line, i) => <Typography key={i}>{line}</Typography>) : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onSelect = (newLanguage) => {
    setLanguage(newLanguage);
    setValue(CODE_SNIPPETS[newLanguage]);
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ width: "50%" }}>
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            height="600px" // Fixed height to avoid ResizeObserver errors
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </Box>
        <Output editorRef={editorRef} language={language} />
      </Box>
    </Box>
  );
};

function Compiler() {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0f0a19", color: "gray", padding: 4 }}>
      <CodeEditor />
    </Box>
  );
}

export default Compiler;
