const mongoose = require('mongoose');
const express = require('express');
const TaskModel = require('../MODELS/TaskModel');
const UserModel = require('../MODELS/UserModel');
const router = new express.Router();

//add a user and update his id in all of his tasks
router.post('/api/users',async(req,res)=>{
    try
    {
        const {task,id} = req.body;
        const user = new UserModel(req.body)
        await user.save()
        let updatedTasks = []
        for(el of task){
            try{
                const backTask = await TaskModel.find({"id":el});
                let backUsersOfBackTask = backTask[0].users;
                if(!backUsersOfBackTask.includes(id))
                {
                    backUsersOfBackTask.push(id)
                    updatedTasks += await TaskModel.findOneAndUpdate({"id":el},{users:backUsersOfBackTask},{new:true})
                }
                else
                {
                    console.log(`the task ${el}, has the user ${id}`);
                }               
                }
            catch
            {
                console.log(`there isn't this task: ${el}`);
            }
        }
        res.send(`add: ${user} the updated tasks: ${updatedTasks}`)
    }
    catch(err)
    {
        console.log(err.message);
        res.send(err.message)
    }
})

//display all users
router.get('/api/users',async(req,res)=>{
    try
    {
        const tasks =await UserModel.find({})
        res.send(tasks)
    }
    catch(err)
    {
        console.log(err);
    }
})

//update user
router.post('/api/updateUser/:id',async(req,res)=>{
    try
    {

        const {id} = req.params;
        await UserModel.findOneAndUpdate({id},req.body)
        res.send(`updated: ${await UserModel.find({id})}`)
    }
    catch(err)
    {
        res.send(`can't do this update`)
        console.log(err.message);
    }
})

//get an id of a user and dispay details of all his tasks
router.get('/api/users/returnTasks/:idUser',async(req,res)=>{
    try
    {
    const {idUser} = req.params;
    const back =  await UserModel.find({"id":idUser});
    const tasks = back[0].task // example:[1,2]
    let tasksOfUser = []
    for(el of tasks) {
        tasksOfUser.push(await TaskModel.find({"id":el})) 
        console.log(tasksOfUser);
    }
    res.send(tasksOfUser);
    }
    catch(err)
    {
        console.log(err.message);
    }
})

//a route to delete a user , check which tasks the user has and delete the user of all the tasks.
router.get('/api/deleteUser/:id',async(req,res)=>{
    try
    {
        const {id} = req.params;
        const back = await UserModel.find({id}).select("task")
        const tasks = back[0].task;
        for(task of tasks)
            {
            const theTask = await TaskModel.find({"id":task});
            const {users} = theTask[0];
            let nowUsers = users.filter((el)=>{return el!=id})
            await TaskModel.findOneAndUpdate({"id":task},{"users":nowUsers});
            }
        await UserModel.deleteOne({id})
        res.send(`now tasks : ${await TaskModel.find({})}`)
    }
    catch(err)
    {
        console.log(err.message);
    }
})

module.exports= router;