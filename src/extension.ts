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
function shareOnHastebin() {
    let content = readDocument();

    if (!content) {
        vscode.window.showWarningMessage("Could not upload empty document.")

        return;
    }

    uploadText(content).then((response: any) => {
        handleLink(assembleLink(response.data.key));
    }).catch((error: any) => {
        console.log(error);

        vscode.window.showErrorMessage("An error occurred when uploading to Hastebin: " + error.message);
    });
}

// Upload code to Hastebin and handle the resulting ID
function uploadText(code: string): Promise<any> {
    return axios.post("https://hastebin.com/documents", code);
}

// Handle a link by copying it to clipboard, and sending notification
function handleLink(link: string) {
    clipboardy.write(link).then(() => {
        vscode.window.showInformationMessage("URL copied to clipboard: " + link);
    }).catch((error: string) => {
        vscode.window.showErrorMessage("An error occurred when writing to the clipboard: " + error);
    });
}

// Assemble a link from the Hastebin ID and file extension
function assembleLink(key: string): string {
    return "https://hastebin.com/" + key +
        extname(vscode.window.activeTextEditor.document.fileName);
}

// Read the text from the current window's open document, or selection
function readDocument(): string {
    let code;

    if (!vscode.window.activeTextEditor) {
        return;
    } else if (vscode.window.activeTextEditor.selection.isEmpty) {
        code = vscode.window.activeTextEditor.document.getText();
    } else {
        code = vscode.window.activeTextEditor.document.getText(
            vscode.window.activeTextEditor.selection
        );
    }

    return code;
}
