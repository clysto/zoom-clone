# 2020-2021秋季学期计算机网络课程设计

## 成员

| 姓名   | 学号       |
| ------ | ---------- |
| 毛亚琛 | 9173011613 |
| 王宇航 | 9173011818 |
| 杨弋宸 |  32117127  |

## 简介

使用JavaScript仿照zoom设计一个在线视频通话的全栈应用。

## 开发

### 安装环境

首先安装Nodejs环境，[下载地址](https://nodejs.org/zh-cn/)

### 换npm源

打开控制台输入下面指令：

```
npm config set registry https://registry.npm.taobao.org
```

### 安装dependencies

进入zoom-clone根目录，输入下面指令：

```
npm install
```

### 配置开发环境变量

仿照`.env.example`文件在根目录下新建一个`.env`文件，由于其中含有数据库密码等敏感信息，具体填写内容在群里发布。由于我直接在阿里云部署了mongodb数据库，不需要在自己本机安装数据库，填写好`.env`文件后会远程连接到数据库。

```
DB_USER=<数据库用户>
DB_PWD=<数据库密码>
DB_URL=<数据库URL>
DB_NAME=<数据库名称>
PORT=<HTTP端口>
```

### 运行

开发模式下使用下面指令，在你的代码更改后会自动重启服务器。

```
npm run dev
```

部署后使用下面指令。

```
npm run start
```


## 分支

master分支用于发布，每个人在自己的分支开发。

1. `myc`: 毛亚琛
2. `wyh`: 王宇航
3. `yyc`: 杨弋宸

```bash
# 切换到myc分支
git checkout myc
# 查看所有分支
git branch
```

在自己的分支开发并提交到自己的分支后push到GitHub，然后提交PR经过审核后会才会被合并到master分支。
