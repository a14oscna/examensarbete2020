import React from 'react';
import ReactDOM from 'react-dom';

function CreateTableHead(props) {
    if (props.head.length < 1) return null;
    
    const thead = props.head;
    const hRow = thead.map((item, index) =>
        <th 
            onClick={() => props.sortData(item)} 
            key={index}>
            {item}
        </th>
    );
    return (                  
        <thead>
            <tr>
                {hRow}
            </tr>
        </thead>
    );
};

function CreateTableBody(props) {
    if (props.body.length < 1) return null;  
    
    const tbody = props.body.filter(x => { 
        for (let val in x) {
            if (typeof(x[val]) === "string") {
                if (x[val].toUpperCase().indexOf(props.filter.toUpperCase()) !== -1) return true;
            } 
            else {
                if (x[val].toString().indexOf(props.filter) !== -1) return true;
            }          
        } 
        return false;      
    });
    const bRow = tbody.map((item, index) => {
        return <tr key={index}>
            {Object.keys(item).map((key) => {
                return <td key={key+index} >{item[key]}</td>;
            })}
        </tr>
    });
    return (    
        <tbody>
                {bRow}
        </tbody>
    );             
};

class Artifact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataHead: [],
            dataBody: [],
            filterString: ''
        };
        this.getFile = this.getFile.bind(this);
        this.sortData = this.sortData.bind(this);
        this.updateSearch = this.updateSearch.bind(this)
        this.sortedColumn = "Bolagsnamn";
        this.reverseOrder = true;
    }

    updateSearch(event) {
        this.setState({filterString: event.target.value});
    }

    sortData(column) {
        this.reverseOrder = (this.sortedColumn === column) ? !this.reverseOrder : false;
        this.sortedColumn = column;

        this.setState({
            dataBody: this.state.dataBody.sort((a,b) => {
                let x, y;

                if(typeof(a[column]) === "string" && typeof(b[column]) === "string") {
                    x = a[column].toUpperCase();
                    y = b[column].toUpperCase();
                }
                else{
                    x = a[column];
                    y = b[column];
                }

                if(this.reverseOrder) {
                    return (x < y) ? 1 : -1;  
                }
                else {
                    return (x > y) ? 1 : -1;   
                }            
            })
        });     
    }

    getFile (e) {
        var rowSize = 1000;
        var file = e.target.files[0];
        var reader = new FileReader();
        
        function parseNumbers (s) {
            if (s === "") return s;
            return parseFloat(s);
        };
        
        if (file) {
            reader.readAsText(file);         
            
            reader.onload = (e) => {               
                var csv = e.target.result;
                var data = window.Papa.parse(csv, {
                    header : true, 
                    preview: rowSize,
                    complete: function(result){
                        result.data.forEach(x => {
                            x.Kursutveckling = parseNumbers(x.Kursutveckling);
                            x.PE = parseNumbers(x.PE);
                            x.PS = parseNumbers(x.PS);
                            x.PB = parseNumbers(x.PB);
                        });
                    }
                });      
                this.setState({
                    dataHead: data.meta.fields,
                    dataBody: data.data
                });                    
            };
        }
    }

    render() {
        return (
            <div>
                <h1 id="start">React version 16.13.1</h1>
                <span id="sortRandom">sort</span>
                <span id="filterRandom">filter</span>
                <div>
                    <input 
                        type="file" 
                        onChange={this.getFile} 
                        accept=".csv" 
                    />
                </div>          
                <label htmlFor="searchBox">
                    Sök: 
                    <input 
                        type="text" 
                        id="searchBox" 
                        value={this.state.filterString} 
                        onChange={this.updateSearch} 
                    />
                </label>
                <table>
                    <CreateTableHead 
                        head={this.state.dataHead}
                        sortData={this.sortData}
                    />
                    <CreateTableBody 
                        body={this.state.dataBody}
                        filter={this.state.filterString}
                    />
                </table>
            </div>
        );
    }
}

ReactDOM.render(<Artifact />, document.getElementById('root'));