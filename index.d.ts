/// <reference types="react" />
import * as React from "react";
import { NanoSQLInstance, DatabaseEvent } from "nano-sql";
export interface WithNSQLData {
    nSQLdata?: any;
    nSQLloading?: boolean;
}
export declare function bindNSQL<P extends WithNSQLData>(Comp: React.ComponentClass<P> | React.StatelessComponent<P>, tables: string[], onChange: (e: DatabaseEvent, complete: (any) => void) => void, store?: NanoSQLInstance): React.ComponentClass<P>;
