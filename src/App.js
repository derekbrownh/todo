import React, { useState, useEffect } from "react";

import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';

import { auth, db } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] =useState([]);
  const [new_task,setNewTask] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
      // do something
    });

    return unsubscribe;
  }, [props.history]);

  useEffect(() => {
    let unsubscribe;

      if (user){
        unsubscribe = db.collection('users').doc(user.uid).collection('tasks').onSnapshot((snapshot) => {
          const updated_tasks = [];
          snapshot.forEach((doc) => {
            const data = doc.data()
            updated_tasks.push({text: data.text, checked: data.checked, id: doc.id})
          })
        setTasks(updated_tasks)
        })
      }
    return unsubscribe;
  }, [user]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch(error => {
        alert(error.message);
      });
  };

  const handleAddTask = () => {
    db.collection('users').doc(user.uid).collection('tasks').add({text: new_task, checked: false}).then(()=>{
      setNewTask("")
    })

  };
  const handleDeleteTask = (task_id) => {
    db.collection('users').doc(user.uid).collection('tasks').doc(task_id).delete()
  }
  const handleCheckTask = (checked, task_id) => {
    db.collection('users').doc(user.uid).collection('tasks').doc(task_id).update({checked: checked})
  }

  if (!user) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar style={{ display: "flex" }}>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginleft: 30 }}
          >
            To Do List
          </Typography>
          <Typography color="inherit" style={{ marginRight: 30 }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <div style = {{display: "flex", justifyContent : "center",  marginTop : 30}}>
      <Paper style = {{width: 700, padding: 30}}>
        <Typography variant = 'h6'>To Do List</Typography>
        <div style = {{display: "flex", marginTop: 30}}>
          <TextField 
            style = {{marginRight: 30}}
            fullWidth = {true} 
            placeholder = "Add a new task here"
            value = {new_task}
            onChange = {(e) =>{setNewTask(e.target.value)}}
          />
          <Button variant="contained" color="primary" onClick = {handleAddTask}>ADD</Button>
        </div>  
       

        <List>
      {tasks.map(value => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem key={value.id}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                // checked={checked.indexOf(value) !== -1}
                checked= {value.checked}
                onChange = {(e, checked) =>{
                  handleCheckTask(checked, value.id)
                }}
              />
            </ListItemIcon>
            <ListItemText primary={value.text} />
            <ListItemSecondaryAction>
              <IconButton onClick ={() => {handleDeleteTask(value.id)}}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
      </Paper>
      </div>
    </div>
  );
}
