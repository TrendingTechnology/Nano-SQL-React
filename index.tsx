import * as React from "react";
import { NanoSQLInstance, nSQL, DatabaseEvent } from "nano-sql";

export interface WithNSQLData {
    nSQLdata?: any;
    nSQLloading?: boolean;
}

export function bindNSQL<P extends WithNSQLData>(Comp: React.ComponentClass<P> | React.StatelessComponent<P>, props: {
    tables: string[], 
    onChange: (e: DatabaseEvent, complete: (any) => void) => void, 
    store?: NanoSQLInstance
}): React.ComponentClass<P> {
    return class extends React.Component<P, {
        data: any;
        isLoading: boolean;
    }> {

        constructor(p) {
            super(p);
            this.state = {data: undefined, isLoading: true};
            this.updateState = this.updateState.bind(this);
        }

        public componentWillMount() {
            const prevTable: any = (props.store || nSQL()).sTable;
            props.tables.forEach((table) => {
                (props.store || nSQL()).table(table).on("change", this.updateState);
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
                    notes: ["mount"],
                    result: [],
                    types: ["change"],
                    actionOrView: "",
                    affectedRows: []
                });
            });
            (props.store || nSQL()).table(prevTable);
        }

        public componentWillUnmount() {
            const prevTable: any = (props.store || nSQL()).sTable;
            props.tables.forEach((table) => {
                (props.store || nSQL()).table(table).off("change", this.updateState);
            });
            (props.store || nSQL()).table(prevTable);
        }

        public updateState(e: DatabaseEvent) {
            this.setState({isLoading: true}, () => {
                props.onChange(e, (data) => {
                    this.setState({isLoading: false, data: data});
                });
            })
        }

        public render() {
            return <Comp nSQLloading={this.state.isLoading} nSQLdata={this.state.data} {...this.props} />
        }
    }
}