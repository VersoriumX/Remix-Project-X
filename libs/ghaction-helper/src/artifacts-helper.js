import { __awaiter } from "tslib";
//@ts-ignore
import * as fs from 'fs/promises';
import * as path from 'path';
export function getArtifactsByContractName(contractIdentifier) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        const contractArtifacts = yield fs.readdir(global.remixContractArtifactsPath);
        let contract;
        for (const artifactFile of contractArtifacts) {
            //@ts-ignore
            const artifact = yield fs.readFile(path.join(global.remixContractArtifactsPath, artifactFile), 'utf-8');
            const artifactJSON = JSON.parse(artifact);
            const contractFullPath = (Object.keys(artifactJSON.contracts)).find((contractName) => artifactJSON.contracts[contractName] && artifactJSON.contracts[contractName][contractIdentifier]);
            contract = contractFullPath ? artifactJSON.contracts[contractFullPath][contractIdentifier] : undefined;
            if (contract)
                break;
        }
        return contract;
    });
}
//# sourceMappingURL=artifacts-helper.js.map