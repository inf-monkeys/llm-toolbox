const express = require("express");
const app = express();
const port = 61170;

// 使用JSON中间件解析请求体
app.use(express.json());

app.post("/models/baichuan2/generate_stream", (req, res) => {
  console.log(`on request: ${JSON.stringify(req.body)}`);
  // 设置响应头部为流式数据类型
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const messages = [
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这是一个", "tokens": {"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}, "top_tokens": [{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "经典的", "tokens": {"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}, "top_tokens": [{"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学", "tokens": {"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}, "top_tokens": [{"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "问题", "tokens": {"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}, "top_tokens": [{"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 67.6875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 67.6875, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "被称为", "tokens": {"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}, "top_tokens": [{"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "“", "tokens": {"id": 92360, "logprob": 37.625, "special": false, "text": "“"}, "top_tokens": [{"id": 92360, "logprob": 37.625, "special": false, "text": "“"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "与", "tokens": {"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}, "top_tokens": [{"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "蛋", "tokens": {"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}, "top_tokens": [{"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "的问题", "tokens": {"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}, "top_tokens": [{"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "”", "tokens": {"id": 92361, "logprob": 20.625, "special": false, "text": "”"}, "top_tokens": [{"id": 92361, "logprob": 20.625, "special": false, "text": "”"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 71.0, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 71.0, "special": false, "text": "。"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "关于", "tokens": {"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}, "top_tokens": [{"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个问题", "tokens": {"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}, "top_tokens": [{"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 58.03125, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 58.03125, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "科学家们", "tokens": {"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}, "top_tokens": [{"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "和", "tokens": {"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}, "top_tokens": [{"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学家", "tokens": {"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}, "top_tokens": [{"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "们", "tokens": {"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}, "top_tokens": [{"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "有不同的", "tokens": {"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}, "top_tokens": [{"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "看法", "tokens": {"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}, "top_tokens": [{"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 79.0625, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 79.0625, "special": false, "text": "。"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "有些", "tokens": {"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}, "top_tokens": [{"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "科学家", "tokens": {"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}, "top_tokens": [{"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "认为", "tokens": {"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}, "top_tokens": [{"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 44.375, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 44.375, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "在", "tokens": {"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}, "top_tokens": [{"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "的", "tokens": {"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}, "top_tokens": [{"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "进化", "tokens": {"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}, "top_tokens": [{"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "过程中", "tokens": {"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}, "top_tokens": [{"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 55.21875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 55.21875, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "一定", "tokens": {"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}, "top_tokens": [{"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "有一个", "tokens": {"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}, "top_tokens": [{"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "“", "tokens": {"id": 92360, "logprob": 25.125, "special": false, "text": "“"}, "top_tokens": [{"id": 92360, "logprob": 25.125, "special": false, "text": "“"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "第一", "tokens": {"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}, "top_tokens": [{"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "只", "tokens": {"id": 92617, "logprob": 29.5, "special": false, "text": "只"}, "top_tokens": [{"id": 92617, "logprob": 29.5, "special": false, "text": "只"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "”", "tokens": {"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}, "top_tokens": [{"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 51.09375, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 51.09375, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个", "tokens": {"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}, "top_tokens": [{"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "鸡", "tokens": {"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}, "top_tokens": [{"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "是由", "tokens": {"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}, "top_tokens": [{"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "某种", "tokens": {"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}, "top_tokens": [{"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "已经", "tokens": {"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}, "top_tokens": [{"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "存在的", "tokens": {"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}, "top_tokens": [{"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "物种", "tokens": {"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}, "top_tokens": [{"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "通过", "tokens": {"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}, "top_tokens": [{"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "进化", "tokens": {"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}, "top_tokens": [{"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "而来的", "tokens": {"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}, "top_tokens": [{"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 28.484375, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 28.484375, "special": false, "text": "。"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "而", "tokens": {"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}, "top_tokens": [{"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学家", "tokens": {"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}, "top_tokens": [{"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "们", "tokens": {"id": 92414, "logprob": 51.125, "special": false, "text": "们"}, "top_tokens": [{"id": 92414, "logprob": 51.125, "special": false, "text": "们"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "则", "tokens": {"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}, "top_tokens": [{"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "认为", "tokens": {"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}, "top_tokens": [{"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 59.78125, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 59.78125, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个问题", "tokens": {"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}, "top_tokens": [{"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "没有", "tokens": {"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}, "top_tokens": [{"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "绝对的", "tokens": {"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}, "top_tokens": [{"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "答案", "tokens": {"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}, "top_tokens": [{"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "因为它", "tokens": {"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}, "top_tokens": [{"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "涉及到", "tokens": {"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}, "top_tokens": [{"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "因果", "tokens": {"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}, "top_tokens": [{"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "关系的", "tokens": {"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}, "top_tokens": [{"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "理解", "tokens": {"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}, "top_tokens": [{"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 67.125, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 67.125, "special": false, "text": "。"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "总的来说", "tokens": {"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}, "top_tokens": [{"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 12.265625, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 12.265625, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这个问题", "tokens": {"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}, "top_tokens": [{"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "没有", "tokens": {"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}, "top_tokens": [{"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "确", "tokens": {"id": 92701, "logprob": 38.5, "special": false, "text": "确"}, "top_tokens": [{"id": 92701, "logprob": 38.5, "special": false, "text": "确"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "切的", "tokens": {"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}, "top_tokens": [{"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "答案", "tokens": {"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}, "top_tokens": [{"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "，", "tokens": {"id": 65, "logprob": 19.296875, "special": false, "text": "，"}, "top_tokens": [{"id": 65, "logprob": 19.296875, "special": false, "text": "，"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "因为它", "tokens": {"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}, "top_tokens": [{"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "涉及到", "tokens": {"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}, "top_tokens": [{"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "生物学", "tokens": {"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}, "top_tokens": [{"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "、", "tokens": {"id": 69, "logprob": 71.3125, "special": false, "text": "、"}, "top_tokens": [{"id": 69, "logprob": 71.3125, "special": false, "text": "、"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "进化", "tokens": {"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}, "top_tokens": [{"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "论", "tokens": {"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}, "top_tokens": [{"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "和", "tokens": {"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}, "top_tokens": [{"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "哲学", "tokens": {"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}, "top_tokens": [{"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "等多个", "tokens": {"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}, "top_tokens": [{"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "领域", "tokens": {"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}, "top_tokens": [{"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "。", "tokens": {"id": 66, "logprob": 71.375, "special": false, "text": "。"}, "top_tokens": [{"id": 66, "logprob": 71.375, "special": false, "text": "。"}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "", "tokens": {"id": 2, "logprob": 61.3125, "special": true, "text": ""}, "top_tokens": [{"id": 2, "logprob": 61.3125, "special": true, "text": ""}]}]}',
    '{"event": "message", "retry": 30000, "data": [{"details": null, "generated_text": "这是一个经典的哲学问题，被称为“鸡与蛋的问题”。关于这个问题，科学家们和哲学家们有不同的看法。有些科学家认为，在鸡的进化过程中，一定有一个“第一只鸡”，这个鸡是由某种已经存在的物种通过进化而来的。而哲学家们则认为，这个问题没有绝对的答案，因为它涉及到因果关系的理解。总的来说，这个问题没有确切的答案，因为它涉及到生物学、进化论和哲学等多个领域。", "finish_reason": "eos", "generated_tokens": 89, "prefill": [{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}], "seed": 0, "tokens": [{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}, {"id": 23252, "logprob": 34.65625, "special": false, "text": "经典的"}, {"id": 13221, "logprob": 34.65625, "special": false, "text": "哲学"}, {"id": 1754, "logprob": 44.8125, "special": false, "text": "问题"}, {"id": 65, "logprob": 67.6875, "special": false, "text": "，"}, {"id": 11895, "logprob": 27.953125, "special": false, "text": "被称为"}, {"id": 92360, "logprob": 37.625, "special": false, "text": "“"}, {"id": 93368, "logprob": 27.359375, "special": false, "text": "鸡"}, {"id": 92489, "logprob": 32.3125, "special": false, "text": "与"}, {"id": 93390, "logprob": 21.6875, "special": false, "text": "蛋"}, {"id": 3799, "logprob": 36.625, "special": false, "text": "的问题"}, {"id": 92361, "logprob": 20.625, "special": false, "text": "”"}, {"id": 66, "logprob": 71.0, "special": false, "text": "。"}, {"id": 2365, "logprob": 33.53125, "special": false, "text": "关于"}, {"id": 13562, "logprob": 50.84375, "special": false, "text": "这个问题"}, {"id": 65, "logprob": 58.03125, "special": false, "text": "，"}, {"id": 71994, "logprob": 32.8125, "special": false, "text": "科学家们"}, {"id": 92385, "logprob": 29.703125, "special": false, "text": "和"}, {"id": 65936, "logprob": 40.03125, "special": false, "text": "哲学家"}, {"id": 92414, "logprob": 45.40625, "special": false, "text": "们"}, {"id": 55089, "logprob": 34.09375, "special": false, "text": "有不同的"}, {"id": 13276, "logprob": 59.78125, "special": false, "text": "看法"}, {"id": 66, "logprob": 79.0625, "special": false, "text": "。"}, {"id": 3405, "logprob": 41.5, "special": false, "text": "有些"}, {"id": 13393, "logprob": 50.3125, "special": false, "text": "科学家"}, {"id": 2866, "logprob": 53.75, "special": false, "text": "认为"}, {"id": 65, "logprob": 44.375, "special": false, "text": "，"}, {"id": 92355, "logprob": 25.9375, "special": false, "text": "在"}, {"id": 93368, "logprob": 24.703125, "special": false, "text": "鸡"}, {"id": 92333, "logprob": 28.296875, "special": false, "text": "的"}, {"id": 29131, "logprob": 23.984375, "special": false, "text": "进化"}, {"id": 3667, "logprob": 38.0, "special": false, "text": "过程中"}, {"id": 65, "logprob": 55.21875, "special": false, "text": "，"}, {"id": 2055, "logprob": 32.09375, "special": false, "text": "一定"}, {"id": 5995, "logprob": 29.234375, "special": false, "text": "有一个"}, {"id": 92360, "logprob": 25.125, "special": false, "text": "“"}, {"id": 1870, "logprob": 25.609375, "special": false, "text": "第一"}, {"id": 92617, "logprob": 29.5, "special": false, "text": "只"}, {"id": 93368, "logprob": 38.0625, "special": false, "text": "鸡"}, {"id": 92361, "logprob": 51.53125, "special": false, "text": "”"}, {"id": 65, "logprob": 51.09375, "special": false, "text": "，"}, {"id": 1790, "logprob": 36.15625, "special": false, "text": "这个"}, {"id": 93368, "logprob": 35.625, "special": false, "text": "鸡"}, {"id": 10879, "logprob": 30.703125, "special": false, "text": "是由"}, {"id": 16206, "logprob": 26.90625, "special": false, "text": "某种"}, {"id": 1914, "logprob": 24.3125, "special": false, "text": "已经"}, {"id": 13601, "logprob": 29.71875, "special": false, "text": "存在的"}, {"id": 31476, "logprob": 27.84375, "special": false, "text": "物种"}, {"id": 1840, "logprob": 33.8125, "special": false, "text": "通过"}, {"id": 29131, "logprob": 33.9375, "special": false, "text": "进化"}, {"id": 28548, "logprob": 38.625, "special": false, "text": "而来的"}, {"id": 66, "logprob": 28.484375, "special": false, "text": "。"}, {"id": 92492, "logprob": 37.71875, "special": false, "text": "而"}, {"id": 65936, "logprob": 33.6875, "special": false, "text": "哲学家"}, {"id": 92414, "logprob": 51.125, "special": false, "text": "们"}, {"id": 92948, "logprob": 48.84375, "special": false, "text": "则"}, {"id": 2866, "logprob": 39.6875, "special": false, "text": "认为"}, {"id": 65, "logprob": 59.78125, "special": false, "text": "，"}, {"id": 13562, "logprob": 33.59375, "special": false, "text": "这个问题"}, {"id": 1667, "logprob": 31.125, "special": false, "text": "没有"}, {"id": 49156, "logprob": 35.6875, "special": false, "text": "绝对的"}, {"id": 4174, "logprob": 47.15625, "special": false, "text": "答案"}, {"id": 65, "logprob": 14.5546875, "special": false, "text": "，"}, {"id": 25107, "logprob": 41.8125, "special": false, "text": "因为它"}, {"id": 24144, "logprob": 46.59375, "special": false, "text": "涉及到"}, {"id": 20113, "logprob": 24.8125, "special": false, "text": "因果"}, {"id": 18503, "logprob": 37.1875, "special": false, "text": "关系的"}, {"id": 3854, "logprob": 34.03125, "special": false, "text": "理解"}, {"id": 66, "logprob": 67.125, "special": false, "text": "。"}, {"id": 37425, "logprob": 34.65625, "special": false, "text": "总的来说"}, {"id": 65, "logprob": 12.265625, "special": false, "text": "，"}, {"id": 13562, "logprob": 42.25, "special": false, "text": "这个问题"}, {"id": 1667, "logprob": 40.28125, "special": false, "text": "没有"}, {"id": 92701, "logprob": 38.5, "special": false, "text": "确"}, {"id": 30476, "logprob": 20.671875, "special": false, "text": "切的"}, {"id": 4174, "logprob": 52.0, "special": false, "text": "答案"}, {"id": 65, "logprob": 19.296875, "special": false, "text": "，"}, {"id": 25107, "logprob": 30.59375, "special": false, "text": "因为它"}, {"id": 24144, "logprob": 39.46875, "special": false, "text": "涉及到"}, {"id": 33583, "logprob": 33.6875, "special": false, "text": "生物学"}, {"id": 69, "logprob": 71.3125, "special": false, "text": "、"}, {"id": 29131, "logprob": 42.21875, "special": false, "text": "进化"}, {"id": 92874, "logprob": 49.0625, "special": false, "text": "论"}, {"id": 92385, "logprob": 67.9375, "special": false, "text": "和"}, {"id": 13221, "logprob": 45.25, "special": false, "text": "哲学"}, {"id": 21933, "logprob": 49.09375, "special": false, "text": "等多个"}, {"id": 3581, "logprob": 52.1875, "special": false, "text": "领域"}, {"id": 66, "logprob": 71.375, "special": false, "text": "。"}, {"id": 2, "logprob": 61.3125, "special": true, "text": ""}], "top_tokens": [[{"id": 14314, "logprob": 38.51716613769531, "special": false, "text": "这是一个"}]]}]}',
  ];

  let index = 0;

  // 使用 setInterval 每隔一段时间发送一条数据
  const interval = setInterval(() => {
    if (index < messages.length) {
      console.log(messages[index]);
      res.write(messages[index] + "\n");
      index++;
    } else {
      clearInterval(interval);
      res.end();
    }
  }, 20); // 每隔1秒发送一条数据
});

app.post("/models/baichuan2/generate", (req, res) => {
  console.log(`on request: ${JSON.stringify(req.body)}`);
  // 设置响应头部为流式数据类型
  res.setHeader("Content-Type", "application/json");
  res.send({
    generated_text:
      "这是一个经典的哲学问题，被称为“鸡与蛋的问题”。关于这个问题，科学家们和哲学家们有不同的看法。有些科学家认为，在鸡的进化过程中，一定有一个“第一只鸡”，这个鸡是由某种已经存在的物种通过进化而来的。而哲学家们则认为，这个问题没有绝对的答案，因为它涉及到因果关系的理解。总的来说，这个问题没有确切的答案，因为它涉及到生物学、进化论和哲学等多个领域。",
    finish_reason: "eos",
    generated_tokens: 89,
    prefill: [
      {
        id: 14314,
        logprob: 38.51716232299805,
        special: false,
        text: "这是一个",
      },
    ],
    seed: 0,
    tokens: [
      {
        id: 14314,
        logprob: 38.51716232299805,
        special: false,
        text: "这是一个",
      },
      { id: 23252, logprob: 34.65625, special: false, text: "经典的" },
      { id: 13221, logprob: 34.65625, special: false, text: "哲学" },
      { id: 1754, logprob: 44.8125, special: false, text: "问题" },
      { id: 65, logprob: 67.6875, special: false, text: "，" },
      { id: 11895, logprob: 27.953125, special: false, text: "被称为" },
      { id: 92360, logprob: 37.625, special: false, text: "“" },
      { id: 93368, logprob: 27.359375, special: false, text: "鸡" },
      { id: 92489, logprob: 32.3125, special: false, text: "与" },
      { id: 93390, logprob: 21.6875, special: false, text: "蛋" },
      { id: 3799, logprob: 36.625, special: false, text: "的问题" },
      { id: 92361, logprob: 20.625, special: false, text: "”" },
      { id: 66, logprob: 71.0, special: false, text: "。" },
      { id: 2365, logprob: 33.53125, special: false, text: "关于" },
      { id: 13562, logprob: 50.84375, special: false, text: "这个问题" },
      { id: 65, logprob: 58.03125, special: false, text: "，" },
      { id: 71994, logprob: 32.8125, special: false, text: "科学家们" },
      { id: 92385, logprob: 29.703125, special: false, text: "和" },
      { id: 65936, logprob: 40.03125, special: false, text: "哲学家" },
      { id: 92414, logprob: 45.40625, special: false, text: "们" },
      { id: 55089, logprob: 34.09375, special: false, text: "有不同的" },
      { id: 13276, logprob: 59.78125, special: false, text: "看法" },
      { id: 66, logprob: 79.0625, special: false, text: "。" },
      { id: 3405, logprob: 41.5, special: false, text: "有些" },
      { id: 13393, logprob: 50.3125, special: false, text: "科学家" },
      { id: 2866, logprob: 53.75, special: false, text: "认为" },
      { id: 65, logprob: 44.375, special: false, text: "，" },
      { id: 92355, logprob: 25.9375, special: false, text: "在" },
      { id: 93368, logprob: 24.703125, special: false, text: "鸡" },
      { id: 92333, logprob: 28.296875, special: false, text: "的" },
      { id: 29131, logprob: 23.984375, special: false, text: "进化" },
      { id: 3667, logprob: 38.0, special: false, text: "过程中" },
      { id: 65, logprob: 55.21875, special: false, text: "，" },
      { id: 2055, logprob: 32.09375, special: false, text: "一定" },
      { id: 5995, logprob: 29.234375, special: false, text: "有一个" },
      { id: 92360, logprob: 25.125, special: false, text: "“" },
      { id: 1870, logprob: 25.609375, special: false, text: "第一" },
      { id: 92617, logprob: 29.5, special: false, text: "只" },
      { id: 93368, logprob: 38.0625, special: false, text: "鸡" },
      { id: 92361, logprob: 51.53125, special: false, text: "”" },
      { id: 65, logprob: 51.09375, special: false, text: "，" },
      { id: 1790, logprob: 36.15625, special: false, text: "这个" },
      { id: 93368, logprob: 35.625, special: false, text: "鸡" },
      { id: 10879, logprob: 30.703125, special: false, text: "是由" },
      { id: 16206, logprob: 26.90625, special: false, text: "某种" },
      { id: 1914, logprob: 24.3125, special: false, text: "已经" },
      { id: 13601, logprob: 29.71875, special: false, text: "存在的" },
      { id: 31476, logprob: 27.84375, special: false, text: "物种" },
      { id: 1840, logprob: 33.8125, special: false, text: "通过" },
      { id: 29131, logprob: 33.9375, special: false, text: "进化" },
      { id: 28548, logprob: 38.625, special: false, text: "而来的" },
      { id: 66, logprob: 28.484375, special: false, text: "。" },
      { id: 92492, logprob: 37.71875, special: false, text: "而" },
      { id: 65936, logprob: 33.6875, special: false, text: "哲学家" },
      { id: 92414, logprob: 51.125, special: false, text: "们" },
      { id: 92948, logprob: 48.84375, special: false, text: "则" },
      { id: 2866, logprob: 39.6875, special: false, text: "认为" },
      { id: 65, logprob: 59.78125, special: false, text: "，" },
      { id: 13562, logprob: 33.59375, special: false, text: "这个问题" },
      { id: 1667, logprob: 31.125, special: false, text: "没有" },
      { id: 49156, logprob: 35.6875, special: false, text: "绝对的" },
      { id: 4174, logprob: 47.15625, special: false, text: "答案" },
      { id: 65, logprob: 14.5546875, special: false, text: "，" },
      { id: 25107, logprob: 41.8125, special: false, text: "因为它" },
      { id: 24144, logprob: 46.59375, special: false, text: "涉及到" },
      { id: 20113, logprob: 24.8125, special: false, text: "因果" },
      { id: 18503, logprob: 37.1875, special: false, text: "关系的" },
      { id: 3854, logprob: 34.03125, special: false, text: "理解" },
      { id: 66, logprob: 67.125, special: false, text: "。" },
      { id: 37425, logprob: 34.65625, special: false, text: "总的来说" },
      { id: 65, logprob: 12.265625, special: false, text: "，" },
      { id: 13562, logprob: 42.25, special: false, text: "这个问题" },
      { id: 1667, logprob: 40.28125, special: false, text: "没有" },
      { id: 92701, logprob: 38.5, special: false, text: "确" },
      { id: 30476, logprob: 20.671875, special: false, text: "切的" },
      { id: 4174, logprob: 52.0, special: false, text: "答案" },
      { id: 65, logprob: 19.296875, special: false, text: "，" },
      { id: 25107, logprob: 30.59375, special: false, text: "因为它" },
      { id: 24144, logprob: 39.46875, special: false, text: "涉及到" },
      { id: 33583, logprob: 33.6875, special: false, text: "生物学" },
      { id: 69, logprob: 71.3125, special: false, text: "、" },
      { id: 29131, logprob: 42.21875, special: false, text: "进化" },
      { id: 92874, logprob: 49.0625, special: false, text: "论" },
      { id: 92385, logprob: 67.9375, special: false, text: "和" },
      { id: 13221, logprob: 45.25, special: false, text: "哲学" },
      { id: 21933, logprob: 49.09375, special: false, text: "等多个" },
      { id: 3581, logprob: 52.1875, special: false, text: "领域" },
      { id: 66, logprob: 71.375, special: false, text: "。" },
      { id: 2, logprob: 61.3125, special: true, text: "" },
    ],
    top_tokens: [
      [
        {
          id: 14314,
          logprob: 38.51716232299805,
          special: false,
          text: "这是一个",
        },
      ],
    ],
    details: null,
  });
  res.end();
});

app.listen(port, () => {
  console.log(`Mock API server is running at http://127.0.0.1:${port}`);
});
