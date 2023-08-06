import logo from './logo.svg';
import './App.css';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todolist:[],
      activeItem: {
        id:null,
        name:'',
        completed:false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.startEdit = this.startEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };

  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


  componentWillMount(){
    this.fetchTasks()
  }

  fetchTasks(){
    console.log("testing fetch....")

    fetch('http://127.0.0.1:8000/item-list/')
    .then(response => response.json())
    .then(data =>
      this.setState({
        todolist:data,
      })
      )
  }

  handleChange(e){
    var names = e.target.names
    var value = e.target.value
    console.log('Name:', names)
    console.log('value:', value)

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        name:value
      }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')
    
    var url = "http://127.0.0.1:8000/item-create/"

    if(this.state.editing == true){
      url = `http://127.0.0.1:8000/item-update/${ this.state.activeItem.id }/`
      this.setState({
        editing:false,
      })
    }

    fetch(url, {
      method:"POST",
      headers: {
        'content-type':'application/json',
        'X-CSRFToken': csrftoken
      },
      body:JSON.stringify(this.state.activeItem)
    }).then(( response) => {
        this.fetchTasks()
        this.setState({
          activeItem: {
            id:null,
            name:'',
            completed:false,
          }
        })

    }).catch(function(error){
      console.log('ERROR:', error)
    })
  }

  startEdit(item) {
    this.setState({
      activeItem:item,
      editing: true,
    })
  }

  deleteItem(item){
    var crsftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/item-delete/${item.id}/`, {
      method:"DELETE",
      headers: {
        'Content-Type':'application.json',
        'X-CSRFToken':crsftoken,
      }
    }).then((response) => {
      this.fetchTasks()
    })
  }

  strikeUnstrike(item) {
    item.completed = !item.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/item-update/${ item.id }/`

    fetch(url, {
      method:"POST",
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify({'completed': item.completed, 'name':item.name})
    }).then(() => {
      this.fetchTasks()
    })

    console.log("ITEM:", item.completed)
  }


  render () {
    var items = this.state.todolist
    var self = this
    return(
      <div className='container'>
        <div id='item-container'>
          <div id='form-wrapper'>
              <form onSubmit={this.handleSubmit} id='form'>
                <div className='flex-wrapper'>
                  <div style={{flex: 6}}>
                    <input onChange={this.handleChange} className='form-control' id='name' value={this.state.activeItem.name}type='text' name='name' placeholder='Enter name here'/>
                  </div>

                  <div style={{flex: 1}}>
                    <input id='submit' className='btn btn-warning' type='submit' name='Add'/>
                  </div>
                </div>
              </form>
          </div>
          <div id='list-wrapper'>
            {items.map(function(item, index){
              return (
                <div key={index} className='item-wrapper flex-wrapper'>
                  <div onClick={() => self.strikeUnstrike(item)} style={{flex: 7}}>
                    {item.completed == false ? (
                      <span>{item.name}</span>
                    ) : (
                      <strike>{item.name}</strike>
                    )} 
                  </div>

                  <div style={{flex: 1}}>
                    <button onClick={() => self.startEdit(item)} className='btn btn-sm btn-outline-info'>Edit</button>
                  </div>

                  <div style={{flex: 1}}>
                    <button onClick={() => self.deleteItem(item)} className='btn btn-sm btn-outline-dark delete'>-</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    ) 
  }
}

export default App;
