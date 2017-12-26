# Nano-SQL-React
High Order Component for using [nanoSQL](https://nanosql.io/) with React

<img src="https://raw.githubusercontent.com/ClickSimply/Nano-SQL/master/logo.png" alt="nanoSQL Logo">

Easily lets you attach the rendering for your components to specific nanoSQL tables and queries.

Includes Typescript typings but still plays nice with Babel and ES5 projects.

## Installation
```
npm i nano-sql-react --save
```

## Usage

```ts
import { bindNSQL } from "nano-sql-stream";
import { DatabaseEvent } from "nano-sql";
import * as React from "react";

/*
Step 1: make your component as usual, just add the two additional props below.
*/
export class MyComponent extends React.Component<{
    nSQLdata: any; // optional prop holding the data from nSQL, you can type cast it as you please.
    nSQLloading: boolean // optional prop holding wether the nSQL data is in a loading state or not.
    anotherProp: any; // any other props you need...
}, {}> {

    render() {
        return this.props.nSQLloading ? "Loading..." : this.props.nSQLdata.message + this.props.anotherProp;
    }
}

/*
Step 2: In the parent component, call the bindNSQL function against a new variable, then pass in the arguments described.
*/
export class ParentComponnt extends React.Component<{}, {}> {

    public messageComponent: React.ComponentClass<P>;

    constructor(p) {
        super(p);
        this.messageComponent = bindNSQL(
            MyComponent,                  // Your base component
            ["tables", "to", "listen"],   // Tables to listen for changes on 
            (event: DatabaseEvent, complete: (data: any) => void) => { // function is called on each change, returns desired data.
                nSQL("table").query("select").exec().then((rows) => {
                    if (!rows.length) return;
                    // the argument passed into complete() will become this.props.nSQLdata in the child component
                    complete(rows[0]);
                });
            },
            myNSQLInstance // optional fourth argument, the NanoSQLInstance to use.  Uses global nSQL by default otherwise.
        )
    }

    return <this.messageComponent anotherProp={"something else"}>;
}

```
