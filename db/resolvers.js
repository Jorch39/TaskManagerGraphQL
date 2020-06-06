const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' })

//Crea y firma un JWT 
const createToken = (user, secret, expiresIn) => {
    const { id, email, name } = user;
    console.log(user)
    return jwt.sign({ id, email, name }, secret, { expiresIn })
}


const resolvers = {
    Query: {
        getProjects: async (_, {}, ctx) => {
            const projects = await Project.find({ created_by: ctx.user.id})
            return projects;
        },

        getTasks: async (_, {input}, ctx) => {
            const tasks = await Task.find({ created_by: ctx.user.id}).where('project').equals(input.project);
            return tasks;
        }
    },

    Mutation: {
        createUser: async (_, {input}) => {
            
            const { email, password } = input;

            const getUser = await User.findOne({ email })
            
            //Si el usuario existe 
            if (getUser) {
                throw new Error('El usuario ya existe');
            }

            try {

                //Hashear password 
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);

                const user = new User (input);
                user.save();

                return "Usuario creado correctamente"

            } catch (error) {
                console.log(error)
            }
        }, 
        authenticateUser: async (_, {input}) => {
            const { email, password } = input;

            const getUser = await User.findOne({ email })

            //Si el usuario existe 
            if (!getUser) {
                throw new Error('El usuario no existe');
            }

            //Si el password es correcto 
            const getPassword = await bcryptjs.compare(password, getUser.password)

            if (!getPassword) {
                throw new Error('El password es incorrecto');
            }

            //Garantizar acceso 
            return {
                token: createToken(getUser,process.env.SECRET,'2hr')
            }

        }, 
        createProject: async (_, {input}, ctx) => {
            try {
                const project = new Project(input);

                //Asociar el creador 
                project.created_by = ctx.user.id;

                //Almacenarlo en la BD
                const result = await project.save();

                return result;

            } catch (error) {
                console.log(error)
            }
        },
        updateProject: async (_, {id, input}, ctx) => {
            //Revisar si el proyecto existe 
            let project = await Project.findById(id);

            if(!project) {
                throw new Error('Proyecto no encontrado')
            }

            //Revisar el creador 
            if(project.created_by.toString() !== ctx.user.id){
                throw new Error('No puedes actualizar este proyecto')
            }

            //Guardar el proyecto 
            project = await Project.findOneAndUpdate({ _id:id }, input, { new: true });
            return project;
        }, 
        deleteProject: async (_, {id}, ctx) =>  {
            //Revisar si el proyecto existe 
            let project = await Project.findById(id);

            if(!project) {
                throw new Error('Proyecto no encontrado')
            }

            //Revisar el creador 
            if(project.created_by.toString() !== ctx.user.id){
                throw new Error('No puedes actualizar este proyecto')
            }

            //Eliminar un proyecto 
            await Project.findOneAndDelete({ _id : id });
            return "Proyecto eliminado correctamente";

        }, 

        createTask: async (_, {input}, ctx) => {
            try {
                const task = new Task(input);

                //Asociar el creador 
                task.created_by = ctx.user.id;

                //Almacenarlo en la BD
                const result = await task.save();

                return result;

            } catch (error) {
                console.log(error)
            }
        },
        updateTask: async (_, {id, input, state}, ctx) => {
            //Revisar si la tarea existe 
            let task = await Task.findById(id);

            if(!task) {
                throw new Error('Tarea no encontrado')
            }

            //Revisar el creador 
            if(task.created_by.toString() !== ctx.user.id){
                throw new Error('No puedes actualizar esta tarea')
            }

            //Asignar a estado 
            input.state = state;

            //Guardar la tarea
            task = await Task.findOneAndUpdate({ _id:id }, input, { new: true });
            return task;
        }, 
        deleteTask: async (_, {id}, ctx) =>  {
            //Revisar si el proyecto existe 
            let task = await Task.findById(id);

            if(!task) {
                throw new Error('Tarea no encontrada')
            }

            //Revisar el creador 
            if(task.created_by.toString() !== ctx.user.id){
                throw new Error('No puedes actualizar este proyecto')
            }

            //Eliminar un proyecto 
            await Task.findOneAndDelete({ _id : id });
            return "Tarea eliminada correctamente";

        }
    }
};

module.exports = resolvers;