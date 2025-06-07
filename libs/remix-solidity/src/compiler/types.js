export var CompilerRetriggerMode;
(function (CompilerRetriggerMode) {
    CompilerRetriggerMode[CompilerRetriggerMode["none"] = 0] = "none";
    CompilerRetriggerMode[CompilerRetriggerMode["retrigger"] = 1] = "retrigger";
})(CompilerRetriggerMode || (CompilerRetriggerMode = {}));
export const isFunctionDescription = (item) => item.stateMutability !== undefined;
export const isEventDescription = (item) => item.type === 'event';
//# sourceMappingURL=types.js.map