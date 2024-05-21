# 多大语言模型聚合服务

## 配置文件 

在配置文件中指定每个模型对于的服务地址：

```yaml
models:
  - model:
      - gpt-3.5-turbo
      - gpt-4
    host: https://api.openai.com
  - model: baichuan2
    host: http://47.95.20.242:3000
```

## 快速开始

### 🧑‍💻 本地运行

1. 克隆仓库
   
   ```sh
   git clone https://github.com/inf-monkeys/llm-toolbox.git
   ```

2. 切换到 `aggregated-llm-server` 目录

   ```sh
   cd aggregated-llm-server
   ```

3. 安装 Node 依赖

   ```sh
   yarn
   ```

4. 启动服务

   ```sh
   node index.js
   ```

### 🐳 Docker

1. 克隆仓库
   
   ```sh
   git clone https://github.com/inf-monkeys/llm-toolbox.git
   ```

2. 切换到 `aggregated-llm-server` 目录

   ```sh
   cd aggregated-llm-server
   ```

3. 构建镜像

   ```sh
   docker build . -t infmonkeys/aggregated-llm-server:latest
   ```

4. 运行容器

   ```sh
   docker run --name aggregated-llm-server -d -v ./config.yaml:/usr/src/app/config.yaml -p 8000:8000 infmonkeys/aggregated-llm-server:latest 
   ```
