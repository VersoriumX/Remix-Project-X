import { __awaiter } from "tslib";
// @ts-ignore
import { ethers } from "ethers";
export class SignerWithAddress extends ethers.Signer {
    static create(signer) {
        return __awaiter(this, void 0, void 0, function* () {
            return new SignerWithAddress(yield signer.getAddress(), signer);
        });
    }
    constructor(address, _signer) {
        super();
        this.address = address;
        this._signer = _signer;
        this.provider = _signer.provider;
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.address;
        });
    }
    signMessage(message) {
        return this._signer.signMessage(message);
    }
    signTransaction(transaction) {
        return this._signer.signTransaction(transaction);
    }
    sendTransaction(transaction) {
        return this._signer.sendTransaction(transaction);
    }
    connect(provider) {
        return new SignerWithAddress(this.address, this._signer.connect(provider));
    }
    _signTypedData(...params) {
        return this._signer._signTypedData(...params);
    }
    toJSON() {
        return `<SignerWithAddress ${this.address}>`;
    }
}
//# sourceMappingURL=signer.js.map