import * as React from "react";
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client';

import { Combatants } from './combatants';
import { InitiativeList } from "./initiativelist";

const combatantList = ["Alven", "Ankan", "Draken", "Dvärgen", "Mannen", "Vargen"];

type AppProps = {}

type AppState = {
    data: any[],
    count: number
}

class App extends React.Component<AppProps, AppState>{

    constructor(props: any) {
        super(props);
        this.state = { data: [], count: 0 }
    }

    public componentDidMount(): void {
        console.log("Component did mount");
        const ws = new WebSocket("ws://localhost:8000/ws");
        ws.onmessage = this.onMessage;
        setInterval(() => {
            console.log("Sending echo");
            ws.send('echo')
        }, 1000);
    }


    public render() {
        console.log("Foo");
        /*
        return (<div className="container text-center">
            <div className="row align-items-start">
                <div className="col">
                    <InitiativeList combatants={combatantList} shift={true} />
                </div>
                <div className="col">
                    <Combatants combatants={combatantList} />
                </div>
            </div>
        </div>);*/
        return (<div>{this.state.count}</div>)
    }


    onMessage = (ev: { data: string; }) => {
        console.log("Recieved message");
        const recv = JSON.parse(ev.data);
        const { data, count } = this.state;
        let newData = [...data];

        if (count > 20) {
            newData = newData.slice(1);
        }

        newData.push({ value: recv.value, index: count });
        this.setState({ data: newData, count: count + 1 })
    }
}

const domContainer = document.getElementById("initiativeTracker");
//const root = ReactDOMClient.createRoot(domContainer!);

//export default App;

/*root.render(
    (new App({})).render()
);*/
ReactDOM.render(<App />, document.getElementById('initiativeTracker') as HTMLElement);
