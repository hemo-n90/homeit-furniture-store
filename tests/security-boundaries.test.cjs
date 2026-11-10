const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '../artifacts/api-server/src', file), 'utf8');
  const exports = {};
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { exports, Buffer, Date, Map, Set, process: { env: {} }, require(name) {
      if (name in mocks) return mocks[name];
      throw new Error(`Unexpected dependency ${name}`);
    } });
  return exports;
}

test('orders reject malformed, duplicate and excessive quantities', () => {
  const { parseOrderItems } = load('lib/order-input.ts');
  for (const items of [null, {}, [], [{productId: 1, quantity: 0}], [{productId: 1, quantity: 1.5}],
    [{productId: '1junk', quantity: 1}], [{productId: 1, quantity: 101}],
    [{productId: 1, quantity: 1}, {productId: 1, quantity: 2}]]) assert.equal(parseOrderItems(items), null);
  assert.equal(JSON.stringify(parseOrderItems([{productId: 1, quantity: 2}])), '[{"productId":1,"quantity":2}]');
});

test('image checks reject executable text and recognize supported containers', () => {
  const { imageExtension } = load('lib/upload-type.ts');
  for (const body of ['', '<html>fake image</html>', '<svg onload="alert(1)"></svg>']) {
    assert.equal(imageExtension(Buffer.from(body)), null);
  }
  assert.equal(imageExtension(Buffer.from([137,80,78,71,13,10,26,10])), 'png');
  assert.equal(imageExtension(Buffer.from([255,216,255,224])), 'jpg');
  assert.equal(imageExtension(Buffer.from('GIF89a')), 'gif');
  assert.equal(imageExtension(Buffer.from('RIFF0000WEBP')), 'webp');
});

test('login attempts are limited by IP and recover after the window expires', () => {
  let time = 1000;
  const limiter = load('middlewares/login-limit.ts').createLoginLimiter(() => time);
  const req = { ip: '192.0.2.1', socket: {} };
  const res = { status(code) { this.code=code; return this; }, json() { return this; }, setHeader() {} };
  let accepted = 0;
  for (let i=0;i<11;i++) limiter(req,res,()=>accepted++);
  assert.equal(accepted,10); assert.equal(res.code,429);
  limiter({ ...req, ip: '192.0.2.2' },res,()=>accepted++); assert.equal(accepted,11);
  time += 15*60*1000;
  limiter(req,res,()=>accepted++); assert.equal(accepted,12);
});

for (const failItems of [false, true]) test(`order writes share a transaction (item failure: ${failItems})`, async () => {
  let handler, staged=[], committed=[];
  const router={get(){},patch(){},post(_path,fn){handler=fn;}};
  const db={
    select(){return {from(){return {where:async()=>[{id:1,name:'Demo',nameAr:'Demo',price:'10.00',discountPrice:null,inStock:true,images:[]}]};}};},
    async transaction(callback){
      const tx={insert(table){return {values(value){return {async returning(){
        if(table==='items'&&failItems) throw new Error('item insert failed');
        staged.push({table,value}); return table==='orders'?[{id:1}]:value;
      }};}};}};
      const result=await callback(tx); committed=staged; return result;
    },
    insert(){throw new Error('Write escaped transaction');}
  };
  load('routes/orders.ts',{
    express:{Router:()=>router},'@workspace/db':{db,ordersTable:'orders',orderItemsTable:'items',productsTable:{id:'id'}},
    'drizzle-orm':{eq(){},desc(){},and(){},inArray(){},count(){},sum(){}},
    '../middlewares/auth':{requireAdmin(){}},'../lib/order-input':load('lib/order-input.ts')
  });
  const res={code:200,status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await handler({body:{customerName:'Demo',customerPhone:'123',city:'Demo',address:'Demo',items:[{productId:1,quantity:2}]},log:{error(){}}},res);
  assert.equal(res.code,failItems?500:201);
  assert.equal(committed.length,failItems?0:2);
});
