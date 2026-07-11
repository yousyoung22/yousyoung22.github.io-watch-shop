const http = require("node:http");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const VIEWS_DIR = path.join(ROOT, "views");
const PORT = Number(process.env.PORT || 8800);
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_AGE_SECONDS = 60 * 60 * 8;
const sessions = new Map();

const dataFile = name => path.join(DATA_DIR, name);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendJson(res, status, payload, headers = {}) {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8",
    ...headers
  });
}

function redirect(res, location) {
  send(res, 302, "", { Location: location });
}

async function readJson(name, fallback) {
  try {
    return JSON.parse(await fs.readFile(dataFile(name), "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await writeJson(name, fallback);
    return fallback;
  }
}

async function writeJson(name, value) {
  const file = dataFile(name);
  const temp = `${file}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await fs.rename(temp, file);
}

function parseCookies(req) {
  const source = req.headers.cookie || "";
  return source.split(";").reduce((cookies, part) => {
    const index = part.indexOf("=");
    if (index === -1) return cookies;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
}

function createSession(user) {
  const sid = crypto.randomBytes(24).toString("hex");
  sessions.set(sid, {
    ...user,
    expiresAt: Date.now() + SESSION_AGE_SECONDS * 1000
  });
  return sid;
}

function getSession(req) {
  const sid = parseCookies(req).sid;
  if (!sid) return null;

  const session = sessions.get(sid);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(sid);
    return null;
  }

  return { sid, ...session };
}

function sessionCookie(sid) {
  return `sid=${encodeURIComponent(sid)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_AGE_SECONDS}`;
}

function clearSessionCookie() {
  return "sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0";
}

function requireAdmin(req, res) {
  const session = getSession(req);
  if (!session || session.role !== "admin") {
    sendJson(res, 401, { error: "관리자 로그인이 필요합니다." });
    return null;
  }
  return session;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, user) {
  if (!user || !user.salt || !user.hash) return false;
  const expected = crypto.scryptSync(password, user.salt, 64);
  const actual = Buffer.from(user.hash, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

async function readBody(req, maxBytes = 1024 * 1024) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      throw new Error("요청 내용이 너무 큽니다.");
    }
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("JSON 형식이 올바르지 않습니다.");
  }
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    profile: user.profile || { name: user.name || "", phone: "", address: "" }
  };
}

function cleanProfile(input, fallback = {}) {
  return {
    name: String(input.name || fallback.name || "").trim(),
    phone: String(input.phone || fallback.phone || "").trim(),
    address: String(input.address || fallback.address || "").trim()
  };
}

function normalizeImage(value) {
  let image = String(value || "").replace(/\\/g, "/").trim();
  if (!image) return "images/logo.png";
  image = image.replace(/^\/+/, "");
  if (!image.startsWith("images/")) image = `images/${image}`;
  return image;
}

function safeImageFileName(fileName) {
  const original = path.basename(String(fileName || "product-image"));
  const extension = path.extname(original).toLowerCase();
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp"]);

  if (!allowed.has(extension)) {
    throw new Error("jpg, png, webp 이미지만 업로드할 수 있습니다.");
  }

  const base = path.basename(original, extension)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 80) || "product-image";

  return `${Date.now()}-${base}${extension}`;
}

function decodeImageUpload(input) {
  const dataUrl = String(input.dataUrl || "");
  const match = dataUrl.match(/^data:image\/(png|jpe?g|webp);base64,([a-zA-Z0-9+/=\r\n]+)$/);

  if (!match) {
    throw new Error("이미지 파일을 다시 선택해주세요.");
  }

  const buffer = Buffer.from(match[2].replace(/\s/g, ""), "base64");
  if (buffer.length === 0 || buffer.length > 10 * 1024 * 1024) {
    throw new Error("이미지는 10MB 이하만 업로드할 수 있습니다.");
  }

  return buffer;
}

function cleanOptions(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map(option => ({
      label: String(option.label || "").trim(),
      image: normalizeImage(option.image),
      detailImages: Array.isArray(option.detailImages)
        ? option.detailImages.map(normalizeImage).filter(Boolean)
        : undefined
    }))
    .filter(option => option.label && option.image)
    .map(option => {
      if (!option.detailImages || option.detailImages.length === 0) {
        delete option.detailImages;
      }
      return option;
    });
}

function cleanProduct(input, existing = {}) {
  const product = {
    id: existing.id || Number(input.id),
    name: String(input.name || "").trim(),
    price: Number(input.price),
    image: normalizeImage(input.image),
    material: String(input.material || "Pendant").trim(),
    optionName: String(input.optionName || "").trim(),
    options: cleanOptions(input.options)
  };

  if (!product.name) throw new Error("상품명을 입력해주세요.");
  if (!Number.isFinite(product.price) || product.price < 0) throw new Error("가격을 올바르게 입력해주세요.");
  if (!product.material) product.material = "Pendant";
  if (!product.optionName) delete product.optionName;
  if (!product.options.length) delete product.options;

  return product;
}

function orderTotal(items) {
  return items.reduce((sum, item) => sum + Number(item.price || 0), 0);
}

const ORDER_STAGES = ["주문 처리중", "결제 완료", "상품 준비중", "배송시작", "배송중", "배송완료"];
const TRACKING_STATUS_TO_ORDER_STATUS = {
  INFORMATION_RECEIVED: "상품 준비중",
  AT_PICKUP: "배송시작",
  IN_TRANSIT: "배송중",
  OUT_FOR_DELIVERY: "배송중",
  ATTEMPT_FAIL: "배송중",
  AVAILABLE_FOR_PICKUP: "배송중",
  DELIVERED: "배송완료"
};

function canonicalOrderStatus(status) {
  const value = String(status || "").trim();
  if (!value) return "주문 처리중";
  const normalized = value.replace(/\s+/g, "");

  if (normalized === "주문완료" || normalized === "배송완료") return "배송완료";
  if (normalized === "상품준비중") return "상품 준비중";
  if (normalized === "결제완료") return "결제 완료";
  if (normalized === "결제대기중" || normalized === "주문접수") return "주문 처리중";
  if (normalized === "취소" || normalized === "결제취소") return "취소";

  return value;
}

function orderStageIndex(status) {
  const index = ORDER_STAGES.indexOf(canonicalOrderStatus(status));
  return index === -1 ? 0 : index;
}

function bestOrderStatus(order) {
  const status = canonicalOrderStatus(order.status);
  const shippingStatus = canonicalOrderStatus(order.shippingStatus);

  if (status === "취소" || shippingStatus === "취소") return "취소";
  return orderStageIndex(shippingStatus) > orderStageIndex(status) ? shippingStatus : status;
}

function normalizeOrderForStorage(order) {
  const before = JSON.stringify({
    status: order.status,
    shippingStatus: order.shippingStatus,
    paymentStatus: order.paymentStatus
  });
  let status = bestOrderStatus(order);
  let paymentStatus = String(order.paymentStatus || "입금대기").trim();
  const paymentMethod = String(order.customer?.paymentMethod || "").replace(/\s+/g, "");

  if ((paymentStatus === "카드 결제" || paymentMethod === "카드결제") && orderStageIndex(status) < orderStageIndex("결제 완료")) {
    status = "결제 완료";
  }

  if (orderStageIndex(status) >= orderStageIndex("결제 완료") && ["입금대기", "계좌이체", "카드 결제"].includes(paymentStatus)) {
    paymentStatus = "결제 완료";
  }

  if (paymentMethod === "계좌이체" && orderStageIndex(status) < orderStageIndex("결제 완료")) {
    paymentStatus = "입금대기";
  }

  order.status = status;
  order.shippingStatus = status;
  order.paymentStatus = paymentStatus;

  return before !== JSON.stringify({
    status: order.status,
    shippingStatus: order.shippingStatus,
    paymentStatus: order.paymentStatus
  });
}

function advanceOrderStatus(current, next) {
  const currentStatus = canonicalOrderStatus(current);
  const nextStatus = canonicalOrderStatus(next);

  if (currentStatus === "취소") return "취소";
  if (!ORDER_STAGES.includes(nextStatus)) return currentStatus;
  return orderStageIndex(nextStatus) >= orderStageIndex(currentStatus) ? nextStatus : currentStatus;
}

function normalizeTrackingCode(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const upper = raw.toUpperCase().replace(/[\s-]+/g, "_");
  const aliases = {
    INFO_RECEIVED: "INFORMATION_RECEIVED",
    READY: "INFORMATION_RECEIVED",
    PRE_TRANSIT: "INFORMATION_RECEIVED",
    PICKUP: "AT_PICKUP",
    PICKED_UP: "AT_PICKUP",
    INTRANSIT: "IN_TRANSIT",
    TRANSIT: "IN_TRANSIT",
    OUT_DELIVERY: "OUT_FOR_DELIVERY",
    OUTFORDELIVERY: "OUT_FOR_DELIVERY",
    DELIVERED: "DELIVERED",
    COMPLETE: "DELIVERED",
    COMPLETED: "DELIVERED",
    DELIVERY_COMPLETE: "DELIVERED",
    EXCEPTION: "EXCEPTION",
    UNKNOWN: "UNKNOWN"
  };

  return aliases[upper] || upper;
}

function trackingCodeFromText(text) {
  const value = String(text || "");
  if (/배송완료|배달완료|전달완료|delivered|complete/i.test(value)) return "DELIVERED";
  if (/배송중|이동중|운송중|집하|도착|출발|in transit/i.test(value)) return "IN_TRANSIT";
  if (/배송시작|상품인수|인수|접수|pickup|information received/i.test(value)) return "AT_PICKUP";
  return "";
}

function findFirstValue(source, paths) {
  for (const pathList of paths) {
    let cursor = source;
    for (const key of pathList) {
      if (cursor == null) break;
      cursor = cursor[key];
    }
    if (cursor !== undefined && cursor !== null && String(cursor).trim()) return cursor;
  }
  return "";
}

function flattenTrackingEvents(payload) {
  const roots = [
    payload?.data?.track,
    payload?.track,
    payload?.data,
    payload
  ].filter(Boolean);

  for (const root of roots) {
    if (Array.isArray(root.progresses) && root.progresses.length) return root.progresses;
    if (Array.isArray(root.events) && root.events.length) return root.events;
    if (Array.isArray(root.events?.edges) && root.events.edges.length) {
      return root.events.edges.map(edge => edge.node).filter(Boolean);
    }
  }

  return [];
}

function normalizeLocation(location) {
  if (!location) return "";
  if (typeof location === "string") return location;
  return [location.name, location.city, location.province, location.countryCode]
    .filter(Boolean)
    .join(" ");
}

function normalizeTrackingPayload(payload) {
  const track = payload?.data?.track || payload?.track || payload?.data || payload || {};
  const events = flattenTrackingEvents(payload);
  const lastEvent = track.lastEvent || events[events.length - 1] || track.state || {};
  const statusSource = lastEvent.status || track.state || {};
  const rawCode = findFirstValue({ track, lastEvent, statusSource }, [
    ["lastEvent", "status", "code"],
    ["lastEvent", "status", "id"],
    ["lastEvent", "statusCode"],
    ["statusSource", "code"],
    ["statusSource", "id"],
    ["track", "state", "code"],
    ["track", "state", "id"]
  ]);
  const text = String(findFirstValue({ track, lastEvent, statusSource }, [
    ["lastEvent", "status", "name"],
    ["lastEvent", "status", "text"],
    ["lastEvent", "description"],
    ["statusSource", "name"],
    ["statusSource", "text"],
    ["track", "state", "text"]
  ]) || "");
  const code = normalizeTrackingCode(rawCode) || trackingCodeFromText(text);

  return {
    code,
    text,
    description: String(lastEvent.description || lastEvent.message || text || "").trim(),
    time: String(lastEvent.time || lastEvent.datetime || lastEvent.createdAt || "").trim(),
    location: normalizeLocation(lastEvent.location || track.location),
    eta: String(findFirstValue({ track, payload }, [
      ["track", "estimatedDeliveryTime"],
      ["track", "estimatedDeliveryDate"],
      ["track", "estimatedDelivery"],
      ["track", "delivery", "estimatedAt"],
      ["track", "delivery", "estimatedTime"],
      ["payload", "estimatedDeliveryTime"],
      ["payload", "estimatedDeliveryDate"]
    ]) || "").trim(),
    events
  };
}

async function fetchTracking(order) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);

  try {
    const url = `https://apis.tracker.delivery/carriers/${encodeURIComponent(order.carrierId)}/tracks/${encodeURIComponent(order.trackingNumber)}`;
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { ok: false, data, error: "실시간 배송조회 API 응답을 받지 못했습니다." };
    }

    return { ok: true, data, tracking: normalizeTrackingPayload(data) };
  } catch {
    return { ok: false, data: null, error: "실시간 배송조회 API에 연결하지 못했습니다." };
  } finally {
    clearTimeout(timer);
  }
}

async function syncOrderTracking(order, { force = false } = {}) {
  if (!order || bestOrderStatus(order) === "취소") {
    return { changed: false, skipped: true };
  }

  if (!order.carrierId || !order.trackingNumber) {
    return { changed: false, skipped: true };
  }

  if (orderStageIndex(bestOrderStatus(order)) < orderStageIndex("결제 완료")) {
    return { changed: false, skipped: true, reason: "payment_pending" };
  }

  const syncedAt = order.trackingSyncedAt ? Date.parse(order.trackingSyncedAt) : 0;
  if (!force && syncedAt && Date.now() - syncedAt < 5 * 60 * 1000) {
    return { changed: false, cached: true };
  }

  const result = await fetchTracking(order);
  const before = JSON.stringify({
    status: order.status,
    shippingStatus: order.shippingStatus,
    trackingLastCode: order.trackingLastCode,
    trackingLastText: order.trackingLastText,
    trackingLastDescription: order.trackingLastDescription,
    trackingLastLocation: order.trackingLastLocation,
    trackingLastTime: order.trackingLastTime,
    trackingEta: order.trackingEta,
    trackingSyncedAt: order.trackingSyncedAt,
    trackingSyncError: order.trackingSyncError
  });

  order.trackingSyncedAt = new Date().toISOString();

  if (!result.ok) {
    order.trackingSyncError = result.error;
    return {
      changed: before !== JSON.stringify({
        status: order.status,
        shippingStatus: order.shippingStatus,
        trackingLastCode: order.trackingLastCode,
        trackingLastText: order.trackingLastText,
        trackingLastDescription: order.trackingLastDescription,
        trackingLastLocation: order.trackingLastLocation,
        trackingLastTime: order.trackingLastTime,
        trackingEta: order.trackingEta,
        trackingSyncedAt: order.trackingSyncedAt,
        trackingSyncError: order.trackingSyncError
      }),
      error: result.error,
      data: result.data
    };
  }

  const tracking = result.tracking || {};
  const mappedStatus = TRACKING_STATUS_TO_ORDER_STATUS[tracking.code];
  if (mappedStatus) {
    const nextStatus = advanceOrderStatus(bestOrderStatus(order), mappedStatus);
    order.status = nextStatus;
    order.shippingStatus = nextStatus;
  }

  order.trackingLastCode = tracking.code || "";
  order.trackingLastText = tracking.text || "";
  order.trackingLastDescription = tracking.description || "";
  order.trackingLastLocation = tracking.location || "";
  order.trackingLastTime = tracking.time || "";
  order.trackingEta = tracking.eta || "";
  order.trackingSyncError = "";
  order.updatedAt = new Date().toISOString();

  return {
    changed: before !== JSON.stringify({
      status: order.status,
      shippingStatus: order.shippingStatus,
      trackingLastCode: order.trackingLastCode,
      trackingLastText: order.trackingLastText,
      trackingLastDescription: order.trackingLastDescription,
      trackingLastLocation: order.trackingLastLocation,
      trackingLastTime: order.trackingLastTime,
      trackingEta: order.trackingEta,
      trackingSyncedAt: order.trackingSyncedAt,
      trackingSyncError: order.trackingSyncError
    }),
    tracking,
    data: result.data
  };
}

async function syncOrdersTracking(orders, predicate = () => true) {
  let changed = false;

  for (const order of orders) {
    if (!predicate(order)) continue;
    changed = normalizeOrderForStorage(order) || changed;
    const result = await syncOrderTracking(order);
    changed = changed || result.changed;
  }

  if (changed) await writeJson("orders.json", orders);
  return orders;
}

function makeOrderId(orders) {
  const now = new Date();
  const date = [
    String(now.getFullYear()).slice(2),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const existing = new Set(orders.map(order => order.id));
  let id = "";

  do {
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    id = `SI${date}${random}`;
  } while (existing.has(id));

  return id;
}

function cleanOrder(input, session) {
  const items = Array.isArray(input.items) ? input.items : [];
  if (items.length === 0) throw new Error("주문 상품이 없습니다.");

  const customer = input.customer || {};
  const paymentMethod = String(customer.paymentMethod || "카드 결제").trim();
  const paidByCard = paymentMethod.replace(/\s+/g, "") === "카드결제";
  const initialStatus = paidByCard ? "결제 완료" : "주문 처리중";
  const cleaned = {
    id: String(input.id || "").trim(),
    createdAt: new Date().toISOString(),
    status: initialStatus,
    paymentStatus: paidByCard ? "결제 완료" : "입금대기",
    shippingStatus: initialStatus,
    carrierId: "",
    carrierName: "",
    trackingNumber: "",
    adminMemo: "",
    userEmail: session && session.email ? session.email : "",
    customer: {
      name: String(customer.name || "").trim(),
      phone: String(customer.phone || "").trim(),
      address: String(customer.address || "").trim(),
      memo: String(customer.memo || "").trim(),
      paymentMethod
    },
    items: items.map(item => ({
      id: Number(item.id),
      name: String(item.name || "").trim(),
      price: Number(item.price || 0),
      image: normalizeImage(item.cartImage || item.image),
      optionName: String(item.optionName || "").trim(),
      selectedOption: String(item.selectedOption || "").trim()
    }))
  };

  if (!cleaned.customer.name || !cleaned.customer.phone) {
    throw new Error("이름과 연락처를 입력해주세요.");
  }

  cleaned.total = orderTotal(cleaned.items);
  return cleaned;
}

function cleanOrderUpdate(input, existing) {
  const existingStatus = bestOrderStatus(existing);
  const requestedStatus = canonicalOrderStatus(input.status || existing.status || "주문 처리중");
  let status = requestedStatus;
  let paymentStatus = String(input.paymentStatus || existing.paymentStatus || "입금대기").trim();

  if (requestedStatus === "취소") {
    return {
      ...existing,
      status: "취소",
      paymentStatus: "취소",
      shippingStatus: "취소",
      carrierId: String(input.carrierId || existing.carrierId || "").trim(),
      carrierName: String(input.carrierName || existing.carrierName || "").trim(),
      trackingNumber: String(input.trackingNumber || existing.trackingNumber || "").trim(),
      adminMemo: String(input.adminMemo || "").trim(),
      updatedAt: new Date().toISOString()
    };
  }

  if (orderStageIndex(existingStatus) > orderStageIndex("결제 완료") && orderStageIndex(requestedStatus) <= orderStageIndex("결제 완료")) {
    status = existingStatus;
  }

  if (["결제 완료", "카드 결제"].includes(paymentStatus) && orderStageIndex(status) <= orderStageIndex("주문 처리중")) {
    status = "결제 완료";
  }

  if (orderStageIndex(status) >= orderStageIndex("결제 완료") && ["입금대기", "계좌이체", "카드 결제"].includes(paymentStatus)) {
    paymentStatus = "결제 완료";
  }

  if (orderStageIndex(status) < orderStageIndex("결제 완료")) {
    paymentStatus = "입금대기";
  }

  return {
    ...existing,
    status,
    paymentStatus,
    shippingStatus: status,
    carrierId: String(input.carrierId || "").trim(),
    carrierName: String(input.carrierName || "").trim(),
    trackingNumber: String(input.trackingNumber || "").trim(),
    adminMemo: String(input.adminMemo || "").trim(),
    updatedAt: new Date().toISOString()
  };
}

async function serveFile(res, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";

  try {
    const body = await fs.readFile(filePath);
    send(res, 200, body, { "Content-Type": contentType });
  } catch (error) {
    if (error.code === "ENOENT") {
      send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
      return;
    }
    throw error;
  }
}

async function serveStatic(req, res, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const decoded = decodeURIComponent(requestedPath);
  const target = path.resolve(ROOT, `.${decoded}`);

  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (fsSync.existsSync(target) && fsSync.statSync(target).isDirectory()) {
    send(res, 404, "Not found", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  await serveFile(res, target);
}

async function handleApi(req, res, pathname) {
  const method = req.method;

  if (method === "GET" && pathname === "/api/products") {
    sendJson(res, 200, await readJson("products.json", []));
    return true;
  }

  if (method === "GET" && pathname === "/api/me") {
    const session = getSession(req);
    sendJson(res, 200, {
      authenticated: Boolean(session),
      user: publicUser(session)
    });
    return true;
  }

  if (method === "GET" && pathname === "/api/profile") {
    const session = getSession(req);
    if (!session || session.role !== "user") {
      sendJson(res, 401, { error: "로그인이 필요합니다." });
      return true;
    }

    const users = await readJson("users.json", []);
    const user = users.find(row => row.email === session.email);
    if (!user) {
      sendJson(res, 404, { error: "회원 정보를 찾을 수 없습니다." });
      return true;
    }

    sendJson(res, 200, { profile: cleanProfile(user.profile || {}, { name: user.name }) });
    return true;
  }

  if (method === "PUT" && pathname === "/api/profile") {
    const session = getSession(req);
    if (!session || session.role !== "user") {
      sendJson(res, 401, { error: "로그인이 필요합니다." });
      return true;
    }

    const body = await readBody(req);
    const users = await readJson("users.json", []);
    const index = users.findIndex(row => row.email === session.email);
    if (index === -1) {
      sendJson(res, 404, { error: "회원 정보를 찾을 수 없습니다." });
      return true;
    }

    const profile = cleanProfile(body, users[index].profile || { name: users[index].name });
    users[index].profile = profile;
    users[index].name = profile.name || users[index].name;
    await writeJson("users.json", users);

    const current = sessions.get(session.sid);
    if (current) {
      sessions.set(session.sid, {
        ...current,
        name: users[index].name,
        profile
      });
    }

    sendJson(res, 200, { user: publicUser(users[index]), profile });
    return true;
  }

  if (method === "POST" && pathname === "/api/signup") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim() || email.split("@")[0];

    if (!email.includes("@")) throw new Error("이메일을 올바르게 입력해주세요.");
    if (password.length < 4) throw new Error("비밀번호는 4자 이상 입력해주세요.");

    const users = await readJson("users.json", []);
    if (users.some(user => user.email === email)) {
      throw new Error("이미 가입된 이메일입니다.");
    }

    const passwordData = hashPassword(password);
    const user = {
      id: `U${Date.now()}`,
      name,
      email,
      role: "user",
      profile: { name, phone: "", address: "" },
      ...passwordData,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    await writeJson("users.json", users);

    const sid = createSession(publicUser(user));
    sendJson(res, 200, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(sid) });
    return true;
  }

  if (method === "POST" && pathname === "/api/login") {
    const body = await readBody(req);
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const users = await readJson("users.json", []);
    const user = users.find(row => row.email === email);

    if (!verifyPassword(password, user)) {
      sendJson(res, 401, { error: "이메일 또는 비밀번호가 맞지 않습니다." });
      return true;
    }

    const sid = createSession(publicUser(user));
    sendJson(res, 200, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(sid) });
    return true;
  }

  if (method === "POST" && pathname === "/api/logout") {
    const session = getSession(req);
    if (session) sessions.delete(session.sid);
    sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
    return true;
  }

  if (method === "POST" && pathname === "/api/orders") {
    const body = await readBody(req);
    const session = getSession(req);
    const orders = await readJson("orders.json", []);
    const order = cleanOrder(body, session);
    order.id = makeOrderId(orders);
    orders.unshift(order);
    await writeJson("orders.json", orders);
    sendJson(res, 200, { order });
    return true;
  }

  if (method === "GET" && pathname === "/api/my-orders") {
    const session = getSession(req);
    if (!session || session.role !== "user") {
      sendJson(res, 401, { error: "로그인 후 주문내역을 확인할 수 있습니다." });
      return true;
    }

    const orders = await readJson("orders.json", []);
    await syncOrdersTracking(orders, order => order.userEmail === session.email);
    sendJson(res, 200, orders.filter(order => order.userEmail === session.email));
    return true;
  }

  const trackingMatch = pathname.match(/^\/api\/tracking\/([^/]+)$/);
  if (trackingMatch && method === "GET") {
    const session = getSession(req);
    if (!session) {
      sendJson(res, 401, { error: "로그인이 필요합니다." });
      return true;
    }

    const orderId = decodeURIComponent(trackingMatch[1]);
    const orders = await readJson("orders.json", []);
    const order = orders.find(row => row.id === orderId);
    const canView = order && (session.role === "admin" || order.userEmail === session.email);

    if (!canView) {
      sendJson(res, 404, { error: "주문을 찾을 수 없습니다." });
      return true;
    }

    if (!order.carrierId || !order.trackingNumber) {
      sendJson(res, 400, { error: "택배사와 운송장번호가 아직 등록되지 않았습니다." });
      return true;
    }

    const result = await syncOrderTracking(order, { force: true });
    if (result.changed) await writeJson("orders.json", orders);

    if (result.error) {
      sendJson(res, 502, { error: result.error, order });
      return true;
    }

    sendJson(res, 200, {
      ok: true,
      provider: "Delivery Tracker",
      order,
      tracking: result.tracking || null,
      data: result.data || null
    });
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/login") {
    const body = await readBody(req);
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      sendJson(res, 401, { error: "관리자 계정이 맞지 않습니다." });
      return true;
    }

    const admin = {
      id: "admin",
      name: "관리자",
      email: ADMIN_USER,
      role: "admin"
    };
    const sid = createSession(admin);
    sendJson(res, 200, { user: admin }, { "Set-Cookie": sessionCookie(sid) });
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/logout") {
    const session = getSession(req);
    if (session) sessions.delete(session.sid);
    sendJson(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie() });
    return true;
  }

  if (method === "GET" && pathname === "/api/admin/products") {
    if (!requireAdmin(req, res)) return true;
    sendJson(res, 200, await readJson("products.json", []));
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/products") {
    if (!requireAdmin(req, res)) return true;
    const products = await readJson("products.json", []);
    const nextId = products.reduce((max, product) => Math.max(max, Number(product.id || 0)), 0) + 1;
    const product = cleanProduct({ ...(await readBody(req)), id: nextId });
    products.push(product);
    await writeJson("products.json", products);
    sendJson(res, 201, { product });
    return true;
  }

  const productMatch = pathname.match(/^\/api\/admin\/products\/(\d+)$/);
  if (productMatch && method === "PUT") {
    if (!requireAdmin(req, res)) return true;
    const id = Number(productMatch[1]);
    const products = await readJson("products.json", []);
    const index = products.findIndex(product => Number(product.id) === id);
    if (index === -1) {
      sendJson(res, 404, { error: "상품을 찾을 수 없습니다." });
      return true;
    }
    products[index] = cleanProduct(await readBody(req), { id });
    await writeJson("products.json", products);
    sendJson(res, 200, { product: products[index] });
    return true;
  }

  if (productMatch && method === "DELETE") {
    if (!requireAdmin(req, res)) return true;
    const id = Number(productMatch[1]);
    const products = await readJson("products.json", []);
    const nextProducts = products.filter(product => Number(product.id) !== id);
    await writeJson("products.json", nextProducts);
    sendJson(res, 200, { ok: true });
    return true;
  }

  if (method === "GET" && pathname === "/api/admin/orders") {
    if (!requireAdmin(req, res)) return true;
    const orders = await readJson("orders.json", []);
    await syncOrdersTracking(orders);
    sendJson(res, 200, orders);
    return true;
  }

  const orderMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
  if (orderMatch && method === "PUT") {
    if (!requireAdmin(req, res)) return true;
    const orderId = decodeURIComponent(orderMatch[1]);
    const orders = await readJson("orders.json", []);
    const index = orders.findIndex(order => order.id === orderId);

    if (index === -1) {
      sendJson(res, 404, { error: "주문을 찾을 수 없습니다." });
      return true;
    }

    orders[index] = cleanOrderUpdate(await readBody(req), orders[index]);
    await writeJson("orders.json", orders);
    sendJson(res, 200, { order: orders[index] });
    return true;
  }

  if (method === "GET" && pathname === "/api/admin/images") {
    if (!requireAdmin(req, res)) return true;
    const files = await fs.readdir(path.join(ROOT, "images"), { withFileTypes: true });
    const images = files
      .filter(file => file.isFile() && /\.(png|jpe?g|webp)$/i.test(file.name))
      .map(file => `images/${file.name}`);
    sendJson(res, 200, images);
    return true;
  }

  if (method === "POST" && pathname === "/api/admin/upload-image") {
    if (!requireAdmin(req, res)) return true;
    const body = await readBody(req, 15 * 1024 * 1024);
    const buffer = decodeImageUpload(body);
    const fileName = safeImageFileName(body.fileName);
    const imagePath = path.join(ROOT, "images", fileName);
    await fs.writeFile(imagePath, buffer);
    sendJson(res, 201, { image: `images/${fileName}` });
    return true;
  }

  return false;
}

async function handle(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname === "/admin/login" && req.method === "GET") {
      await serveFile(res, path.join(VIEWS_DIR, "admin-login.html"));
      return;
    }

    if (pathname === "/admin" && req.method === "GET") {
      const session = getSession(req);
      if (!session || session.role !== "admin") {
        redirect(res, "/admin/login");
        return;
      }
      await serveFile(res, path.join(VIEWS_DIR, "admin.html"));
      return;
    }

    if (pathname === "/mypage" && req.method === "GET") {
      const session = getSession(req);
      if (!session) {
        redirect(res, "/");
        return;
      }
      if (session.role === "admin") {
        redirect(res, "/admin");
        return;
      }
      await serveFile(res, path.join(VIEWS_DIR, "mypage.html"));
      return;
    }

    if (pathname === "/mypage/orders" && req.method === "GET") {
      const session = getSession(req);
      if (!session) {
        redirect(res, "/");
        return;
      }
      if (session.role === "admin") {
        redirect(res, "/admin");
        return;
      }
      await serveFile(res, path.join(VIEWS_DIR, "my-orders.html"));
      return;
    }

    if (pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, pathname);
      if (!handled) sendJson(res, 404, { error: "API를 찾을 수 없습니다." });
      return;
    }

    await serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 400, { error: error.message || "요청을 처리하지 못했습니다." });
  }
}

async function boot() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(VIEWS_DIR, { recursive: true });
  await readJson("products.json", []);
  await readJson("users.json", []);
  await readJson("orders.json", []);

  http.createServer(handle).listen(PORT, "0.0.0.0", () => {
    console.log(`SEOUL ICE server: http://127.0.0.1:${PORT}`);
    console.log(`Admin login: http://127.0.0.1:${PORT}/admin/login`);
  });
}

boot().catch(error => {
  console.error(error);
  process.exit(1);
});
