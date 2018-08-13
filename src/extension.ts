'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { platform } from 'os';
import { exec, spawn } from 'child_process';
const axios = require('axios');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('VsCode To HasteBin Loaded');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vscodetohaste.share', () => {
        shareonhastebin();
    });

    context.subscriptions.push(disposable);
}

export function shareonhastebin() {
    let content = readWindow();
    if (!content) {
        return;
    } else {
        uploadCode(content);

    }
}

export function uploadCode(code: string) {
    axios.post('https://hastebin.com/documents', code)
        .then(function (response: any) {
            handleLink(response.data.key);
        })
        .catch(function (error: any) {
            console.log(error);
            vscode.window.showWarningMessage("Share Code Hastebin: " + error.message);
        });
}

export function handleLink(key: string) {
    let url: string = "https://hastebin.com/" + key;
    writeToClipboard(url);
    vscode.window.showInformationMessage("URL copied to clipboard: " + url);
}


function writeToClipboard(url: string): void {
    var platform: any = process ? process.platform : platform();
    var cmd;
    if (platform === "win32") {
        cmd = { command: "clip", args: [] };
    }
    else if (platform === "darwin") {
        cmd = { command: "pbcopy", args: [] };
    }
    else {
        cmd = { command: "xclip", args: ["clipboard"] }
    }
    try {
        var copyProcess = spawn(cmd.command, cmd.args);

        copyProcess.stdin.write(url);
        copyProcess.stdin.end();
    } catch (error) {
        vscode.window.showWarningMessage("Unable to acess clipboard" + error.message);
    }
}

export function readWindow(): string {
    var code;
    if (!vscode.window.activeTextEditor) {
        return;
    } else if (!vscode.window.activeTextEditor.selection.isEmpty) {
        code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection);
    } else {
        code = vscode.window.activeTextEditor.document.getText();
    }
    return code;
}

// this method is called when your extension is deactivated
export function deactivate() {
}