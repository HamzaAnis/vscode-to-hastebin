"use strict";

// The module "vscode" contains the VS Code extensibility API
import * as vscode from "vscode";
const clipboardy = require("clipboardy");
const axios = require("axios");
const extname = require("path").extname;

// Activate extension for the first time
export function activate(context: vscode.ExtensionContext) {
    console.log("VS Code to Hastebin loaded");

    // Provide implimentation for command defined in "package.json"
    context.subscriptions.push(vscode.commands.registerCommand("vscodetohaste.share", shareOnHastebin));
}

// Main entry point for "vscodetohaste.share" command
export function shareOnHastebin() {
    let content = readDocument();

    if (!content) {
        return;
    } else {
        uploadCode(content);
    }
}

// Upload code to Hastebin and handle the resulting ID
export function uploadCode(code: string) {
    axios.post("https://hastebin.com/documents", code)
        .then((response: any) => {
            handleLink(response.data.key);
        })
        .catch((error: any) => {
            console.log(error);

            vscode.window.showWarningMessage("Share Code Hastebin: " + error.message);
        });
}

// Handle a link by assembling a URL, copying it to clipboard, and sending notification
export function handleLink(key: string) {
    let url: string = "https://hastebin.com/" + key + extname(vscode.window.activeTextEditor.document.fileName);

    clipboardy.write(url)
        .then(() => {
            vscode.window.showInformationMessage("URL copied to clipboard: " + url);
        })
        .catch((error: string) => {
            vscode.window.showErrorMessage("An error occurred when accessing the clipboard: " + error);
        });
}

// Read the text from the current window's open document, or selection
export function readDocument(): string {
    let code;

    if (!vscode.window.activeTextEditor) {
        return;
    } else if (!vscode.window.activeTextEditor.selection.isEmpty) {
        code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
    } else {
        code = vscode.window.activeTextEditor.document.getText();
    }

    return code;
}
