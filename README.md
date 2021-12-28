// ormconfig.json
//TypeORM 会读取这个数据库配置进行连接
// database 就是我们刚刚创建的 koa 数据库
// synchronize 设为 true 能够让我们每次修改模型定义后都能自动同步到数据库*（如果你接触过其他的 ORM 库，其实就是自动数据迁移）*
// entities 字段定义了模型文件的路径，我们马上就来创建