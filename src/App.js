import React, { useState, useEffect } from "react";

import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import DeleteIcon from "@material-ui/icons/Delete";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { auth, db } from "./firebase";

export function App(props) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [new_task, setNewTask] = useState("");
  const [new_priority, setPriority] = useState("");

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

    if (user) {
      unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("tasks")
        .onSnapshot(snapshot => {
          const updated_tasks = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            updated_tasks.push({
              text: data.text,
              checked: data.checked,
              id: doc.id,
              priority: data.priority
            });
          });
          setTasks(updated_tasks);
        });
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

  const handleEnterPressed = event => {
    if (event.key === "Enter") {
      db.collection("users")
        .doc(user.uid)
        .collection("tasks")
        .add({ text: new_task, checked: false })
        .then(() => {
          setNewTask("");
        });
    }
  };

  const handleAddTask = () => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .add({ text: new_task, checked: false, priority: null })
      .then(() => {
        setNewTask("");
        setPriority("");
      });
  };

  const handleDeleteTask = task_id => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .delete();
  };
  const handleCheckTask = (checked, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ checked: checked });
  };
  const handleNewPriority = (priority, task_id) => {
    db.collection("users")
      .doc(user.uid)
      .collection("tasks")
      .doc(task_id)
      .update({ priority: priority });
  };

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
      <div style={{ display: "flex", justifyContent: "center", marginTop: 30 }}>
        <Paper style={{ width: 700, padding: 30 }}>
          <Typography variant="h6">To Do List</Typography>
          <div style={{ display: "flex", marginTop: 30 }}>
            <TextField
              style={{ marginRight: 30 }}
              fullWidth={true}
              placeholder="Add a new task here"
              value={new_task}
              onChange={e => {
                setNewTask(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddTask}
              onKeyDown={handleEnterPressed}
            >
              ADD
            </Button>
          </div>

          <List style={{ MarginTop: 30 }}>
            {" "}
            Incomplete Tasks
            {tasks.map(value => {
              console.log(value);
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value.id}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={value.checked}
                      onChange={e => {
                        handleCheckTask(e.target.checked, value.id);
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={value.text} />
                  <ListItemSecondaryAction>
                    <FormControl style={{ width: 90 }}>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        value={value.priority}
                        onChange={e => {
                          handleNewPriority(e.target.value, value.id);
                        }}
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Mid">Mid</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                    </FormControl>

                    <IconButton
                      onClick={() => {
                        handleDeleteTask(value.id);
                      }}
                    >
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
