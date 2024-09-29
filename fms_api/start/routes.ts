/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('login', 'Fms/AuthController.login')
Route.post('forgot_password', 'Fms/AuthController.forgot_password')
Route.post('reset-password', 'Fms/AuthController.updatePassword')
Route.post('register', 'Fms/AuthController.register')
Route.group(() =>{
    Route.get('myprofile', 'Fms/AuthController.myprofile')
    Route.post('update', 'Fms/AuthController.updateprofile')
}).prefix('/user').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/RequestsController.list')
    Route.post('/create', 'Fms/RequestsController.save')
}).prefix('/request').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/CampRequestsController.list')
    Route.post('/create', 'Fms/CampRequestsController.save')
}).prefix('/camp').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/CampMembersController.list')
    Route.post('/create', 'Fms/CampMembersController.save')
}).prefix('/camp/member').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/AuthController.listUser')
    Route.post('/create', 'Fms/AuthController.saveUser')
    Route.post('/update', 'Fms/AuthController.saveUser')
}).prefix('/fmt').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/AuthController.listUser')
    Route.post('/create', 'Fms/AuthController.saveUser')
    Route.post('/update', 'Fms/AuthController.saveUser')
}).prefix('/qrt').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/AuthController.listUser')
    Route.post('/create', 'Fms/AuthController.saveUser')
    Route.post('/update', 'Fms/AuthController.saveUser')
}).prefix('/camp/camp').middleware(['auth'])
Route.group(() => {
    Route.get('/list', 'Fms/AuthController.listUser')
    Route.post('/create', 'Fms/AuthController.saveUser')
    Route.post('/update', 'Fms/AuthController.saveUser')
}).prefix('/users').middleware(['auth'])

Route.get('/_qrt/all', 'Fms/AuthController.listUser')

