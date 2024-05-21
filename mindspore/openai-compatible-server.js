const express = require("express");
const app = express();
const yaml = require("yaml");
const axios = require("axios");
const port = 8001;
const fs = require("fs");

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection: ", err);
});

process.on("uncaughtException", (err) => {
  console.error("uncaughtException: ", err);
});

const configYamlFile = "./config.yaml";
if (!fs.existsSync(configYamlFile)) {
  console.error(`Config file ${configYamlFile} does not exist.`);
  process.exit(1);
}

const config = yaml.parse(fs.readFileSync(configYamlFile, "utf8"));
const mindSporeHost = config.mindspore?.host;

if (!mindSporeHost) {
  console.error("Mindspore host is not defined in the config file.");
  process.exit(1);
}

const mindSporeParameters = config.mindspore?.parameters || {
  do_sample: "False",
  top_p: "0.8",
  top_k: "1",
  return_full_text: "True",
};

const chatCompletionsConvert = config.mindspore?.chatCompletionsConvert;
const chatCompletionsTemplate =
  chatCompletionsConvert?.template ||
  "用户: {userMessage}\nAssitant: {assistantMessage}\n";
const prepend = chatCompletionsConvert?.prepend || "";

// 使用JSON中间件解析请求体
app.use(express.json());

const convertMessagesToInputs = (messages) => {
  let formattedString = prepend;
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      let userMessage = messages[i].content;
      let assistantMessage = "";

      if (i + 1 < messages.length && messages[i + 1].role === "assistant") {
        assistantMessage = messages[i + 1].content;
        i++; // Skip the next message as it has been processed
      }

      formattedString += chatCompletionsTemplate
        .replace("{userMessage}", userMessage)
        .replace("{assistantMessage}", assistantMessage);
    }
  }

  return formattedString;
};

app.post("/v1/chat/completions", async (req, res) => {
  const { messages, stream = false, model, max_tokens = 1000 } = req.body;
  console.log("Request body: ", req.body);
  if (!model) {
    res.status(400).json({ error: "Model is required." });
    return;
  }
  if (stream) {
    res.setHeader("content-type", "text/event-stream");
    res.status(201);
    const api = `${mindSporeHost}/models/${model}/generate_stream`;
    const body = {
      inputs: convertMessagesToInputs(messages),
      parameters: {
        ...mindSporeParameters,
        max_new_tokens: max_tokens,
      },
      stream: "True",
    };
    console.log("Request mindspore api: ", api);
    console.log("Args: ", JSON.stringify(body));
    const response = await axios({
      url: api,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      responseType: "stream",
    });
    const randomChatCmplId =
      "chatcmpl-" + Math.random().toString(36).substr(2, 16);
    response.data.on("data", (chunk) => {
      chunk = chunk.toString();
      try {
        chunk = JSON.parse(chunk);
        const { data: chunkData } = chunk;
        const { generated_text, finish_reason } = chunkData[0];
        if (finish_reason === "eos") {
          const openaiChunkData = {
            id: randomChatCmplId,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model: model,
            system_fingerprint: null,
            choices: [
              {
                index: 0,
                delta: { content: "" },
                logprobs: null,
                finish_reason: 'stop',
              },
            ],
          };
          res.write(`data: ${JSON.stringify(openaiChunkData, null, 0)}\n\n`);
          res.write("data: [DONE]\n\n");
          res.end();
        } else {
          const openaiChunkData = {
            id: randomChatCmplId,
            object: "chat.completion.chunk",
            created: Math.floor(Date.now() / 1000),
            model: model,
            system_fingerprint: null,
            choices: [
              {
                index: 0,
                delta: { content: generated_text },
                logprobs: null,
                finish_reason: null,
              },
            ],
          };
          res.write(`data: ${JSON.stringify(openaiChunkData, null, 0)}\n\n`);
        }
      } catch (error) {
        console.warn("Error parsing chunk data: ", error);
      }
    });
  } else {
    res.setHeader("content-type", "application/json");
    res.status(201);
    const api = `${mindSporeHost}/models/${model}/generate`;
    const body = {
      inputs: convertMessagesToInputs(messages),
      parameters: {
        ...mindSporeParameters,
        max_new_tokens: max_tokens,
      },
      stream: "False",
    };
    console.log("Request mindspore api: ", api);
    console.log("Args: ", JSON.stringify(body));
    const response = await axios({
      url: api,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
    const { data } = response;
    const generated_text = data.generated_text;
    const openaiData = {
      choices: [
        {
          finish_reason: "stop",
          index: 0,
          logprobs: null,
          message: {
            content: generated_text,
            role: "assistant",
          },
        },
      ],
      created: 1715877703,
      id: "chatcmpl-" + Math.random().toString(36).substr(2, 16),
      model: model,
      object: "chat.completion",
      system_fingerprint: null,
      usage: {
        completion_tokens: undefined,
        prompt_tokens: undefined,
        total_tokens: undefined,
      },
    };
    res.json(openaiData);
  }
});

app.post("/v1/completions", async (req, res) => {
  const { prompt, stream = false, model, max_tokens = 1000 } = req.body;
  if (!model) {
    res.status(400).json({ error: "Model is required." });
    return;
  }
  if (stream) {
    res.setHeader("content-type", "text/event-stream");
    res.status(201);
    const api = `${mindSporeHost}/models/${model}/generate_stream`;
    const body = {
      inputs: prompt,
      parameters: {
        ...mindSporeParameters,
        max_new_tokens: max_tokens,
      },
      stream: "True",
    };
    console.log("Request mindspore api: ", api);
    console.log("Args: ", JSON.stringify(body));
    const response = await axios({
      url: api,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      responseType: "stream",
    });
    const randomChatCmplId =
      "chatcmpl-" + Math.random().toString(36).substr(2, 16);
    response.data.on("data", (chunk) => {
      chunk = chunk.toString();
      try {
        chunk = JSON.parse(chunk);
        const { data: chunkData } = chunk;
        const { generated_text, finish_reason } = chunkData[0];
        if (finish_reason === "eos") {
          const openaiChunkData = {
            id: randomChatCmplId,
            object: "text_completion",
            created: Math.floor(Date.now() / 1000),
            model: model,
            choices: [
              {
                text: "",
                index: 0,
                finish_reason: 'stop',
                logprobs: null,
              },
            ],
          };
          res.write(`data: ${JSON.stringify(openaiChunkData, null, 0)}\n\n`);
          res.write("data: [DONE]\n\n");
          res.end();
        } else {
          const openaiChunkData = {
            id: randomChatCmplId,
            object: "text_completion",
            created: Math.floor(Date.now() / 1000),
            model: model,
            choices: [
              {
                text: generated_text,
                index: 0,
                finish_reason: null,
                logprobs: null,
              },
            ],
          };
          res.write(`data: ${JSON.stringify(openaiChunkData, null, 0)}\n\n`);
        }
      } catch (error) {
        console.warn("Error parsing chunk data: ", error);
      }
    });
  } else {
    res.setHeader("content-type", "application/json");
    res.status(201);
    const api = `${mindSporeHost}/models/${model}/generate`;
    const body = {
      inputs: prompt,
      parameters: {
        ...mindSporeParameters,
        max_new_tokens: max_tokens,
      },
      stream: "False",
    };
    console.log("Request mindspore api: ", api);
    console.log("Args: ", JSON.stringify(body));
    const response = await axios({
      url: api,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    });
    const { data } = response;
    const generated_text = data.generated_text;
    const openaiData = {
      id:   "chatcmpl-" + Math.random().toString(36).substr(2, 16),
      object: "text_completion",
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          text: generated_text,
          index: 0,
          finish_reason: "length",
          logprobs: null,
        },
      ],
      usage: { prompt_tokens: undefined, completion_tokens: undefined, total_tokens: undefined },
    };
    res.json(openaiData);
  }
});

app.all('*', (req, res) => {
  console.log(req.body)
  res.status(200).send('ok');
})

app.listen(port, () => {
  console.log(
    `Mindspore OpenAI Compatible server is running at http://127.0.0.1:${port}`
  );
});
