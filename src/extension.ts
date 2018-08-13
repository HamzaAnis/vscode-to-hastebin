'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as http from 'http';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-to-hastebin" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vscodetohaste.share', () => {
        shareonhastebin();
    });

    context.subscriptions.push(disposable);
}

export function shareonhastebin() {
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World!');
    let content = readWindow();
    if(!content){
        return;
    }else{
        try {
            uploadCode(content);
        } catch (error) {
            vscode.window.showWarningMessage("Share Code Hastebin: " + error.message);
        }
    }
    console.log(content);
}
var options = {
    host: "hastebin.com",
    path: "/documents",
    method: "POST"
};
export function uploadCode(code:string){
    var request = http.request(options, function (response: http.IncomingMessage) {
        response.setEncoding("utf8");
    });
    
    request.on("error", function (e) {
        throw e;        
    });
    request.write(code);
    request.end();
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