const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const httpProxy = require("http-proxy");
const { configure, getLogger } = require("log4js");
const yaml = require("yaml");
const path = require("path");
const fs = require("fs");

const proxy = httpProxy.createProxyServer({});

configure({
  appenders: {
    stdout: {
      type: "stdout",
      layout: {
        type: "pattern",
        pattern: "[%d{ISO8601_WITH_TZ_OFFSET}] %p %c %f:%l  %m",
      },
    },
  },
  categories: { default: { appenders: ["stdout"], level: "ALL" } },
});

const logger = getLogger("default");

// Read configuration from `config.yaml`
let configFilePath = path.join(__dirname, "./config.yaml");
if (!fs.existsSync(configFilePath)) {
  console.error("Configuration file not found");
  process.exit(1);
}

let config;
try {
  config = yaml.parse(fs.readFileSync(configFilePath, "utf8"));
} catch (e) {
  console.error("Failed to load configuration:", e);
  process.exit(1);
}

const modelConfigs = config.models || [];
if (!modelConfigs?.length) {
  console.error("No models defined in the configuration");
  process.exit(1);
}

const port = process.env.PORT || config.port || 8000;

process.on("unhandledRejection", (err) => {
  logger.error("unhandledRejection: ", err);
});

process.on("uncaughtException", (err) => {
  logger.error("uncaughtException: ", err);
});
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function getModelConfig(model) {
  for (const modelConfig of modelConfigs) {
    if (typeof modelConfig.name === "string") {
      if (modelConfig.name === model) {
        return modelConfig;
      }
    } else if (Array.isArray(modelConfig.name)) {
      if (modelConfig.name.includes(model)) {
        return modelConfig;
      }
    }
  }
}

// Restream parsed body before proxying
proxy.on("proxyReq", function (proxyReq, req, res, options) {
  if (req.body) {
    let bodyData = JSON.stringify(req.body);
    // In case if content-type is application/x-www-form-urlencoded -> we need to change to application/json
    proxyReq.setHeader("Content-Type", "application/json");
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    // Stream the content
    proxyReq.write(bodyData);
  }
});

const proxyApp = express();
proxyApp.use(bodyParser.json());
proxyApp.use(bodyParser.urlencoded({ extended: true }));
proxyApp.use(function (req, res) {
  const { model } = req.body;
  const modelConfig = getModelConfig(model);
  if (!modelConfig) {
    return res.status(404).send("Model not found");
  }
  const { host } = modelConfig;
  logger.info(`Forwarding request to: ${host}`);
  proxy.web(
    req,
    res,
    {
      target: host,
      secure: false,
    },
    (e) => {
      logger.error("Error while forwarding request: ", e);
      res.status(500).send("Internal server error");
    }
  );
});

http.createServer(proxyApp).listen(port, "0.0.0.0", () => {
  logger.log(`Proxy server linsten on ${port}`);
});
