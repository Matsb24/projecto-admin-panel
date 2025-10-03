import Task from "../models/task.models.js";

export const createTask = async(req,res) => {
   const { title, description, date} = req.body;

   const newTask = new Task({
        title,
        description,
        date
   });
   //con await basta pero para q este pintado
   const savedTask=await newTask.save();
   res.json(savedTask);
};

export const readTasks = async(req,res) => {
    const tasks = await Task.find();
    res.json(tasks);
};

export const readTask = async(req,res) => {
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({messagge:"Tarea no encontrada"});

    res.json(task);
};

export const updateTask = async(req,res) => {
    const task = await Task.findByIdAndUpdate(req,params.id,req.body, {
        new:true
    })
    if(!task) return res.status(404).json({messagge:"Tarea no encontrada"})
        res.json(Task);
};

export const deleteTask = async(req,res) => {
    const task = await Task.findByIdAndDelete(req.params.id)
    if(!task) return res.status(404).json({messagge: "Tarea no encontrada"})
        return res.sendStatus(204);
};