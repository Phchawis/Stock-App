export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM reagents").all();
    // Map column names min_qty/reorder_qty back to frontend standard (min/reorder)
    const mapped = results.map(r => ({
      id: r.id,
      code: r.code,
      th: r.th,
      en: r.en,
      cat: r.cat,
      unit: r.unit,
      subUnit: r.subUnit || '',
      testsPerUnit: r.testsPerUnit,
      storage: r.storage,
      min: r.min_qty,
      reorder: r.reorder_qty,
      supplier: r.supplier,
      img: r.img
    }));
    return new Response(JSON.stringify(mapped), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const { code, th, en, cat, unit, subUnit, testsPerUnit, storage, min, reorder, supplier, img } = body;
    
    if (!th || !cat || !unit || !storage || min === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const result = await env.DB.prepare(
      `INSERT INTO reagents (code, th, en, cat, unit, subUnit, testsPerUnit, storage, min_qty, reorder_qty, supplier, img) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      code, th, en || th, cat, unit, subUnit || '', testsPerUnit || null, storage, min, reorder !== undefined ? reorder : min, supplier || 'i-med', img || '/reagent_placeholder.png'
    ).run();

    const newReagent = {
      id: result.meta.last_row_id,
      code, th, en: en || th, cat, unit, subUnit: subUnit || '', testsPerUnit: testsPerUnit || null, storage, min, reorder: reorder !== undefined ? reorder : min, supplier: supplier || 'i-med', img: img || '/reagent_placeholder.png'
    };

    return new Response(JSON.stringify(newReagent), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPut(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const { id, th, en, cat, unit, subUnit, testsPerUnit, storage, min, reorder, supplier, img } = body;
    
    if (!id || !th || !cat || !unit || !storage || min === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await env.DB.prepare(
      `UPDATE reagents 
       SET th = ?, en = ?, cat = ?, unit = ?, subUnit = ?, testsPerUnit = ?, storage = ?, min_qty = ?, reorder_qty = ?, supplier = ?, img = ?
       WHERE id = ?`
    ).bind(
      th, en || th, cat, unit, subUnit || '', testsPerUnit || null, storage, min, reorder !== undefined ? reorder : min, supplier, img || '/reagent_placeholder.png', id
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response(JSON.stringify({ error: "Missing reagent id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    // Delete associated transactions, lots, and the reagent itself in a batch
    await env.DB.batch([
      env.DB.prepare("DELETE FROM transactions WHERE rid = ?").bind(id),
      env.DB.prepare("DELETE FROM lots WHERE rid = ?").bind(id),
      env.DB.prepare("DELETE FROM reagents WHERE id = ?").bind(id)
    ]);
    return new Response(JSON.stringify({ success: true, id: Number(id) }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
