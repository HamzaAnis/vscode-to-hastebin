"use strict";

// The module "vscode" contains the VS Code extensibility API
import { workspace as Workspace, window as Window, commands, ExtensionContext } from "vscode";
const clipboardy = require("clipboardy");
const axios = require("axios");
const extname = require("path").extname;
const config = Workspace.getConfiguration("vscode-to-hastebin");
const host = config.has("host") ? config.get("host") : "https://www.toptal.com/developers/hastebin";

// Activate extension for the first time
export function activate(context: ExtensionContext) {
    console.log("VS Code to Hastebin loaded");

    // Provide implimentation for command defined in "package.json"
    context.subscriptions.push(commands.registerCommand("vscodetohaste.share", shareOnHastebin));
}

// Main entry point for "vscodetohaste.share" command
function shareOnHastebin() {
    let content = readDocument();

    if (!content) {
        Window.showWarningMessage("Could not upload empty document.");

        return;
    }

    uploadText(content).then((response: any) => {
        handleLink(assembleLink(response.data.key));
    }).catch((error: any) => {
        Window.showErrorMessage("An error occurred when uploading to " + `${host}` + ": " + error.message);
    });
}

// Upload code to Hastebin and handle the resulting ID
function uploadText(code: string): Promise<any> {
    return axios.post(`${host}/documents`, code);
}

// Handle a link by copying it to clipboard, and sending notification
function handleLink(link: string) {
    clipboardy.write(link).then(() => {
        Window.showInformationMessage("URL copied to clipboard: " + link);
    }).catch((error: string) => {
        Window.showErrorMessage("An error occurred when writing to the clipboard: " + error);
    });
}

// Assemble a link from the Hastebin ID and file extension
function assembleLink(key: string): string {
    return `${host}/${key}${extname(Window.activeTextEditor.document.fileName)}`;
}

// Read the text from the current window's open document, or selection
function readDocument(): string {
    let code;

    if (!Window.activeTextEditor) {
        return;
    } else if (Window.activeTextEditor.selection.isEmpty) {
        code = Window.activeTextEditor.document.getText();
    } else {
        code = Window.activeTextEditor.document.getText(
            Window.activeTextEditor.selection
        );
    }

    return code;
}
