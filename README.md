# Nano-SQL-React
High Order Component for using [nanoSQL](https://nanosql.io/) with React

<img src="https://raw.githubusercontent.com/ClickSimply/Nano-SQL/master/logo.png" alt="nanoSQL Logo">

Easily lets you attach the rendering for your components to specific nanoSQL tables and queries.

Automatically handles bindin and unbinding event listeners, triggering changes and returning them to your component.

## Examples
- [Super Minimal CodePen](https://codepen.io/clicksimply/pen/jYVdwr)
- [Complete Todo App](https://www.nanosql.io/react-todo/)

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
    anotherProp: any; // all the normal props I need
    nSQLdata: any; // holds data from nanoSQL
    nSQLloading: boolean; // if a query is pending
}, {}> {

    render() {
        return this.props.nSQLloading ? 
        "Loading..." : 
        this.props.nSQLdata.message + this.props.anotherProp;
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
        this.messageComponent = bindNSQL(MyComponent, {
            // Tables to listen for changes on 
            tables: ["tables", "to", "listen"], 
            // function is called on each change
            onChange: (event: DatabaseEvent, complete: (data: any) => void) => { 
                nSQL("table").query("select").exec().then((rows) => {
                    if (!rows.length) return;
                    // whatever you pass into complete() 
                    // will become this.props.nSQLdata in the child component
                    complete({message: rows[0].message});
                });
            },
            // Optional, the NanoSQLInstance to use. 
            // Uses global nSQL by default otherwise.
            store: myNSQLInstance              
        });
    }

    render() {
        return <this.messageComponent anotherProp={"something else"} />;
    }
}

```

As an additional note, the onChange function will be called once on component mount to bring in any state from nanoSQL, then any subsequent onChange calls will be due to actual events from the database.

You can check to see if it's the first mount call by doing this check in the onChange function: `event.notes === ["mount"]`.  That will return `false` for all standard queries from nanoSQL but `true` for the first call on the component mount.