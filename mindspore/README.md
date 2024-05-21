
# Mindspore

将使用 Mindspore 部署的非标大语言模型接口，统一转换成 OpenAI 兼容的标准接口。

**查看[Mock Server 代码](./mindspore/mock-mindspore-server.js)**

## 快速开始

### 🧑‍💻 本地运行

1. 克隆仓库
   
   ```sh
   git clone https://github.com/inf-monkeys/llm-toolbox.git
   ```

2. 切换到 `mindspore` 目录

   ```sh
   cd mindspore
   ```

3. 安装 Node 依赖

   ```sh
   yarn
   ```

4. 运行 MindSpore Mock 服务（可选）

   ```sh
   node mock-mindspore-server.js
   ```

5. 运行 OpenAI 标准接口服务

   ```sh
   node openai-compatible-server.js
   ```

### 🐳 Docker

#### Build Docker 镜像 

1. 克隆仓库
   
   ```sh
   git clone https://github.com/inf-monkeys/llm-toolbox.git
   ```

2. 切换到 `mindspore` 目录

   ```sh
   cd mindspore
   ```

3. 构建镜像

   ```sh
   docker build . -t infmonkeys/mindspore-openai-competible-server:latest
   ```

4. 运行容器

   ```sh
   docker run --name mindspore-openai-competible-server -d -v ./config.yaml:/usr/src/app/config.yaml -p 8000:8000 infmonkeys/mindspore-openai-competible-server:latest 
   ```

## 接口

接口特点：

- 输入只有 `inputs` 字段，对于多轮对话的场景，需要手动拼接为上下文的格式，参考 [https://github.com/baichuan-inc/Baichuan2/blob/main/README_EN.md](https://github.com/baichuan-inc/Baichuan2/blob/main/README_EN.md) 的 Instruction Following 部分。
- 流式接口和非流式接口是分开的。

## 配置文件

```yaml
mindspore:
  host: http://127.0.0.1:61170
  model: baichuan2
  parameters:
    do_sample: "False"
    top_p: "0.8"
    top_k: "1"
    return_full_text: "True"

  chatCompletionsConvert:
    template: "用户: {userMessage}\nBaichuan 2: {assistantMessage}\n"

#   chatCompletionsConvert:
#     prepend: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\nYou are a helpful assistant.<|eot_id|>\n"
#     template: "<|start_header_id|>user<|end_header_id|>{userMessage}<|eot_id|><|start_header_id|>assistant<|end_header_id|>{assistantMessage}<|eot_id|>\n"
```

其中 `chatCompletionsConvert.template`: 拼接 OpenAI 标准格式的 messages 到 Mindspore inputs 的模版，如 `"用户: {userMessage}\nBaichuan 2: {assistantMessage}\n"`：

如 `messages` 为：

```json
[
    {
        "role": "user",
        "content": "Hello"
    },
    {
        "role": "assistant",
        "content": "Hello, How can i assist you today?"
    },
    {
        "role": "user",
        "content": "Tell me a joke"
    },
]
```

将会转换为:

```txt
用户: Hello

Baichuan 2: Hello, How can i assist you today?

用户: Tell me a joke
```

## 原始非流式接口

### 请求形式

```sh
curl 127.0.0.1:61170/models/baichuan2/generate -X POST -d '{"inputs":"先有鸡还是先有蛋？","parameters":{"max_new_tokens":1000, "do_sample":"False","top_p":"0.8","top_k":"1","return_full_text":"True"}}' -H 'Content-Type: application/json'
```

### 响应数据示例

```json
{"generated_text": "这是一个经典的哲学问题，被称为“鸡与蛋的问题”。关于这个问题，科学家们和哲学家们有不同的看法。有些科学家认为，在鸡的进化过程中，一定有一个“第一只鸡”，这个鸡是由某种已经存在的物种通过进化而来的。而哲学家们则认为，这个问题没有绝对的答案，因为它涉及到因果关系的理解。总的来说，这个问题没有确切的答案，因为它涉及到生物学、进化论和哲学等多个领域。", "finish_reason": "eos", "generated_tokens": 89, "prefill": [{"id": 14314, "logprob": 38.51716232299805, "special": false, "text": "这是一个"}], "seed": 0, "tokens": [{"id": 14314, "logprob": 38.51716232299805, "special": false, "text": "这是一个"}, {"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}, {"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}, {"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}, {"id": 65, "logprob": 67.6875, "special": false, "text": "，"}, {"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}, {"id": 92360, "logprob": 37.625, "special": false, "text": "“"}, {"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}, {"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}, {"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}, {"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}, {"id": 92361, "logprob": 20.625, "special": false, "text": "”"}, {"id": 66, "logprob": 71.0, "special": false, "text": "。"}, {"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}, {"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}, {"id": 65, "logprob": 58.03125, "special": false, "text": "，"}, {"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}, {"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}, {"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}, {"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}, {"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}, {"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}, {"id": 66, "logprob": 79.0625, "special": false, "text": "。"}, {"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}, {"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}, {"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}, {"id": 65, "logprob": 44.375, "special": false, "text": "，"}, {"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}, {"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}, {"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}, {"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}, {"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}, {"id": 65, "logprob": 55.21875, "special": false, "text": "，"}, {"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}, {"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}, {"id": 92360, "logprob": 25.125, "special": false, "text": "“"}, {"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}, {"id": 92617, "logprob": 29.5, "special": false, "text": "只"}, {"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}, {"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}, {"id": 65, "logprob": 51.09375, "special": false, "text": "，"}, {"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}, {"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}, {"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}, {"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}, {"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}, {"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}, {"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}, {"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}, {"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}, {"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}, {"id": 66, "logprob": 28.484375, "special": false, "text": "。"}, {"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}, {"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}, {"id": 92414, "logprob": 51.125, "special": false, "text": "们"}, {"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}, {"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}, {"id": 65, "logprob": 59.78125, "special": false, "text": "，"}, {"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}, {"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}, {"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}, {"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}, {"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}, {"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}, {"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}, {"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}, {"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}, {"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}, {"id": 66, "logprob": 67.125, "special": false, "text": "。"}, {"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}, {"id": 65, "logprob": 12.265625, "special": false, "text": "，"}, {"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}, {"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}, {"id": 92701, "logprob": 38.5, "special": false, "text": "确"}, {"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}, {"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}, {"id": 65, "logprob": 19.296875, "special": false, "text": "，"}, {"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}, {"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}, {"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}, {"id": 69, "logprob": 71.3125, "special": false, "text": "、"}, {"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}, {"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}, {"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}, {"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}, {"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}, {"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}, {"id": 66, "logprob": 71.375, "special": false, "text": "。"}, {"id": 2, "logprob": 61.3125, "special": true, "text": ""}], "top_tokens": [[{"id": 14314, "logprob": 38.51716232299805, "special": false, "text": "这是一个"}]], "details": null}
```

## 原始 stream 流式接口

### 请求形式

```sh
curl 127.0.0.1:61170/models/baichuan2/generate_stream -X POST -d '{"inputs":"先有鸡还是先有蛋？","parameters":{"max_new_tokens":1000, "do_sample":"False","top_p":"0.8","top_k":"1","return_full_text":"True"}, "stream":"True"}' -H 'Content-Type: application/json'
```

### 响应数据示例

> 其中如何 `finish_reason` 为 `eos`，表示输出完毕。

```json
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这是一个", "tokens": {"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}, "top_tokens": [{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "经典的", "tokens": {"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}, "top_tokens": [{"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学", "tokens": {"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}, "top_tokens": [{"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "问题", "tokens": {"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}, "top_tokens": [{"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 67.6875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 67.6875, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "被称为", "tokens": {"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}, "top_tokens": [{"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "“", "tokens": {"id": 92360, "logprob": 37.625, "special": false, "text": "“"}, "top_tokens": [{"id": 92360, "logprob": 37.625, "special": false, "text": "“"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "与", "tokens": {"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}, "top_tokens": [{"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "蛋", "tokens": {"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}, "top_tokens": [{"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "的问题", "tokens": {"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}, "top_tokens": [{"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "”", "tokens": {"id": 92361, "logprob": 20.625, "special": false, "text": "”"}, "top_tokens": [{"id": 92361, "logprob": 20.625, "special": false, "text": "”"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 71.0, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 71.0, "special": false, "text": "。"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "关于", "tokens": {"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}, "top_tokens": [{"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个问题", "tokens": {"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}, "top_tokens": [{"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 58.03125, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 58.03125, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "科学家们", "tokens": {"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}, "top_tokens": [{"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "和", "tokens": {"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}, "top_tokens": [{"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学家", "tokens": {"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}, "top_tokens": [{"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "们", "tokens": {"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}, "top_tokens": [{"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "有不同的", "tokens": {"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}, "top_tokens": [{"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "看法", "tokens": {"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}, "top_tokens": [{"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 79.0625, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 79.0625, "special": false, "text": "。"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "有些", "tokens": {"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}, "top_tokens": [{"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "科学家", "tokens": {"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}, "top_tokens": [{"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "认为", "tokens": {"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}, "top_tokens": [{"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 44.375, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 44.375, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "在", "tokens": {"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}, "top_tokens": [{"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "的", "tokens": {"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}, "top_tokens": [{"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "进化", "tokens": {"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}, "top_tokens": [{"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "过程中", "tokens": {"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}, "top_tokens": [{"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 55.21875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 55.21875, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "一定", "tokens": {"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}, "top_tokens": [{"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "有一个", "tokens": {"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}, "top_tokens": [{"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "“", "tokens": {"id": 92360, "logprob": 25.125, "special": false, "text": "“"}, "top_tokens": [{"id": 92360, "logprob": 25.125, "special": false, "text": "“"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "第一", "tokens": {"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}, "top_tokens": [{"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "只", "tokens": {"id": 92617, "logprob": 29.5, "special": false, "text": "只"}, "top_tokens": [{"id": 92617, "logprob": 29.5, "special": false, "text": "只"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "”", "tokens": {"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}, "top_tokens": [{"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 51.09375, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 51.09375, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个", "tokens": {"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}, "top_tokens": [{"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "是由", "tokens": {"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}, "top_tokens": [{"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "某种", "tokens": {"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}, "top_tokens": [{"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "已经", "tokens": {"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}, "top_tokens": [{"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "存在的", "tokens": {"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}, "top_tokens": [{"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "物种", "tokens": {"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}, "top_tokens": [{"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "通过", "tokens": {"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}, "top_tokens": [{"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "进化", "tokens": {"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}, "top_tokens": [{"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "而来的", "tokens": {"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}, "top_tokens": [{"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 28.484375, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 28.484375, "special": false, "text": "。"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "而", "tokens": {"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}, "top_tokens": [{"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学家", "tokens": {"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}, "top_tokens": [{"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "们", "tokens": {"id": 92414, "logprob": 51.125, "special": false, "text": "们"}, "top_tokens": [{"id": 92414, "logprob": 51.125, "special": false, "text": "们"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "则", "tokens": {"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}, "top_tokens": [{"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "认为", "tokens": {"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}, "top_tokens": [{"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 59.78125, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 59.78125, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个问题", "tokens": {"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}, "top_tokens": [{"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "没有", "tokens": {"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}, "top_tokens": [{"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "绝对的", "tokens": {"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}, "top_tokens": [{"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "答案", "tokens": {"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}, "top_tokens": [{"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "因为它", "tokens": {"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}, "top_tokens": [{"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "涉及到", "tokens": {"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}, "top_tokens": [{"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "因果", "tokens": {"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}, "top_tokens": [{"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "关系的", "tokens": {"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}, "top_tokens": [{"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "理解", "tokens": {"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}, "top_tokens": [{"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 67.125, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 67.125, "special": false, "text": "。"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "总的来说", "tokens": {"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}, "top_tokens": [{"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 12.265625, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 12.265625, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个问题", "tokens": {"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}, "top_tokens": [{"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "没有", "tokens": {"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}, "top_tokens": [{"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "确", "tokens": {"id": 92701, "logprob": 38.5, "special": false, "text": "确"}, "top_tokens": [{"id": 92701, "logprob": 38.5, "special": false, "text": "确"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "切的", "tokens": {"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}, "top_tokens": [{"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "答案", "tokens": {"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}, "top_tokens": [{"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 19.296875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 19.296875, "special": false, "text": "，"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "因为它", "tokens": {"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}, "top_tokens": [{"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "涉及到", "tokens": {"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}, "top_tokens": [{"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "生物学", "tokens": {"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}, "top_tokens": [{"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "、", "tokens": {"id": 69, "logprob": 71.3125, "special": false, "text": "、"}, "top_tokens": [{"id": 69, "logprob": 71.3125, "special": false, "text": "、"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "进化", "tokens": {"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}, "top_tokens": [{"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "论", "tokens": {"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}, "top_tokens": [{"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "和", "tokens": {"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}, "top_tokens": [{"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学", "tokens": {"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}, "top_tokens": [{"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "等多个", "tokens": {"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}, "top_tokens": [{"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "领域", "tokens": {"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}, "top_tokens": [{"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 71.375, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 71.375, "special": false, "text": "。"}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "", "tokens": {"id": 2, "logprob": 61.3125, "special": true, "text": ""}, "top_tokens": [{"id": 2, "logprob": 61.3125, "special": true, "text": ""}]}]}
{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这是一个经典的哲学问题，被称为“鸡与蛋的问题”。关于这个问题，科学家们和哲学家们有不同的看法。有些科学家认为，在鸡的进化过程中，一定有一个“第一只鸡”，这个鸡是由某种已经存在的物种通过进化而来的。而哲学家们则认为，这个问题没有绝对的答案，因为它涉及到因果关系的理解。总的来说，这个问题没有确切的答案，因为它涉及到生物学、进化论和哲学等多个领域。", "finish_reason": "eos", "generated_tokens": 89, "prefill": [{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}], "seed": 0, "tokens": [{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}, {"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}, {"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}, {"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}, {"id": 65, "logprob": 67.6875, "special": false, "text": "，"}, {"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}, {"id": 92360, "logprob": 37.625, "special": false, "text": "“"}, {"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}, {"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}, {"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}, {"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}, {"id": 92361, "logprob": 20.625, "special": false, "text": "”"}, {"id": 66, "logprob": 71.0, "special": false, "text": "。"}, {"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}, {"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}, {"id": 65, "logprob": 58.03125, "special": false, "text": "，"}, {"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}, {"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}, {"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}, {"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}, {"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}, {"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}, {"id": 66, "logprob": 79.0625, "special": false, "text": "。"}, {"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}, {"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}, {"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}, {"id": 65, "logprob": 44.375, "special": false, "text": "，"}, {"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}, {"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}, {"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}, {"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}, {"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}, {"id": 65, "logprob": 55.21875, "special": false, "text": "，"}, {"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}, {"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}, {"id": 92360, "logprob": 25.125, "special": false, "text": "“"}, {"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}, {"id": 92617, "logprob": 29.5, "special": false, "text": "只"}, {"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}, {"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}, {"id": 65, "logprob": 51.09375, "special": false, "text": "，"}, {"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}, {"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}, {"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}, {"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}, {"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}, {"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}, {"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}, {"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}, {"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}, {"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}, {"id": 66, "logprob": 28.484375, "special": false, "text": "。"}, {"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}, {"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}, {"id": 92414, "logprob": 51.125, "special": false, "text": "们"}, {"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}, {"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}, {"id": 65, "logprob": 59.78125, "special": false, "text": "，"}, {"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}, {"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}, {"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}, {"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}, {"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}, {"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}, {"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}, {"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}, {"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}, {"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}, {"id": 66, "logprob": 67.125, "special": false, "text": "。"}, {"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}, {"id": 65, "logprob": 12.265625, "special": false, "text": "，"}, {"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}, {"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}, {"id": 92701, "logprob": 38.5, "special": false, "text": "确"}, {"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}, {"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}, {"id": 65, "logprob": 19.296875, "special": false, "text": "，"}, {"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}, {"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}, {"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}, {"id": 69, "logprob": 71.3125, "special": false, "text": "、"}, {"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}, {"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}, {"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}, {"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}, {"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}, {"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}, {"id": 66, "logprob": 71.375, "special": false, "text": "。"}, {"id": 2, "logprob": 61.3125, "special": true, "text": ""}], "top_tokens": [[{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}]]}]}
```