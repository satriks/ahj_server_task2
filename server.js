const Koa = require('koa')
const { koaBody } = require('koa-body')
// const { TicketFull } = require('./components/TicketFull')
const { Date } = require('core-js')
const cors = require('@koa/cors')
const fs = require('fs');
const path = require('path')
const koaStatic = require('koa-static')

const port = 7070
const app = new Koa()

console.log(new Date(Date.now()).toLocaleString())
app.use(koaBody({
  multipart: true
}))
app.use(cors())
app.use(koaStatic('./pic'))


const files = fs.readdirSync('./pic')
const dir = './pic/'
console.log(files, 'все файлы в папке');

// const stat = fs.statSync('./pic/' + files[0])
// console.log(stat.isFile());
// console.log(stat.isDirectory());
// console.log(stat.isSymbolicLink());
// console.log(stat.size / 1024000);


// GET
app.use(async (ctx, next) => {
  const { method } = ctx.request.query
  if (ctx.request.method === 'GET') {
    console.log(method);
    if (method === 'getimages'){
      ctx.response.body = JSON.stringify(fs.readdirSync('./pic'))
      return
    }
  }
  next()
})
// POST
app.use(async (ctx, next) => {
  const { method, name } = ctx.request.query
  if (ctx.request.method === 'POST') {
    if (method === 'addimage') {

      const {file} = ctx.request.files

      //TODO сделать проверку если файл уже есть 
      fs.copyFile(file.filepath, dir + file.originalFilename, (err) => {
        if (err) {
          console.error(err)
          return
        }
        return 
      })
      ctx.response.body = 'OK'
      return
    }
    if (method === 'removeimage') {
      //TODO проверить существует ли
     fs.unlink(dir + name, (err) => {
        if (err) {
          console.log(err);
          return 
        }
        return 
      })
      ctx.response.body = 'remove'
      return
    }

    ctx.response.status = 409
    ctx.response.body = `Method ${method} not found`
    return
  }

  next()
})


// another
app.use(async (ctx) => {
  ctx.response.status = 409
  ctx.response.body = 'not allow'
})

app.listen(port)
console.log('listen port ' + port)

// ---------------------------
// операции создания — создание ресурса через метод POST;

// операции чтения — возврат представления ресурса через метод GET;

// операции редактирования — перезапись ресурса через метод PUT или редактирование через PATCH;

// операции удаления — удаление ресурса через метод DELETE.
