const mongoose = require('mongoose')
const express = require('express')
const TaskModel = require('../MODELS/TaskModel');
const UserModel = require('../MODELS/UserModel');
const { route } = require('express/lib/application');

const router = new express.Router();

//add a task and update the task in all of it's users.
router.post('/api/tasks',async(req,res)=>{
    try
    {
        const {users,id} = req.body;
        const task = new TaskModel(req.body)
        await task.save()
        let updatedUsers = []
        for(el of users){
            try{
               const backUser = await UserModel.find({"id":el});
               let backTasksOfBackUser = backUser[0].task;
               backTasksOfBackUser.push(id);
               updatedUsers += await UserModel.findOneAndUpdate({"id":el},{task:backTasksOfBackUser},{new:true})
                }
            catch{
                console.log(`there isn't this user: ${el}`);
            }
        }
        res.send(`add: ${task} the users where updated are: ${updatedUsers}`)

    }
    catch(err)
    {
        console.log(err.message);
        res.send(err.message)
    }
})

// //create a new task
// router.post('/api/tasks',async(req,res)=>{
//     try
//     {
//         const task = new TaskModel(req.body)
//         await task.save()
//         res.send(`completed add ${task}`)
//     }
//     catch(err)
//     {
//         console.log(err);
//     }
// })

//display all tasks
router.get('/api/tasks',async(req,res)=>{
   try
    {
        const tasks = await TaskModel.find({})
        res.send(`tasks are: ${tasks}`)
    }
    catch(err){
        console.log(err.message);
    }
})

//update a task
router.post('/api/updateTask/:id',async(req,res)=>{
    try
    {
        const{id} = req.params;
        const task = await TaskModel.findOneAndUpdate({id},req.body,{new:true})          
        res.send(`update task ${task}`)
        //why not do a catch error if there us not this task
    }
    catch(err)
    {
        console.log(err.message);
        res.send(`couldn't do this update`);
    }  
})

//get an id of task and return details of all users who work on it
router.get('/api/tasks/returnUsers/:idTask',async(req,res)=>{
    try
    {const {idTask} = req.params;
    const back =  await TaskModel.find({"id":idTask});
    const {users}= back[0] // example:[203537964,308362052]
    let HandlesTheTask = []
    for(user of users) {
        HandlesTheTask.push(await UserModel.find({"id":user})) 
        console.log(HandlesTheTask);
    }
    res.send(HandlesTheTask);}
    catch(err)
    {
        console.log(err.message);
    }
})

/**A path that accepts a user's id + a task's id and checks whether the user has this task, if any displays the task and announces that it already exists with the current user. If he does not find the task in the user, he adds it to his to-do list using its id. */
router.get('/api/tasks/:idUser/:idTask',async(req,res)=>{
    try
    {
        const {idUser,idTask} = req.params;
        const user = await UserModel.find({"id":idUser});
        const tasks = user[0].task;
        const theTask = await TaskModel.find({"id":idTask})
        tasks.includes(idTask)?
        res.send(`this user has this task: ${user}`):
        tasks.push(idTask)
        await UserModel.findOneAndUpdate({"id":idUser},{'task':tasks})
        const nowUser = await UserModel.find({"id":idUser});
        res.send( `the task updated by this user: ${nowUser}`)
    }
    catch(err)
    {
        console.log(err.message);
    }
})


//a route to delete a task , check which users the task has and delete the task of all the users.
router.get('/api/deleteTask/:idTask',async(req,res)=>{
    try
    {
        const {idTask} = req.params;
        const back = await TaskModel.find({"id":idTask}).select("users")
        const {users} = back[0];
        for(user of users)
            {
            const theUser = await UserModel.find({"id":user});
            const tasks = theUser[0].task;
            let nowTasks = tasks.filter((el)=>{return el!=idTask})
            await UserModel.findOneAndUpdate({"id":user},{"task":nowTasks});
            }
        await TaskModel.deleteOne({"id":idTask})
        res.send(`now users : ${await UserModel.find({})}`)
    }
    catch(err)
    {
        console.log(err.message);
        res.send(err.message)
    }
})

module.exports= router;