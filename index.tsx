import * as React from "react";
import { NanoSQLInstance, nSQL, DatabaseEvent } from "nano-sql";

export interface WithNSQLData {
    nSQLdata?: any;
    nSQLloading?: boolean;
}

export function bindNSQL<P extends WithNSQLData>(Comp: React.ComponentClass<P> | React.StatelessComponent<P>, tables: string[], onChange: (e: DatabaseEvent, complete: (any) => void) => void, store?: NanoSQLInstance): React.ComponentClass<P> {
    return class extends React.Component<P, {
        data: any;
        isLoading: boolean;
    }> {

        constructor(p) {
            super(p);
            this.state = {data: {}, isLoading: true};
            this.updateState = this.updateState.bind(this);
        }

        public componentWillMount() {
            const prevTable: any = (store || nSQL()).sTable;
            tables.forEach((table) => {
                (store || nSQL()).table(table).on("change", this.updateState);
                this.updateState({
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
                    notes: [],
                    result: [],
                    types: ["change"],
                    actionOrView: "",
                    affectedRows: []
                });
            });
            (store || nSQL()).table(prevTable);
        }

        public componentWillUnmount() {
            const prevTable: any = (store || nSQL()).sTable;
            tables.forEach((table) => {
                (store || nSQL()).table(table).off("change", this.updateState);
            });
            (store || nSQL()).table(prevTable);
        }

        public updateState(e: DatabaseEvent) {
            this.setState({isLoading: true}, () => {
                onChange(e, (data) => {
                    this.setState({isLoading: false, data: data});
                });
            })
        }

        public render() {
            return <Comp nSQLloading={this.state.isLoading} nSQLdata={this.state.data} {...this.props} />
        }
    }
}