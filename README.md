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
    nSQLloading: boolean; // optional prop holding wether the nSQL data is in a loading state or not.
    anotherProp: any; // any other props you need...
}, {}> {

    render() {
        return this.props.nSQLloading ? "Loading..." : this.props.nSQLdata.message + this.props.anotherProp;
    }
}

/*
Step 2: In the parent component, call the bindNSQL function against a new variable.
Step 3. Pass in the arguments as described.
Step 4: Use the new variable as your component.
*/
export class ParentComponnt extends React.Component<{}, {}> {

    public messageComponent: React.ComponentClass<P>;

    constructor(p) {
        super(p);
        this.messageComponent = bindNSQL(MyComponent /* Your base component */, {
                // Tables to listen for changes on 
                tables: ["tables", "to", "listen"], 
                // function is called on each change, returns desired data.
                onChange: (event: DatabaseEvent, complete: (data: any) => void) => { 
                    nSQL("table").query("select").exec().then((rows) => {
                        if (!rows.length) return;
                        // whatever you pass into complete() will become this.props.nSQLdata in the child component
                        complete(rows[0]);
                    });
                },
                // optional, the NanoSQLInstance to use.  Uses global nSQL by default otherwise.
                store: myNSQLInstance              
            });
        )
    }

    return <this.messageComponent anotherProp={"something else"}>;
}

```

As an additional note, the onChange function will be called once on component mount to bring in any state from nanoSQL, then any subsequent onChange calls will be due to actual events from the database.

You can check to see if it's the first mount call by doing this check in the onChange function: `event.notes === ["mount"]`.  That will return `false` for all standard queries from nanoSQL but `true` for the first call on the component mount.