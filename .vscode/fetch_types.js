exports.execute = async (args) => {
    // args => https://egomobile.github.io/vscode-powertools/api/interfaces/contracts.workspacecommandscriptarguments.html

    // s. https://code.visualstudio.com/api/references/vscode-api
    const vscode = args.require('vscode');

    vscode.window.showInformationMessage(
        `Fetch types => '${ args.command }'!`
    );
};