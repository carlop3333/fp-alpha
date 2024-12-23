interface Env {
  fpinfo: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const list = await ctx.env.fpinfo.list()
  const objectInfo = {}
  for (const {name} of list.keys) {
    objectInfo[name] = await ctx.env.fpinfo.get(name, {cacheTtl: 1200});
  };
  return new Response(JSON.stringify(objectInfo), {status: 200, headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '86400',
  }});
};
