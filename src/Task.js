import { List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Task.css';

const Task = ({ taskText, onClick }) => {
    return (
        <List className="todo__list">
            <ListItem>
                <ListItemAvatar />
                <ListItemText primary={taskText} />
            </ListItem>
            <Button onClick={onClick} ></Button><DeleteIcon fontSize="large" style={{ opacity: 0.7 }} />
        </List>
    )
};

export default Task;
