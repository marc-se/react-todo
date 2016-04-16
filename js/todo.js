String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function getIndexForKey(arr, key) {
    for(var i = arr.length; i--;) {
        if(arr[i].key === key) {
            return i;
        }
    }
}

if(typeof(Storage) !== "undefined") {
    var storage = localStorage;
} else {
    var Warning = React.createClass({
        render: function() {
            return (
                <div>your browser is too old, sorry. update it or better: don´t user Internet Explorer!</div>
            );
        }
    });

    ReactDOM.render(<Warning />, app);
}

var TodoList = React.createClass({
    getInitialState: function() {
        var data = [];

        // get items from localStorage
        for (var i = 0; i < storage.length; i++) {
            data.push({"key": storage.key(i), "todo": storage.getItem(storage.key(i))});
        }

        return (
            {data}
        );
    },
    render: function() {

        return (
            <div className="container">
                <TodoItem data={this.state.data} />
            </div>
        );
    }
});

var TodoCount = React.createClass({
    render: function() {
        return (
            <span className="badge badge-pos animated bounceIn">{this.props.count}</span>
        );
    }
});

var TodoItem = React.createClass({
    addItem: function(item) {
        var hash = item.text.hashCode();
        var todoItems = this.props.data;
        storage.setItem(hash, item.text);
        todoItems.push({"key": hash ,"todo": storage.getItem(hash), "newItem": true});
        this.setState({data: todoItems});
    },
    render: function() {
        if (this.props.data.length != 0) {
            var listNodes = this.props.data.map(function(item) {
                return (
                    <li key={item.key} className={item.newItem ? "animated bounceIn": item.delete ? "animated bounceOut" : ""}>
                        {item.todo}&nbsp;
                        <DoneButton deleteItem={this.done.bind(null, item.todo, item.key)} />
                    </li>
                );
            }.bind(this));

            return (
            <div className="row list-wrapper">
                <div className="text-center row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 app-icon-wrapper">
                        <div className="app-icon-circle">
                            <TodoCount count={this.props.data.length} />
                            <span className="glyphicon glyphicon-inbox app-icon animated bounceIn"></span>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                </div>
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <div>
                        <h1 className="text-center">Get it done!</h1>
                    </div>
                    <div className="arrow-box">
                        <h2 className="text-center">Hey, seems like you have something to do</h2>
                    </div>
                    <ul className="todo-list">
                        {listNodes}
                    </ul>
                    <TodoInput add={this.addItem} />
                </div>
                <div className="col-md-2"></div>
            </div>
            );
        } else {
            return (
                <div className="row list-wrapper">
                    <div className="text-center row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6 app-icon-wrapper">
                            <div className="app-icon-circle">
                                <TodoCount count={this.props.data.length} />
                                <span className="glyphicon glyphicon-inbox app-icon animated bounceIn"></span>
                            </div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <div>
                            <h1 className="text-center">Get it done!</h1>
                        </div>
                        <div className="arrow-box extra-margin">
                            <h2 className="text-center">Yay, nothing to do!</h2>
                        </div>
                        <TodoInput add={this.addItem} />
                    </div>
                    <div className="col-md-2"></div>
                </div>
            );
        }
   },
    done: function(item, key) {
        storage.removeItem(key);

        var listNodes = this.props.data;

        var index = getIndexForKey(listNodes, key);
        listNodes[index].delete = true;
        listNodes[index].newItem = false;
        this.setState({data: listNodes});

        setTimeout(function() {
            listNodes.splice(index, 1);

            this.setState({data: listNodes});
        }.bind(this), 600, listNodes, index);

    }
});

var DoneButton = React.createClass({
   render: function() {
       return (
           <button className="glyphicon glyphicon-remove" type="button" onClick={this.props.deleteItem}></button>
       )
   }
});

var TodoInput = React.createClass({
    getInitialState: function() {
      return {text: ""};
    },
    handleTextInput: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();

        var input = this.state.text.trim();

        if (!input) {
            return;
        }

        this.props.add({text: input});
        this.setState({text: ""});
    },
    render: function() {
        return (
           <form id="form" onSubmit={this.handleSubmit}>
               <div className="form-group">
                   <div className="input-group">
                       <span className="input-group-btn">
                           <button className="btn btn-default" type="submit" value="add">add new item</button>
                       </span>
                       <input className="form-control" value={this.state.text} type="text" placeholder="what should I add?" onChange={this.handleTextInput} />
                   </div>
               </div>
           </form>
       );
   }
});

var app = document.getElementById("app");
ReactDOM.render(<TodoList />, app);