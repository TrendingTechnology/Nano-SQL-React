"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var nano_sql_1 = require("nano-sql");
function bindNSQL(Comp, props) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1(p) {
            var _this = _super.call(this, p) || this;
            _this.state = { data: {}, isLoading: true };
            _this.updateState = _this.updateState.bind(_this);
            return _this;
        }
        class_1.prototype.componentWillMount = function () {
            var _this = this;
            var prevTable = (props.store || nano_sql_1.nSQL()).sTable;
            props.tables.forEach(function (table) {
                (props.store || nano_sql_1.nSQL()).table(table).on("change", _this.updateState);
                _this.updateState({
                    table: table,
                    query: {
                        table: table,
                        action: null,
                        actionArgs: null,
                        state: "complete",
                        result: [],
                        comments: []
                    },
                    time: Date.now(),
                    notes: ["mount"],
                    result: [],
                    types: ["change"],
                    actionOrView: "",
                    affectedRows: []
                });
            });
            (props.store || nano_sql_1.nSQL()).table(prevTable);
        };
        class_1.prototype.componentWillUnmount = function () {
            var _this = this;
            var prevTable = (props.store || nano_sql_1.nSQL()).sTable;
            props.tables.forEach(function (table) {
                (props.store || nano_sql_1.nSQL()).table(table).off("change", _this.updateState);
            });
            (props.store || nano_sql_1.nSQL()).table(prevTable);
        };
        class_1.prototype.updateState = function (e) {
            var _this = this;
            this.setState({ isLoading: true }, function () {
                props.onChange(e, function (data) {
                    _this.setState({ isLoading: false, data: data });
                });
            });
        };
        class_1.prototype.render = function () {
            return React.createElement(Comp, __assign({ nSQLloading: this.state.isLoading, nSQLdata: this.state.data }, this.props));
        };
        return class_1;
    }(React.Component));
}
exports.bindNSQL = bindNSQL;
