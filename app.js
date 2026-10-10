(function () {
  function cl(e, s) {
    var t = e.target;
    return t && t.closest ? t.closest(s) : null;
  }
  window.onerror = function (m, s, l) {
    try {
      if (/[?&](admin|debug)/.test(location.search)) {
        var d = document.createElement("div");
        d.style.cssText =
          "position:fixed;left:0;right:0;top:0;z-index:99;background:#b00020;color:#fff;padding:8px 12px;font:13px monospace";
        d.textContent = "JS error: " + m + " (line " + l + ")";
        document.body.appendChild(d);
      }
    } catch (x) {}
  };
  document.addEventListener(
    "click",
    function (e) {
      var b = cl(e, "#hbtn"),
        m = cl(e, "#mbtn"),
        q = document.getElementById("mmm"),
        mm = document.getElementById("mm");
      if (b && q) {
        e.preventDefault();
        var on = q.className.indexOf("on") < 0;
        q.className = on ? "mmenu on" : "mmenu";
        b.setAttribute("aria-expanded", on);
        if (mm) mm.className = "mm";
        return;
      }
      if (m && mm) {
        e.preventDefault();
        var on2 = mm.className.indexOf("on") < 0;
        mm.className = on2 ? "mm on" : "mm";
        m.setAttribute("aria-expanded", on2);
        if (q) q.className = "mmenu";
        return;
      }
      if (
        q &&
        q.className.indexOf("on") > -1 &&
        (!cl(e, "#mmm") || cl(e, "#mmm a"))
      )
        q.className = "mmenu";
      if (mm && mm.className.indexOf("on") > -1 && !cl(e, ".more"))
        mm.className = "mm";
    },
    false
  );
})();
var S = JSON.parse(document.getElementById("state").textContent),
  owner = false,
  wantAdmin = false,
  filt = "all",
  tab = "pages",
  pi = 0,
  rt = "";
var BASE = /github\.io$/.test(location.hostname)
  ? "/" + location.pathname.split("/")[1] + "/"
  : "/";
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function $(i) {
  return document.getElementById(i);
}
function toast(m) {
  var t = $("toast");
  t.textContent = m;
  t.style.display = "block";
  setTimeout(function () {
    t.style.display = "none";
  }, 4000);
}
function tel(s) {
  return "tel:" + String(s).replace(/[^+\d]/g, "");
}
function prose(b) {
  return String(b || "")
    .split(/\n\n+/)
    .map(function (p) {
      return p.indexOf("## ") === 0
        ? "<h3>" + esc(p.slice(3)) + "</h3>"
        : "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>";
    })
    .join("");
}
function U(r) {
  return BASE + (r ? r + "/" : "");
}
function im(s) {
  return !s ? "" : /^(data:|http|\/)/.test(s) ? s : BASE + s;
}
function abs(p) {
  return /^http/.test(p) ? p : S.domain.replace(/\/+$/, "") + "/" + p;
}
function slug(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function find(r) {
  if (r === "write") return { k: "write" };
  var g = S.pages.filter(function (p) {
    return p.slug === r;
  })[0];
  if (g) return { k: "page", g: g };
  var m = r.match(/^blog\/(.+)$/);
  if (m) {
    var p = S.posts.filter(function (x) {
      return x.slug === m[1];
    })[0];
    if (p) return { k: "post", p: p };
  }
  return { k: "404" };
}
function getRoute() {
  var r = window.ROUTE;
  if (r == null) {
    r = location.pathname;
    if (r.indexOf(BASE) === 0) r = r.slice(BASE.length);
    r = r.replace(/index\.html$/, "").replace(/^\/+|\/+$/g, "");
  }
  var prod = /(jamiaentranceadda\.in|github\.io)$/.test(location.hostname);
  if (!prod) {
    owner = true;
    wantAdmin = true;
    if (window.ROUTE == null && find(r).k === "404") r = "";
  }
  if (r === "admin" || /[?&]admin/.test(location.search)) {
    wantAdmin = true;
    if (r === "admin") r = "";
  }
  return r;
}
function metaFor(r) {
  var f = find(r),
    t,
    d,
    type = "website",
    og = S.ogImage,
    ld = null;
  if (f.k === "post") {
    t = f.p.st || f.p.t;
    d = f.p.sd || S.siteDesc;
    type = "article";
    og = f.p.cover || og;
    ld = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: f.p.t,
      datePublished: f.p.date,
      image: og ? abs(og) : undefined,
      author: { "@type": "Person", name: f.p.au || "Jamia Entrance Adda" },
      publisher: { "@type": "Organization", name: "Jamia Entrance Adda" },
    };
  } else if (f.k === "page") {
    t = f.g.st || (r === "" ? S.siteTitle : f.g.t);
    d = f.g.sd || S.siteDesc;
  } else if (f.k === "write") {
    t = "Write for us";
    d = "Write and submit articles for Jamia Entrance Adda.";
  }
  t = t || S.siteTitle;
  d = d || S.siteDesc;
  if (r !== "" && t.indexOf("Jamia Entrance Adda") < 0)
    t += " | Jamia Entrance Adda";
  if (r === "")
    ld = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: "Jamia Entrance Adda",
      url: S.domain,
      telephone: S.phone1,
      email: S.email,
      address: S.address,
    };
  return { t: t, d: d, type: type, og: og, ld: ld };
}

var pq = {},
  saved = null;
S.banners = S.banners || [];
S.theme = S.theme || {};
var FONTS = [
  "Playfair Display",
  "Poppins",
  "Montserrat",
  "Lora",
  "Merriweather",
  "Raleway",
  "Oswald",
  "DM Serif Display",
  "Hind",
  "Fraunces",
  "Noto Sans Devanagari",
  "Caveat",
];
var FW = {
  "DM Serif Display": "",
  "Playfair Display": ":wght@400;600;800",
  Poppins: ":wght@400;500;600;700",
  Montserrat: ":wght@400;600;700;800",
  Lora: ":wght@400;600;700",
  Merriweather: ":wght@400;700",
  Raleway: ":wght@400;600;700",
  Oswald: ":wght@400;600;700",
  Hind: ":wght@400;500;600;700",
  Fraunces: ":wght@600;800",
  "Noto Sans Devanagari": ":wght@400;600;700",
  Caveat: ":wght@600",
};
var SZ = {
  1: ".8em",
  2: ".9em",
  3: "1em",
  4: "1.15em",
  5: "1.4em",
  6: "1.8em",
  7: "2.3em",
};
var PRE = {
  royal: {
    bg: "#0a0f1f",
    soft: "#0f1730",
    card: "#131c3a",
    line: "#26335c",
    text: "#f3efe4",
    mute: "#a9b3d1",
    brand: "#d4af37",
    brand2: "#b8932a",
    ink: "#1a1405",
    gold: "#d4af37",
    hf: "Playfair Display",
    bf: "Poppins",
  },
  ivory: {
    bg: "#fbf8f2",
    soft: "#f3ede0",
    card: "#ffffff",
    line: "#e6dcc6",
    text: "#1c1a16",
    mute: "#6b6458",
    brand: "#7a1f3d",
    brand2: "#5d152d",
    ink: "#ffffff",
    gold: "#b8902f",
    hf: "Playfair Display",
    bf: "Poppins",
  },
  ocean: {
    bg: "#f4f7ff",
    soft: "#e8eefc",
    card: "#ffffff",
    line: "#d3def5",
    text: "#0f1b3d",
    mute: "#53618a",
    brand: "#1d4ed8",
    brand2: "#1e3a9f",
    ink: "#ffffff",
    gold: "#f59e0b",
    hf: "Montserrat",
    bf: "Poppins",
  },
  charcoal: {
    bg: "#111113",
    soft: "#18181b",
    card: "#1f1f23",
    line: "#34343a",
    text: "#f5f5f4",
    mute: "#a1a1aa",
    brand: "#ff7a1a",
    brand2: "#e0640a",
    ink: "#1a0d02",
    gold: "#ff7a1a",
    hf: "Oswald",
    bf: "Poppins",
  },
};
function okc(c) {
  return /^#[0-9a-f]{3,8}$/i.test(String(c || ""));
}
function lum(h) {
  h = String(h).replace("#", "");
  if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
  var r = parseInt(h.substr(0, 2), 16),
    g = parseInt(h.substr(2, 2), 16),
    b = parseInt(h.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function fontsHref() {
  return (
    "https://fonts.googleapis.com/css2?" +
    FONTS.map(function (f) {
      return "family=" + f.replace(/ /g, "+") + FW[f];
    }).join("&") +
    "&display=swap"
  );
}
function fq(f) {
  return "'" + f + "',";
}
function themeCss() {
  var t = S.theme || {},
    p = PRE[t.preset] || PRE.royal,
    v = {};
  for (var k in p) v[k] = p[k];
  if (okc(t.text)) {
    v.text = t.text;
    v.mute = "color-mix(in srgb," + t.text + " 62%," + v.bg + ")";
  }
  if (okc(t.bg)) {
    v.bg = t.bg;
    v.soft = "color-mix(in srgb," + t.bg + " 91%," + v.text + " 9%)";
    v.card = "color-mix(in srgb," + t.bg + " 86%," + v.text + " 14%)";
    v.line = "color-mix(in srgb," + t.bg + " 78%," + v.text + " 22%)";
  }
  if (okc(t.brand)) {
    v.brand = t.brand;
    v.brand2 = "color-mix(in srgb," + t.brand + " 80%,#000)";
    v.ink = lum(t.brand) > 0.55 ? "#111111" : "#ffffff";
    v.gold = t.brand;
  }
  var hf = FONTS.indexOf(t.hf) > -1 ? t.hf : p.hf,
    bf = FONTS.indexOf(t.bf) > -1 ? t.bf : p.bf;
  return (
    ":root:root:root{--bg:" +
    v.bg +
    ";--soft:" +
    v.soft +
    ";--card:" +
    v.card +
    ";--line:" +
    v.line +
    ";--text:" +
    v.text +
    ";--mute:" +
    v.mute +
    ";--brand:" +
    v.brand +
    ";--brand2:" +
    v.brand2 +
    ";--ink:" +
    v.ink +
    ";--gold:" +
    v.gold +
    "}body{font-family:" +
    fq(bf) +
    "'Noto Sans Devanagari',system-ui,sans-serif}h1,h2,h3,.logo,.big{font-family:" +
    fq(hf) +
    "Georgia,serif}"
  );
}
function applyTheme() {
  var s = document.getElementById("theme");
  if (!s) {
    s = document.createElement("style");
    s.id = "theme";
    document.head.appendChild(s);
  }
  s.textContent = themeCss();
  if (!document.getElementById("gf")) {
    var l = document.createElement("link");
    l.id = "gf";
    l.rel = "stylesheet";
    l.href = fontsHref();
    document.head.appendChild(l);
  }
}
function fontOpts(sel) {
  return (
    '<option value="">Default</option>' +
    FONTS.map(function (f) {
      return (
        '<option value="' +
        f +
        '"' +
        (sel === f ? " selected" : "") +
        ">" +
        f +
        "</option>"
      );
    }).join("")
  );
}
var isPreview = !/(jamiaentranceadda\.in|github\.io)$/.test(location.hostname);

document.addEventListener("selectionchange", function () {
  var s = getSelection();
  if (s && s.rangeCount) {
    var r = s.getRangeAt(0),
      n = r.commonAncestorContainer,
      el = n.nodeType === 1 ? n : n.parentNode;
    if (el && el.closest && el.closest(".rte")) saved = r.cloneRange();
  }
});
var SV =
  '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">';
var ICON = {
  yt:
    SV +
    '<path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>',
  ig:
    SV +
    '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
  fb:
    SV +
    '<path fill="currentColor" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>',
  wa:
    SV +
    '<path d="M12 2.5a9.5 9.5 0 0 0-8.1 14.4L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path fill="currentColor" d="M8.7 7.6c-.3.3-.9 1-.9 1.8 0 1.6 1.3 3.2 2.6 4.4 1.3 1.1 3 2.1 4.4 2.1.9 0 1.5-.5 1.8-1l-.1-.8-1.8-.9-.9 1c-1.1-.4-2.7-1.9-3.2-3l.9-.9-.8-1.9z"/></svg>',
  play:
    SV +
    '<path fill="#2196F3" d="M3.6 2.2v19.6l10.3-9.8L3.6 2.2z"/><path fill="#FFC107" d="M17.2 8.7 13.9 12l3.3 3.3 3.9-2.2c1.1-.6 1.1-2.2 0-2.8l-3.9-2.2z"/><path fill="#F44336" d="M3.6 21.8c.3.1.6.1.9-.1l12.7-6.4L13.9 12 3.6 21.8z"/><path fill="#4CAF50" d="M3.6 2.2l10.3 9.8 3.3-3.3L4.5 2.3c-.3-.2-.6-.2-.9-.1z"/></svg>',
  tg:
    SV +
    '<path d="M21 4 3 11l6 2 2 6 3-4 5 4 2-15z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 13 21 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  li:
    SV +
    '<rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="8.2" r="1.3" fill="currentColor"/><path d="M7 11v6M11 17v-6M11 13.5c0-1.5 1-2.5 2.5-2.5S16 12 16 13.5V17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  web:
    SV +
    '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};
function iconOf(n, u) {
  var s = (String(n) + " " + String(u)).toLowerCase();
  return /youtu/.test(s)
    ? ["yt", "#ff0000"]
    : /insta/.test(s)
    ? ["ig", "#e1306c"]
    : /facebook|fb\.com|fb\.me/.test(s)
    ? ["fb", "#1877f2"]
    : /whatsapp|wa\.me/.test(s)
    ? ["wa", "#25d366"]
    : /play\.google|playstore|play store/.test(s)
    ? ["play", ""]
    : /telegram|t\.me/.test(s)
    ? ["tg", "#229ED9"]
    : /linkedin|linkdin/.test(s)
    ? ["li", "#0A66C2"]
    : ["web", "var(--brand)"];
}

function richHtml(b) {
  return /^\s*</.test(String(b || "")) ? clean(b) : prose(b);
}
function bodyHtml(b) {
  return richHtml(b);
}
function clean(h) {
  if (typeof DOMParser === "undefined") return "";
  var d = new DOMParser().parseFromString(
    "<body>" + h + "</body>",
    "text/html"
  );
  function W(n) {
    var o = "";
    n.childNodes.forEach(function (c) {
      if (c.nodeType === 3) o += esc(c.nodeValue);
      else if (c.nodeType === 1) {
        var t = c.tagName,
          i = W(c);
        if (t === "A") {
          var hr = (c.getAttribute("href") || "").trim();
          if (!hr || /^javascript:/i.test(hr)) o += i;
          else if (/^https:\/\/internal\.link\//i.test(hr)) {
            var r = hr
              .replace(/^https:\/\/internal\.link\//i, "")
              .replace(/^\/+|\/+$/g, "");
            o += '<a href="' + U(r) + '" data-r="' + esc(r) + '">' + i + "</a>";
          } else if (/^(https?:|mailto:|tel:)/i.test(hr)) {
            var yv = ytId(hr);
            o += yv
              ? '<a href="https://www.youtube.com/watch?v=' +
                yv +
                '" data-yt="' +
                yv +
                '">' +
                i +
                "</a>"
              : '<a href="' +
                esc(hr) +
                '" target="_blank" rel="noopener">' +
                i +
                "</a>";
          } else o += i;
        } else if (t === "B" || t === "STRONG")
          o += "<strong>" + i + "</strong>";
        else if (t === "I" || t === "EM") o += "<em>" + i + "</em>";
        else if (t === "U") o += "<u>" + i + "</u>";
        else if (t === "H1" || t === "H2") o += "<h2>" + i + "</h2>";
        else if (t === "H3" || t === "H4") o += "<h3>" + i + "</h3>";
        else if (t === "P" || t === "DIV") o += "<p>" + i + "</p>";
        else if (t === "UL" || t === "OL" || t === "LI" || t === "BLOCKQUOTE")
          o += "<" + t.toLowerCase() + ">" + i + "</" + t.toLowerCase() + ">";
        else if (t === "BR") o += "<br>";
        else if (t === "FONT" || t === "SPAN") {
          var st = [],
            col = c.getAttribute("color") || (c.style && c.style.color) || "",
            fc =
              c.getAttribute("face") || (c.style && c.style.fontFamily) || "",
            sz = c.getAttribute("size");
          col = String(col).trim();
          if (/^(#[0-9a-f]{3,8}|rgb\([\d\s,.%]+\))$/i.test(col))
            st.push("color:" + col);
          fc = String(fc).replace(/["']/g, "").split(",")[0].trim();
          if (FONTS.indexOf(fc) > -1) st.push("font-family:'" + fc + "'");
          if (sz && SZ[sz]) st.push("font-size:" + SZ[sz]);
          o += st.length
            ? '<span style="' + st.join(";") + '">' + i + "</span>"
            : i;
        } else if (!/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED)$/.test(t)) o += i;
      }
    });
    return o;
  }
  return W(d.body).replace(/<p>(<br>)?<\/p>/g, "");
}
function driveId(l) {
  var m =
    String(l).match(/\/d\/([\w-]{10,})/) ||
    String(l).match(/[?&]id=([\w-]{10,})/);
  return m ? m[1] : "";
}
function pdfInfo(l) {
  var id = driveId(l);
  if (id)
    return {
      src: "https://drive.google.com/file/d/" + id + "/preview",
      open: "https://drive.google.com/file/d/" + id + "/view",
      dl: "https://drive.google.com/uc?export=download&id=" + id,
    };
  var u = im(l),
    a = /^http/.test(u) ? u : location.origin + u;
  return {
    src:
      "https://docs.google.com/gview?embedded=true&url=" +
      encodeURIComponent(a),
    open: u,
    dl: u,
  };
}
function openPv(nd) {
  var f = pdfInfo(nd.link);
  $("pvt").textContent = nd.n;
  $("pvf").src = f.src;
  $("pvo").href = f.open;
  $("pvd").href = f.dl;
  $("pv").className = "modal on";
}
function openYt(id) {
  $("yvb").innerHTML =
    '<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/' +
    id +
    '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>';
  $("yv").className = "modal on";
}
function ytId(u) {
  var m = String(u || "").match(
    /(?:v=|youtu\.be\/|embed\/|live\/|shorts\/)([\w-]{11})/
  );
  return m ? m[1] : "";
}

function anc(l, cls, inner, extra) {
  l = String(l || "").trim();
  var c = ' class="' + cls + '"' + (extra || "");
  if (!l) return "<div" + c + ">" + inner + "</div>";
  var yy = ytId(l);
  if (yy)
    return (
      "<a" +
      c +
      ' href="https://www.youtube.com/watch?v=' +
      yy +
      '" data-yt="' +
      yy +
      '">' +
      inner +
      "</a>"
    );
  if (/^(https?:|\/\/)/.test(l))
    return (
      "<a" +
      c +
      ' href="' +
      esc(l) +
      '" target="_blank" rel="noopener">' +
      inner +
      "</a>"
    );
  if (l.charAt(0) === "#")
    return (
      "<a" +
      c +
      ' href="' +
      esc(l) +
      '" data-s="' +
      esc(l.slice(1)) +
      '">' +
      inner +
      "</a>"
    );
  var r = l.replace(/^\/+|\/+$/g, "");
  return (
    "<a" + c + ' href="' + U(r) + '" data-r="' + esc(r) + '">' + inner + "</a>"
  );
}
function bannerHtml() {
  var b = (S.banners || []).filter(function (x) {
    return x.img;
  });
  if (!b.length) return "";
  return (
    '<div class="bn"><div class="bn-track">' +
    b
      .map(function (x, k) {
        return anc(
          x.link,
          "bn-s",
          '<img src="' +
            esc(im(x.img)) +
            '" alt="Banner ' +
            (k + 1) +
            '"' +
            (k ? ' loading="lazy"' : "") +
            ">"
        );
      })
      .join("") +
    "</div>" +
    (b.length > 1
      ? '<div class="bn-dots">' +
        b
          .map(function (x, k) {
            return "<i" + (k ? "" : ' class="on"') + "></i>";
          })
          .join("") +
        "</div>"
      : "") +
    "</div>"
  );
}
var bnT = null;
function initBanner() {
  clearInterval(bnT);
  var tr = document.querySelector(".bn-track");
  if (!tr) return;
  var n = tr.children.length,
    dots = [].slice.call(document.querySelectorAll(".bn-dots i")),
    hold = 0;
  if (n < 2) return;
  function step() {
    return tr.children[0].offsetWidth + 12;
  }
  function go2(i) {
    tr.scrollTo({ left: i * step(), behavior: "smooth" });
  }
  tr.addEventListener("scroll", function () {
    var i = Math.round(tr.scrollLeft / step());
    dots.forEach(function (d, k) {
      d.className = k === i ? "on" : "";
    });
  });
  ["touchstart", "mousedown"].forEach(function (e) {
    tr.addEventListener(e, function () {
      hold = Date.now() + 6000;
    });
  });
  dots.forEach(function (d, k) {
    d.onclick = function () {
      hold = Date.now() + 6000;
      go2(k);
    };
  });
  bnT = setInterval(function () {
    if (Date.now() < hold) return;
    var i = Math.round(tr.scrollLeft / step()) + 1;
    go2(i >= n ? 0 : i);
  }, 4500);
}

function popupCfg() {
  var o = {
      on: "y",
      title: "Start your journey with Jamia Entrance Adda",
      text: "Fill out the details below and our academic counsellor will contact you.",
      button: "Request free counselling",
      delay: "2",
      freq: "session",
      opts: "JMI (Jamia Millia Islamia)\nAMU (Aligarh Muslim University)\nCUET UG\nCLAT / Law entrance exams",
    },
    u = S.popup || {};
  for (var k in u) o[k] = u[k];
  return o;
}
function promoCfg() {
  var o = {
      on: "n",
      img: "",
      title: "Get our app",
      text: "Live classes, tests and notes on your phone.",
      button: "Open",
      link: "",
      delay: "8",
      freq: "session",
    },
    u = S.promo || {};
  for (var k in u) o[k] = u[k];
  return o;
}
function cpHtml() {
  var c = popupCfg();
  return (
    '<div class="modal" id="cp"><div class="mbox"><button class="x" id="cpx" aria-label="Close">&times;</button><h2 style="font-size:26px;margin:6px 34px 6px 0">' +
    esc(c.title) +
    '</h2><p class="sub" style="margin:0 0 14px">' +
    esc(c.text) +
    '</p><form id="cf" style="gap:12px"><label>Full name<input id="cn" placeholder="Enter your full name" required></label><label>WhatsApp / phone number<div class="ph10"><span>+91</span><input id="cph" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" placeholder="10-digit number" required></div></label><label>Email address<input id="ce" type="email" placeholder="you@example.com"></label><label>Preparing for<select id="cc"><option value="">Select your exam...</option>' +
    String(c.opts || "")
      .split("\n")
      .map(function (x) {
        return x.trim();
      })
      .filter(Boolean)
      .map(function (x) {
        return "<option>" + esc(x) + "</option>";
      })
      .join("") +
    '</select></label><button class="btn" type="submit">' +
    esc(c.button) +
    " &rarr;</button></form></div></div>"
  );
}
function ppHtml() {
  var c = promoCfg();
  if (c.on !== "y" || (!c.img && !c.title)) return "";
  return (
    '<div class="sheetp" id="pp"><button class="x" id="ppx" aria-label="Close">&times;</button>' +
    (c.img
      ? anc(
          c.link,
          "pimg",
          '<img src="' + esc(im(c.img)) + '" alt="' + esc(c.title) + '">'
        )
      : "") +
    '<div class="pb">' +
    (c.title ? '<b style="font-size:18px">' + esc(c.title) + "</b>" : "") +
    (c.text
      ? '<p style="margin:4px 0 12px;color:var(--mute)">' + esc(c.text) + "</p>"
      : "") +
    '<div class="row">' +
    (c.link ? lk(c.link, c.button || "Open", "btn sm") : "") +
    (S.playUrl
      ? '<a class="btn ghost sm" href="' +
        esc(S.playUrl) +
        '" target="_blank" rel="noopener">' +
        ICON.play +
        "<span>" +
        esc(S.playText || "Get the app") +
        "</span></a>"
      : "") +
    "</div></div></div>"
  );
}
var popDone = false;
function showOnce(k, fr) {
  if (fr === "always") return true;
  try {
    if (fr === "daily") {
      var t = +localStorage["jea_" + k] || 0;
      if (Date.now() - t < 864e5) return false;
      localStorage["jea_" + k] = Date.now();
      return true;
    }
    if (sessionStorage["jea_" + k]) return false;
    sessionStorage["jea_" + k] = "1";
  } catch (e) {}
  return true;
}
function initPopups() {
  if (popDone) return;
  if (!isPreview && (owner || wantAdmin)) return;
  popDone = true;
  var c = popupCfg(),
    p = promoCfg();
  if (c.on !== "n" && showOnce("cp", c.freq))
    setTimeout(function () {
      var m = $("cp");
      if (m) m.className = "modal on";
    }, (+c.delay || 2) * 1000);
  if (p.on === "y" && showOnce("pp", p.freq))
    setTimeout(function () {
      var m = $("pp");
      if (m && !document.querySelector(".modal.on")) m.className = "sheetp on";
      else if (m)
        setTimeout(function () {
          var z = $("pp");
          if (z) z.className = "sheetp on";
        }, 6000);
    }, (+p.delay || 8) * 1000);
}
function wirePop() {
  if ($("cpx")) {
    $("cpx").onclick = function () {
      $("cp").className = "modal";
    };
    $("cp").onclick = function (e) {
      if (e.target === $("cp")) $("cp").className = "modal";
    };
    $("cf").onsubmit = function (e) {
      e.preventDefault();
      var ph = $("cph").value.replace(/\D/g, "");
      if (ph.length !== 10) {
        toast("10 digit ka number daalo");
        return;
      }
      sendLead({
        form: "Counselling popup",
        name: $("cn").value,
        phone: "+91" + ph,
        email: $("ce").value,
        course: $("cc").value,
      });
      afterLead(
        "Counselling request\nName: " +
          $("cn").value +
          "\nPhone: +91" +
          ph +
          ($("ce").value ? "\nEmail: " + $("ce").value : "") +
          ($("cc").value ? "\nPreparing for: " + $("cc").value : "")
      );
      $("cp").className = "modal";
    };
  }
  if ($("ppx"))
    $("ppx").onclick = function () {
      $("pp").className = "sheetp";
    };
}
function initAnim() {
  if (
    !window.IntersectionObserver ||
    (window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches)
  )
    return;
  document.querySelectorAll(".big").forEach(function (el) {
    var m = el.textContent.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!m) return;
    var end = parseFloat(m[2].replace(/,/g, "")),
      dec = (m[2].split(".")[1] || "").length,
      comma = m[2].indexOf(",") > -1;
    if (isNaN(end)) return;
    el.textContent = m[1] + "0" + m[3];
    var o = new IntersectionObserver(
      function (en) {
        if (en[0].isIntersecting) {
          o.disconnect();
          var t0 = null;
          (function f(t) {
            if (!t0) t0 = t;
            var p = Math.min(1, (t - t0) / 1400),
              v = end * (1 - Math.pow(1 - p, 3)),
              s = v.toFixed(dec);
            if (comma) s = Number(s).toLocaleString("en-IN");
            el.textContent = m[1] + s + m[3];
            if (p < 1) requestAnimationFrame(f);
          })(performance.now());
        }
      },
      { threshold: 0.4 }
    );
    o.observe(el);
  });
  var els = document.querySelectorAll(
    "main section .eyebrow,main section h2,main section .sub,main section .card,main section .tc,main section .prose,main section .split>*,main section .cta,main section figure,main section .cover,main section .vid,main section .stats .card,main section .crumbs"
  );
  var io = new IntersectionObserver(
    function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(function (el, k) {
    var r = el.getBoundingClientRect();
    if (r.top > innerHeight * 0.92) {
      el.classList.add("rv");
      el.style.animationDelay = (k % 4) * 90 + "ms";
      io.observe(el);
    }
  });
}

function hl(t) {
  return esc(t).replace(/\*([^*]+)\*/g, '<span class="acc">$1</span>');
}
function hw(t) {
  var k = 0,
    o = [];
  String(t || "").replace(/\*([^*]+)\*|([^*]+)/g, function (m, a, b) {
    var acc = a != null,
      tx = acc ? a : b;
    tx.split(/\s+/)
      .filter(Boolean)
      .forEach(function (w) {
        o.push(
          '<span class="w"><span' +
            (acc ? ' class="acc"' : "") +
            ' style="--i:' +
            k++ +
            '">' +
            esc(w) +
            "</span></span>"
        );
      });
    return "";
  });
  return o.join(" ");
}
function cardIn(img, body, link) {
  var y = ytId(link);
  if (y && !img) img = "https://img.youtube.com/vi/" + y + "/hqdefault.jpg";
  var m = img
    ? '<img class="cimg" loading="lazy" alt="" src="' + esc(im(img)) + '">'
    : "";
  if (img && y)
    m =
      '<a class="cv" href="https://www.youtube.com/watch?v=' +
      y +
      '" data-yt="' +
      y +
      '">' +
      m +
      '<i class="pbtn" aria-label="Play video"></i></a>';
  return (
    '<div class="card cd">' + m + '<div class="cb">' + body + "</div></div>"
  );
}

function sendLead(d) {
  d.page = location.pathname;
  d.time = new Date().toISOString();
  if (S.sheetUrl) {
    try {
      fetch(S.sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(d),
        keepalive: true,
      });
    } catch (e) {}
  }
}
function afterLead(text) {
  if (S.waAfter === "n" && S.sheetUrl) {
    toast("Thank you! Hum jald aapse sampark karenge.");
  } else {
    window.open(
      "https://wa.me/" + S.wa + "?text=" + encodeURIComponent(text),
      "_blank"
    );
  }
}
function tcInfo(t) {
  return (
    (t.course || t.uni
      ? "<small>" +
        esc([t.course, t.uni].filter(Boolean).join(" | ")) +
        "</small>"
      : "") + (t.roll ? "<small>Roll No: " + esc(t.roll) + "</small>" : "")
  );
}

var FA0 =
  "Online coaching for JMI, AMU, CUET and CLAT entrance exams. Live classes, daily practice and mock tests.";
function footerDefaults() {
  var ex = ["jmi", "amu", "cuet"],
    pg = S.pages
      .filter(function (p) {
        return p.nav !== "n" && ex.indexOf(p.slug) < 0;
      })
      .map(function (p) {
        return { t: p.t, l: p.slug === "" ? "/" : p.slug };
      }),
    exm = S.pages
      .filter(function (p) {
        return ex.indexOf(p.slug) > -1;
      })
      .map(function (p) {
        return { t: p.t, l: p.slug };
      });
  exm.push({ t: "All courses", l: "courses" });
  var yt = (S.social || []).filter(function (x) {
      return /youtu/i.test(x.u + x.n);
    })[0],
    st = [{ t: "Student login", l: S.loginUrl || "" }];
  if (S.playUrl) st.push({ t: "Download our app", l: S.playUrl });
  if (S.fb && S.fb.apiKey) st.push({ t: "Write for us", l: "write" });
  if (yt && yt.u) st.push({ t: "YouTube channel", l: yt.u });
  st.push({ t: "WhatsApp us", l: "https://wa.me/" + S.wa });
  return [
    { h: "Pages", links: pg },
    { h: "Exams", links: exm },
    { h: "For students", links: st },
  ];
}
function socIcons() {
  return (S.social || [])
    .filter(function (x) {
      return x.u;
    })
    .map(function (x) {
      var o = iconOf(x.n, x.u);
      return (
        '<a class="sic" href="' +
        esc(x.u) +
        '" target="_blank" rel="noopener" aria-label="' +
        esc(x.n) +
        '" title="' +
        esc(x.n) +
        '" style="--c:' +
        o[1] +
        '">' +
        ICON[o[0]] +
        "</a>"
      );
    })
    .join("");
}
function footerHtml() {
  var cols = S.footerCols || footerDefaults(),
    lg = (S.legal || []).filter(function (x) {
      return x.t;
    });
  return (
    '<footer><div class="wrap"><div class="fg"><div class="fa">' +
    L(
      "",
      (S.logo ? '<img alt="" src="' + esc(im(S.logo)) + '">' : "<i>J</i>") +
        "<span>Jamia Entrance Adda</span>",
      "logo"
    ) +
    "<p>" +
    esc(S.footerAbout || FA0) +
    "</p>" +
    (S.playUrl
      ? '<a class="fapp" href="' +
        esc(S.playUrl) +
        '" target="_blank" rel="noopener">' +
        ICON.play +
        "<span><small>GET IT ON</small>Google Play</span></a>"
      : "") +
    "</div>" +
    cols
      .map(function (c) {
        return (
          "<div><h4>" +
          esc(c.h) +
          "</h4><ul>" +
          (c.links || [])
            .map(function (x) {
              return "<li>" + lk(x.l || "/", x.t || "Link", "fl") + "</li>";
            })
            .join("") +
          "</ul></div>"
        );
      })
      .join("") +
    '<div><h4>Contact</h4><ul class="fc"><li>' +
    esc(S.address) +
    '</li><li><a href="' +
    tel(S.phone1) +
    '">' +
    esc(S.phone1) +
    '</a></li><li><a href="' +
    tel(S.phone2) +
    '">' +
    esc(S.phone2) +
    '</a></li><li><a href="mailto:' +
    esc(S.email) +
    '">' +
    esc(S.email) +
    '</a></li></ul></div></div><div class="fcn"><h4>Connect with us</h4><p>Follow us for daily practice, updates and results.</p><div class="sics">' +
    socIcons() +
    '</div></div><div class="fbot"><span>' +
    esc(S.footer) +
    "</span>" +
    (lg.length
      ? '<span class="flegal">' +
        lg
          .map(function (x) {
            return lk(x.l || "/", x.t, "");
          })
          .join("") +
        "</span>"
      : "") +
    "</div></div></footer>"
  );
}

function headerHtml(r) {
  var N = nav(),
    nm = +S.navM || 4,
    nd = +S.navD || 6;
  var chips = N.map(function (n, i) {
    return L(
      n[0],
      esc(n[1]),
      (r === n[0] ? "on " : "") + (i >= nm ? "hm " : "") + (i >= nd ? "hd" : "")
    );
  }).join("");
  var items = N.map(function (n, i) {
    return i < nm ? "" : L(n[0], esc(n[1]), "mi" + (i < nd ? " om" : ""));
  }).join("");
  return (
    '<header><div class="wrap hh">' +
    L(
      "",
      (S.logo ? '<img alt="" src="' + esc(im(S.logo)) + '">' : "<i>J</i>") +
        "<span>Jamia Entrance Adda</span>",
      "logo"
    ) +
    '<button class="hbtn" id="hbtn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mmm"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button><nav aria-label="Main menu">' +
    chips +
    '<div class="more"><button class="mb" id="mbtn" type="button" aria-expanded="false" aria-controls="mm">More <span aria-hidden="true">&#9662;</span></button><div class="mm" id="mm">' +
    items +
    (fbOn() ? L("write", "Write for us", "mi") : "") +
    '<a class="mi" href="#" data-login="1">Login / Register</a></div></div></nav></div><div class="mmenu" id="mmm">' +
    N.map(function (n) {
      return L(n[0], esc(n[1]), r === n[0] ? "on" : "");
    }).join("") +
    (fbOn() ? L("write", "Write for us", r === "write" ? "on" : "") : "") +
    '<a class="lg" href="#" data-login="1">Login / Register</a></div></header>'
  );
}

function plain(h) {
  return String(h || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/## /g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function excerpt(p) {
  var t = p.sd ? plain(p.sd) : plain(p.body);
  if (p.t && t.indexOf(p.t) === 0) t = t.slice(p.t.length).trim();
  if (t.length > 130) {
    t = t.slice(0, 130);
    var k = t.lastIndexOf(" ");
    t = t.slice(0, k > 60 ? k : 130).replace(/[,;:\-\s]+$/, "") + "...";
  }
  return t;
}
function writeCta() {
  if (!fbOn()) return "";
  return (
    '<div class="wcta"><div><b>Write for Jamia Entrance Adda</b><p>Create an account with your phone number and password, write your article and submit it. Approved articles are published with your name.</p></div>' +
    L("write", "Write for us", "btn") +
    "</div>"
  );
}
function nav() {
  return S.pages
    .filter(function (p) {
      return p.nav !== "n";
    })
    .map(function (p) {
      return [p.slug, p.t];
    });
}
function lk(l, txt, cls) {
  l = String(l || "").trim();
  if (!l) return "";
  var yy = ytId(l);
  if (yy)
    return (
      '<a class="' +
      cls +
      '" href="https://www.youtube.com/watch?v=' +
      yy +
      '" data-yt="' +
      yy +
      '">' +
      esc(txt) +
      "</a>"
    );
  if (/^(https?:|\/\/)/.test(l))
    return (
      '<a class="' +
      cls +
      '" href="' +
      esc(l) +
      '" target="_blank" rel="noopener">' +
      esc(txt) +
      "</a>"
    );
  if (/^(mailto:|tel:)/.test(l))
    return '<a class="' + cls + '" href="' + esc(l) + '">' + esc(txt) + "</a>";
  if (l.charAt(0) === "#")
    return (
      '<a class="' +
      cls +
      '" href="' +
      esc(l) +
      '" data-s="' +
      esc(l.slice(1)) +
      '">' +
      esc(txt) +
      "</a>"
    );
  var r = l.replace(/^\/+|\/+$/g, "");
  return (
    '<a class="' +
    cls +
    '" href="' +
    U(r) +
    '" data-r="' +
    esc(r) +
    '">' +
    esc(txt) +
    "</a>"
  );
}
function L(r, txt, cls) {
  return (
    '<a href="' +
    U(r) +
    '" data-r="' +
    esc(r) +
    '" class="' +
    (cls || "") +
    '">' +
    txt +
    "</a>"
  );
}
function ph(t) {
  return (
    '<div class="ph">' +
    (t.p
      ? '<img alt="' + esc(t.n) + '" src="' + esc(im(t.p)) + '">'
      : esc((t.n || "?").charAt(0))) +
    "</div>"
  );
}
function seatTxt(v) {
  v = String(v == null ? "" : v).trim();
  if (!v) return "";
  var n = parseInt(v, 10);
  return isNaN(n) ? v : n <= 0 ? "Batch full" : "Only " + n + " seats left";
}
function courseCard(c) {
  var bd =
    (c.seats
      ? '<span class="bd hot">' + esc(seatTxt(c.seats)) + "</span>"
      : "") +
    (c.enrolled
      ? '<span class="bd">' + esc(c.enrolled) + " students enrolled</span>"
      : "") +
    (c.start
      ? '<span class="bd">Batch starts ' + esc(c.start) + "</span>"
      : "");
  return cardIn(
    c.img,
    (bd ? '<div class="bds">' + bd + "</div>" : "") +
      "<h3>" +
      esc(c.n) +
      "</h3><p>" +
      esc(c.d) +
      '</p><div class="row" style="margin-top:14px;align-items:center">' +
      lk(c.link, c.linkText || "Enroll now", "btn sm") +
      '<a class="go" style="margin:0" href="#enquire" data-s="enquire">Enquire</a></div>',
    c.link
  );
}
function postCard(p) {
  return (
    '<a class="card bc" style="text-decoration:none;display:block;color:inherit" href="' +
    U("blog/" + p.slug) +
    '" data-r="blog/' +
    esc(p.slug) +
    '">' +
    (p.cover
      ? '<img class="cover" alt="" src="' + esc(im(p.cover)) + '">'
      : "") +
    '<div class="meta">' +
    esc(p.cat) +
    " | " +
    esc(p.date) +
    (p.au ? " | By " + esc(p.au) : "") +
    "</div><h3>" +
    esc(p.t) +
    "</h3><p>" +
    esc(excerpt(p)) +
    "</p></a>"
  );
}
function head(s, top) {
  var tg = top ? "h1" : "h2";
  return (
    (s.t ? '<div class="eyebrow">' + esc(s.t) + "</div>" : "") +
    (s.h ? "<" + tg + ">" + (top ? hw(s.h) : hl(s.h)) + "</" + tg + ">" : "") +
    (s.d ? '<p class="sub">' + esc(s.d) + "</p>" : "")
  );
}
function secStyle(s) {
  var o = "";
  if (s.bgimg)
    o +=
      "background:linear-gradient(rgba(5,8,20,.64),rgba(5,8,20,.64)),url('" +
      im(s.bgimg).replace(/'/g, "") +
      "') center/cover;";
  else if (okc(s.bg)) o += "background:" + s.bg + ";";
  if (okc(s.hc)) o += "--hc:" + s.hc + ";";
  if (s.hf && FONTS.indexOf(s.hf) > -1) o += "--hfont:'" + s.hf + "';";
  return o ? ' style="' + o + '"' : "";
}
function secHtml(s, i, top) {
  var cl =
      (i % 2 ? "alt" : "") +
      (top ? " first" : "") +
      (s.al === "c" ? " ctr" : "") +
      (s.hf ? " shf" : "") +
      (s.bgimg ? " dk" : ""),
    sty = secStyle(s),
    w = function (x) {
      return (
        '<section class="' +
        cl +
        '"' +
        sty +
        '><div class="wrap">' +
        x +
        "</div></section>"
      );
    },
    hd = head(s, top),
    btn = s.link
      ? '<p style="margin-top:22px">' +
        lk(s.link, s.linkText || "Learn more", "btn ghost") +
        "</p>"
      : "",
    it = s.items || [];
  switch (s.type) {
    case "hero":
      var tg = String(s.tags || "")
        .split(",")
        .map(function (x) {
          return x.trim();
        })
        .filter(Boolean);
      return (
        '<div class="hero' +
        (s.al === "c" ? " ctr" : "") +
        (s.hf ? " shf" : "") +
        '"' +
        sty +
        '><div class="wrap' +
        (it.length ? "" : " one") +
        '"><div>' +
        (s.t ? '<div class="eyebrow">' + esc(s.t) + "</div>" : "") +
        "<h1>" +
        hw(s.h) +
        "</h1><p>" +
        esc(s.d) +
        '</p><div class="row">' +
        lk(s.link, s.linkText || "Learn more", "btn") +
        lk(s.link2, s.linkText2 || "More", "btn ghost") +
        "</div>" +
        (tg.length
          ? '<div class="trust">' +
            tg
              .map(function (x) {
                return "<span>" + esc(x) + "</span>";
              })
              .join("") +
            "</div>"
          : "") +
        "</div>" +
        (it.length
          ? '<div class="plan"><ul>' +
            it
              .map(function (x) {
                return (
                  "<li><span>" +
                  esc(x.h) +
                  "</span><b>" +
                  esc(x.d) +
                  "</b></li>"
                );
              })
              .join("") +
            "</ul></div>"
          : "") +
        "</div></div>"
      );
    case "text":
      return w(
        hd +
          (s.b ? '<div class="prose">' + bodyHtml(s.b) + "</div>" : "") +
          (s.link
            ? '<p style="margin-top:20px">' +
              lk(s.link, s.linkText || "Learn more", "btn") +
              "</p>"
            : "")
      );
    case "cards":
      return w(
        hd +
          '<div class="grid">' +
          it
            .map(function (x) {
              return cardIn(
                x.img,
                "<h3>" +
                  esc(x.h) +
                  "</h3><p>" +
                  esc(x.d) +
                  "</p>" +
                  lk(x.link, x.linkText || "Open", "go"),
                x.link
              );
            })
            .join("") +
          "</div>" +
          btn
      );
    case "courses":
      var lim = +s.limit || 0,
        cs = S.courses.filter(function (c) {
          return lim || filt === "all" || c.c === filt;
        });
      if (lim) cs = cs.slice(0, lim);
      var chips = lim
        ? ""
        : '<div class="chips">' +
          [
            ["all", "All"],
            ["ug", "Undergraduate"],
            ["pg", "Postgraduate"],
            ["sc", "School"],
            ["bk", "Books"],
          ]
            .map(function (x) {
              return (
                '<button class="chip" data-f="' +
                x[0] +
                '" aria-pressed="' +
                (filt === x[0]) +
                '">' +
                x[1] +
                "</button>"
              );
            })
            .join("") +
          "</div>";
      return w(
        hd +
          chips +
          '<div class="grid">' +
          cs.map(courseCard).join("") +
          "</div>" +
          btn
      );
    case "toppers":
      if (s.mode === "grid")
        return w(
          hd +
            '<div class="grid">' +
            S.toppers
              .map(function (t) {
                return (
                  '<div class="tc tm" style="width:auto">' +
                  ph(t) +
                  '<div class="t"><b>' +
                  esc(t.n) +
                  "</b><span>" +
                  esc(t.r) +
                  "</span>" +
                  tcInfo(t) +
                  "</div></div>"
                );
              })
              .join("") +
            "</div>" +
            btn
        );
      var tc = S.toppers
          .map(function (t) {
            return (
              '<div class="tc">' +
              ph(t) +
              '<div class="t"><b>' +
              esc(t.n) +
              "</b><span>" +
              esc(t.r) +
              "</span>" +
              tcInfo(t) +
              "</div></div>"
            );
          })
          .join(""),
        half = "";
      if (S.toppers.length) {
        while (half.split('class="tc"').length < 8) half += tc;
      }
      return (
        '<section class="' +
        cl +
        '"' +
        sty +
        '><div class="wrap">' +
        hd +
        '</div><div class="top"><div class="track">' +
        half +
        half +
        "</div></div></section>"
      );
    case "team":
      return w(
        hd +
          '<div class="grid">' +
          S.team
            .map(function (t) {
              return (
                '<div class="tc tm" style="width:auto">' +
                ph(t) +
                '<div class="t"><b>' +
                esc(t.n) +
                "</b><span>" +
                esc(t.role) +
                '</span><p style="font-size:14.5px;color:var(--mute);margin:6px 0 0">' +
                esc(t.bio) +
                "</p></div></div>"
              );
            })
            .join("") +
          "</div>" +
          btn
      );
    case "posts":
      var lm = +s.limit || 0,
        ps = lm ? S.posts.slice(0, lm) : S.posts;
      return w(
        hd +
          (lm ? "" : writeCta()) +
          '<div class="grid">' +
          (ps.map(postCard).join("") || "<p>No posts yet.</p>") +
          "</div>" +
          btn
      );
    case "faq":
      return w(
        hd +
          S.faq
            .map(function (q) {
              return (
                "<details><summary>" +
                esc(q.q) +
                "</summary><p>" +
                esc(q.a) +
                "</p></details>"
              );
            })
            .join("") +
          btn
      );
    case "split":
      return w(
        '<div class="split' +
          (s.side === "left" ? " rev" : "") +
          '"><div>' +
          hd +
          (s.b ? '<div class="prose">' + bodyHtml(s.b) + "</div>" : "") +
          (s.link
            ? '<p style="margin-top:18px">' +
              lk(s.link, s.linkText || "Learn more", "btn") +
              "</p>"
            : "") +
          "</div>" +
          (s.img
            ? '<img class="cover" alt="" src="' + esc(im(s.img)) + '">'
            : "") +
          "</div>"
      );
    case "stats":
      return w(
        hd +
          '<div class="grid stats">' +
          it
            .map(function (x) {
              return (
                '<div class="card"><div class="big">' +
                esc(x.h) +
                "</div><p>" +
                esc(x.d) +
                "</p></div>"
              );
            })
            .join("") +
          "</div>"
      );
    case "results":
      return w(
        hd +
          '<div class="rs-bar"><input type="search" id="rsq" placeholder="Search by name, roll number, course or university..."></div><div class="rs-wrap"><table class="rs"><thead><tr><th>Student</th><th>Roll No.</th><th>Course</th><th>University</th><th>Result</th></tr></thead><tbody>' +
          S.toppers
            .map(function (t) {
              return (
                '<tr data-q="' +
                esc(
                  [t.n, t.roll, t.course, t.uni, t.r].join(" ").toLowerCase()
                ) +
                '"><td><div class="st">' +
                (t.p
                  ? '<img alt="" loading="lazy" src="' + esc(im(t.p)) + '">'
                  : '<span class="av">' +
                    esc((t.n || "?").charAt(0)) +
                    "</span>") +
                "<b>" +
                esc(t.n) +
                "</b></div></td><td>" +
                esc(t.roll) +
                "</td><td>" +
                esc(t.course) +
                "</td><td>" +
                esc(t.uni) +
                '</td><td><span class="bd">' +
                esc(t.r) +
                "</span></td></tr>"
              );
            })
            .join("") +
          "</tbody></table></div>" +
          btn
      );
    case "html":
      return w(hd + '<div class="custom">' + (s.b || "") + "</div>");
    case "image":
      return w(
        hd +
          (s.img
            ? '<img class="cover" alt="' +
              esc(s.h) +
              '" src="' +
              esc(im(s.img)) +
              '">'
            : "") +
          btn
      );
    case "video":
      var yv = ytId(s.url),
        apq =
          s.ap === "y"
            ? "?autoplay=1&mute=1&loop=1&playlist=" +
              yv +
              "&playsinline=1&rel=0"
            : "?rel=0";
      return w(
        hd +
          (yv
            ? '<div class="vid"><iframe allow="autoplay; encrypted-media; picture-in-picture; fullscreen" src="https://www.youtube-nocookie.com/embed/' +
              yv +
              apq +
              '" title="' +
              esc(s.h || "Video") +
              '" loading="lazy" allowfullscreen></iframe></div>'
            : "") +
          btn
      );
    case "links":
      return w(
        hd +
          '<div class="row">' +
          it
            .map(function (x) {
              return lk(x.link, x.h || "Open", "btn ghost");
            })
            .join("") +
          "</div>"
      );
    case "pyq":
      var pth = (pq[i] || []).slice(),
        cur = s.tree || [],
        cr = [{ n: s.h || "PYQs", p: [] }];
      for (var z = 0; z < pth.length; z++) {
        var nd = cur[pth[z]];
        if (!nd) {
          pth = pth.slice(0, z);
          break;
        }
        cr.push({ n: nd.n, p: pth.slice(0, z + 1) });
        cur = nd.children || [];
      }
      return w(
        hd +
          (pth.length
            ? '<div class="crumbs">' +
              cr
                .map(function (c, k) {
                  return (
                    (k ? "<span>/</span>" : "") +
                    '<button data-pq="' +
                    i +
                    ":" +
                    c.p.join(".") +
                    '">' +
                    esc(c.n) +
                    "</button>"
                  );
                })
                .join("") +
              "</div>"
            : "") +
          '<div class="grid">' +
          (cur
            .map(function (n, ix) {
              var np = pth.concat(ix).join("."),
                kids = (n.children || []).length;
              return kids
                ? '<button class="card fld" data-pq="' +
                    i +
                    ":" +
                    np +
                    '"><h3>' +
                    esc(n.n) +
                    "</h3><span>" +
                    kids +
                    " items</span></button>"
                : n.link
                ? '<button class="card fld" data-pv="' +
                  i +
                  ":" +
                  np +
                  '"><h3>' +
                  esc(n.n) +
                  "</h3><span>Open PDF</span></button>"
                : '<div class="card"><h3>' +
                  esc(n.n) +
                  "</h3><p>Coming soon</p></div>";
            })
            .join("") || "<p>Nothing here yet.</p>") +
          "</div>"
      );
    case "cta":
      return w(
        '<div class="cta">' +
          hd +
          (s.link
            ? "<p>" + lk(s.link, s.linkText || "Get started", "btn") + "</p>"
            : "") +
          "</div>"
      );
  }
  return "";
}
function pageHtml(r) {
  var f = find(r);
  if (f.k === "page")
    return f.g.sections
      .map(function (s, i) {
        return secHtml(s, i, i === 0 && r !== "" && s.type !== "hero");
      })
      .join("");
  if (f.k === "post") {
    var p = f.p,
      wc = String(p.body || "")
        .replace(/<[^>]+>/g, " ")
        .split(/\s+/)
        .filter(Boolean).length,
      rtm = Math.max(1, Math.round(wc / 200)),
      an = p.au || "Jamia Entrance Adda";
    return (
      '<article class="wrap pg art"><p class="noprint row">' +
      L("blog", "Back to blog", "btn ghost sm") +
      '<button class="btn sm" id="pdfb" type="button">Download PDF</button></p><div class="acat">' +
      esc(p.cat) +
      "</div><h1>" +
      esc(p.t) +
      '</h1><div class="by">' +
      (p.aup
        ? '<img class="ava" alt="" src="' + esc(im(p.aup)) + '">'
        : '<span class="ava">' + esc(an.charAt(0)) + "</span>") +
      "<div><b>" +
      esc(an) +
      "</b>" +
      (p.ab ? "<small>" + esc(p.ab) + "</small>" : "") +
      "<small>Published " +
      esc(p.date) +
      (p.time ? ", " + esc(p.time) : "") +
      " &middot; " +
      rtm +
      " min read</small></div></div>" +
      (p.cover
        ? '<img class="cover" style="margin:22px 0" alt="" src="' +
          esc(im(p.cover)) +
          '">'
        : "") +
      '<div class="prose">' +
      bodyHtml(p.body) +
      '</div><p class="printonly">Source: ' +
      esc(S.domain) +
      "/blog/" +
      esc(p.slug) +
      '/ &mdash; Jamia Entrance Adda</p><div class="noprint" style="margin-top:34px">' +
      writeCta() +
      "</div></article>"
    );
  }
  if (f.k === "write")
    return '<div class="wrap pg"><h1>Write for us</h1><p class="sub">Create an account with your phone number and a password, write your article and submit it. Our team verifies every writer and reads every article before it is published.</p><div id="wp" class="wp"></div></div>';
  return (
    '<div class="wrap pg"><h1>Page not found</h1><p class="sub">This page does not exist.</p><p>' +
    L("", "Go to home", "btn") +
    "</p></div>"
  );
}
function soc() {
  return (S.social || [])
    .filter(function (x) {
      return x.u;
    })
    .map(function (x) {
      var o = iconOf(x.n, x.u);
      return (
        '<a class="si" href="' +
        esc(x.u) +
        '" target="_blank" rel="noopener" aria-label="' +
        esc(x.n) +
        '" style="--c:' +
        o[1] +
        '">' +
        ICON[o[0]] +
        "<span>" +
        esc(x.n) +
        "</span></a>"
      );
    })
    .join("");
}
function shell(r) {
  var wa = "https://wa.me/" + esc(S.wa);
  return (
    '<div class="bar">' +
    esc(S.banner) +
    "</div>" +
    headerHtml(r) +
    "<main>" +
    (r === "" ? bannerHtml() : "") +
    pageHtml(r) +
    '<section id="contact" class="alt"><div class="wrap two"><div id="enquire">' +
    head({ t: S.contactT, h: S.contactH, d: S.contactD }) +
    '<form id="f"><input id="n" placeholder="Your name" required><input id="p" placeholder="Phone number" inputmode="tel" required><select id="c">' +
    S.courses
      .map(function (c) {
        return "<option>" + esc(c.n) + "</option>";
      })
      .join("") +
    '</select><button class="btn" type="submit">Send on WhatsApp</button></form></div><div class="info"><h2>Contact us</h2><p class="sub">We reply fast.</p><p>' +
    esc(S.address) +
    '</p><p><a href="' +
    tel(S.phone1) +
    '">' +
    esc(S.phone1) +
    '</a><br><a href="' +
    tel(S.phone2) +
    '">' +
    esc(S.phone2) +
    '</a></p><p><a href="mailto:' +
    esc(S.email) +
    '">' +
    esc(S.email) +
    '</a></p><div class="sics" style="margin-top:14px">' +
    socIcons() +
    "</div></div></div></section></main>" +
    footerHtml() +
    '<a class="btn wa" href="' +
    wa +
    '?text=Hi%2C%20I%20want%20course%20details" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
    ICON.wa +
    '<span class="sr">WhatsApp us</span></a>' +
    (S.playUrl
      ? '<a class="btn pl" href="' +
        esc(S.playUrl) +
        '" target="_blank" rel="noopener" aria-label="Get it on Google Play">' +
        ICON.play +
        "<span><small>GET IT ON</small>Google Play</span></a>"
      : "") +
    '<div class="modal" id="yv"><div class="mbox yt"><button class="x" id="yvx" aria-label="Close">&times;</button><div id="yvb"></div></div></div>' +
    cpHtml() +
    ppHtml() +
    '<div class="modal" id="pv"><div class="mbox big"><div class="row" style="justify-content:space-between;align-items:center"><b id="pvt"></b><button class="btn ghost sm" id="pvx">Close</button></div><iframe id="pvf" title="PDF" allowfullscreen></iframe><div class="row"><a class="btn sm" id="pvo" target="_blank" rel="noopener">Open in new tab</a><a class="btn ghost sm" id="pvd" target="_blank" rel="noopener">Download</a></div></div></div><div class="modal" id="lg"><div class="mbox"><div class="row" style="justify-content:space-between;align-items:center"><h2 style="font-size:24px;margin:0">Student login</h2><button class="btn ghost sm" id="lgx">Close</button></div><p class="sub" style="margin:10px 0">Already enrolled? Log in to your classes and tests.</p><a class="btn" style="display:block;text-align:center" href="' +
    esc(S.loginUrl) +
    '" target="_blank" rel="noopener">Login to my classes</a><hr style="border:0;border-top:1px solid var(--line);margin:18px 0"><b>New here? Register</b><form id="lf" style="margin-top:10px"><input id="ln" placeholder="Your name" required><input id="lp" placeholder="Mobile number" inputmode="tel" required><select id="lc">' +
    S.courses
      .map(function (c) {
        return "<option>" + esc(c.n) + "</option>";
      })
      .join("") +
    '</select><button class="btn" type="submit">Register on WhatsApp</button></form></div></div>'
  );
}
function go(r) {
  rt = r;
  pq = {};
  try {
    history.pushState(null, "", U(r) + "");
  } catch (e) {}
  site();
  scrollTo(0, 0);
}
function site(keep) {
  var y = scrollY;
  $("root").innerHTML =
    shell(rt) +
    (owner
      ? '<button class="btn adm" id="admbtn">Edit site</button><div id="sheet"></div>'
      : wantAdmin
      ? '<button class="btn adm" id="admlogin">Admin login</button>'
      : "");
  var m = metaFor(rt);
  document.title = m.t;
  document.querySelectorAll("[data-r]").forEach(function (a) {
    a.onclick = function (e) {
      e.preventDefault();
      go(a.dataset.r);
    };
  });
  document.querySelectorAll("[data-s]").forEach(function (a) {
    a.onclick = function (e) {
      e.preventDefault();
      var t = $(a.dataset.s);
      if (t) t.scrollIntoView({ behavior: "smooth" });
    };
  });
  document.querySelectorAll(".chip").forEach(function (b) {
    b.onclick = function () {
      filt = b.dataset.f;
      site(true);
    };
  });
  document.querySelectorAll("[data-login]").forEach(function (b) {
    b.onclick = function (e) {
      if (e) e.preventDefault();
      $("lg").className = "modal on";
      var m = $("mm");
      if (m) m.className = "mm";
      var q = $("mmm");
      if (q) q.className = "mmenu";
    };
  });
  document.querySelectorAll("[data-pq]").forEach(function (b) {
    b.onclick = function () {
      var a = b.dataset.pq.split(":");
      pq[+a[0]] = a[1] === "" ? [] : a[1].split(".").map(Number);
      site(true);
    };
  });
  document.querySelectorAll("[data-pv]").forEach(function (b) {
    b.onclick = function () {
      var a = b.dataset.pv.split(":"),
        l = find(rt).g.sections[+a[0]].tree,
        nd;
      a[1].split(".").forEach(function (ix) {
        nd = l[+ix];
        l = nd.children || [];
      });
      openPv(nd);
    };
  });
  $("pvx").onclick = function () {
    $("pv").className = "modal";
    $("pvf").src = "about:blank";
  };
  wirePop();
  if ($("pdfb"))
    $("pdfb").onclick = function () {
      window.print();
    };
  if ($("rsq"))
    $("rsq").oninput = function () {
      var q = this.value.toLowerCase();
      document.querySelectorAll(".rs tbody tr").forEach(function (tr) {
        tr.style.display = tr.dataset.q.indexOf(q) > -1 ? "" : "none";
      });
    };
  document.querySelectorAll("[data-yt]").forEach(function (a) {
    a.onclick = function (e) {
      e.preventDefault();
      openYt(a.dataset.yt);
    };
  });
  if ($("yvx")) {
    $("yvx").onclick = function () {
      $("yvb").innerHTML = "";
      $("yv").className = "modal";
    };
    $("yv").onclick = function (e) {
      if (e.target === $("yv")) {
        $("yvb").innerHTML = "";
        $("yv").className = "modal";
      }
    };
  }
  $("lgx").onclick = function () {
    $("lg").className = "modal";
  };
  $("lf").onsubmit = function (e) {
    e.preventDefault();
    sendLead({
      form: "Register",
      name: $("ln").value,
      phone: $("lp").value,
      course: $("lc").value,
    });
    afterLead(
      "Registration request. Name: " +
        $("ln").value +
        ". Mobile: " +
        $("lp").value +
        ". Course: " +
        $("lc").value
    );
  };
  $("f").onsubmit = function (e) {
    e.preventDefault();
    sendLead({
      form: "Enquiry form",
      name: $("n").value,
      phone: $("p").value,
      course: $("c").value,
    });
    afterLead(
      "Hi, I am " +
        $("n").value +
        ". Phone: " +
        $("p").value +
        ". I am interested in " +
        $("c").value +
        ". Please call me."
    );
  };
  if (owner)
    $("admbtn").onclick = function () {
      $("sheet").className = "on";
      panel();
    };
  if (!owner && wantAdmin && $("admlogin"))
    $("admlogin").onclick = function () {
      gate();
    };
  applyTheme();
  initBanner();
  initAnim();
  initPopups();
  if (find(rt).k === "write") initPortal();
  if (keep) scrollTo(0, y);
}
/* ---------- admin ---------- */
function F(k, l, v, a) {
  return (
    "<label>" +
    l +
    (a
      ? '<textarea rows="' +
        a +
        '" data-k="' +
        k +
        '">' +
        esc(v) +
        "</textarea>"
      : '<input data-k="' + k + '" value="' + esc(v) + '">') +
    "</label>"
  );
}
var LISTS = {
  posts: {
    add: "blog post",
    nw: function () {
      return {
        au: "",
        ab: "",
        aup: "",
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        slug: "",
        t: "",
        cat: "Updates",
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        cover: "",
        body: "",
        st: "",
        sd: "",
      };
    },
    f: [
      ["t", "Title"],
      ["au", "Author name (shown on the post)"],
      ["ab", "Author line, e.g. B.A. student, JMI"],
      ["slug", "Post address (slug), auto from title if empty"],
      ["cat", "Category"],
      ["date", "Date"],
      ["body", "Write your post", 10, "rich"],
      ["st", "SEO title"],
      ["sd", "SEO description", 2],
    ],
    ph: [800, 450],
    pk: "cover",
  },
  redirects: {
    add: "redirect",
    nw: { from: "", to: "" },
    f: [
      ["from", "Old address, e.g. old-page"],
      ["to", "Send visitors to (page name or full link)"],
    ],
  },
  toppers: {
    add: "achiever",
    nw: { n: "", r: "", roll: "", course: "", uni: "", p: "" },
    f: [
      ["n", "Student name"],
      ["r", "Rank / result, e.g. Rank 01"],
      ["roll", "Roll number"],
      ["course", "Course, e.g. B.A. Hons Geography"],
      ["uni", "University, e.g. JMI"],
    ],
    ph: [420, 540],
  },
  team: {
    add: "teacher",
    nw: { n: "", role: "", bio: "", p: "" },
    f: [
      ["n", "Name"],
      ["role", "Role / subject"],
      ["bio", "Short bio", 2],
    ],
    ph: [420, 420],
  },
  courses: {
    ph: [800, 450],
    pk: "img",
    add: "course",
    nw: {
      n: "New course",
      d: "",
      c: "ug",
      img: "",
      enrolled: "",
      seats: "",
      start: "",
      link: "",
      linkText: "Enroll now",
    },
    f: [
      ["n", "Course name"],
      ["d", "Description", 2],
      ["c", "Type"],
      ["enrolled", "Students enrolled, e.g. 1250+ (empty = hide)"],
      ["seats", "Seats left, number (empty = hide)"],
      ["start", "Batch start date, e.g. 15 Nov (empty = hide)"],
      ["link", "Enroll link (paste Classplus course link here)"],
      ["linkText", "Button text (default: Enroll now)"],
    ],
    sel: {
      c: [
        ["ug", "Undergraduate"],
        ["pg", "Postgraduate"],
        ["sc", "School"],
        ["bk", "Books"],
      ],
    },
  },
  banners: {
    add: "banner",
    nw: { img: "", link: "" },
    f: [["link", "Link when clicked (page name, #enquire or full link)"]],
    ph: [1600, 700],
    pk: "img",
  },
  faq: {
    add: "question",
    nw: { q: "", a: "" },
    f: [
      ["q", "Question"],
      ["a", "Answer", 2],
    ],
  },
  social: {
    add: "social account",
    nw: { n: "", u: "" },
    f: [
      ["n", "Name, e.g. Facebook"],
      ["u", "Profile link (https://...)"],
    ],
  },
};
function listUI(k) {
  var Q = LISTS[k],
    pk = Q.pk || "p";
  return (
    '<button class="btn" data-add="' +
    k +
    '">+ Add ' +
    Q.add +
    "</button>" +
    S[k]
      .map(function (it, i) {
        return (
          '<div class="item">' +
          (Q.ph
            ? '<div class="row">' +
              (it[pk]
                ? '<img class="thumb" src="' + esc(im(it[pk])) + '">'
                : '<div class="thumb"></div>') +
              '<label class="btn ghost sm" style="cursor:pointer;align-self:center">Choose photo<input type="file" accept="image/*" hidden data-ph="' +
              k +
              '" data-i="' +
              i +
              '"></label>' +
              (k === "posts"
                ? '<label class="btn ghost sm" style="cursor:pointer;align-self:center">Author photo<input type="file" accept="image/*" hidden data-ph2="' +
                  i +
                  '"></label>'
                : "") +
              "</div>"
            : "") +
          Q.f
            .map(function (f) {
              if (f[3] === "rich")
                return (
                  '<b style="font-size:14px">' +
                  f[1] +
                  " (select words to make bold, heading or link)</b>" +
                  rteBox(k + "." + i + "." + f[0], it[f[0]])
                );
              var a =
                'data-a="' + k + '" data-i="' + i + '" data-f="' + f[0] + '"';
              if (Q.sel && Q.sel[f[0]])
                return (
                  "<select " +
                  a +
                  ">" +
                  Q.sel[f[0]]
                    .map(function (o) {
                      return (
                        '<option value="' +
                        o[0] +
                        '"' +
                        (it[f[0]] === o[0] ? " selected" : "") +
                        ">" +
                        o[1] +
                        "</option>"
                      );
                    })
                    .join("") +
                  "</select>"
                );
              return f[2]
                ? "<label>" +
                    f[1] +
                    '<textarea rows="' +
                    f[2] +
                    '" ' +
                    a +
                    ">" +
                    esc(it[f[0]]) +
                    "</textarea></label>"
                : '<input placeholder="' +
                    f[1] +
                    '" ' +
                    a +
                    ' value="' +
                    esc(it[f[0]]) +
                    '">';
            })
            .join("") +
          '<button class="btn red sm" data-del="' +
          k +
          '" data-i="' +
          i +
          '">Delete</button></div>'
        );
      })
      .join("")
  );
}
var TYPES = [
  ["hero", "Hero (big top banner)"],
  ["text", "Text"],
  ["cards", "Cards"],
  ["courses", "Courses list"],
  ["toppers", "Achievers"],
  ["team", "Team"],
  ["posts", "Blog posts"],
  ["faq", "FAQ"],
  ["pyq", "PYQ folders + PDFs"],
  ["results", "Results table (name, roll no, course, university)"],
  ["text", "Text (rich)"],
  ["split", "Text + Image side by side"],
  ["stats", "Big numbers"],
  ["image", "Image"],
  ["video", "YouTube video"],
  ["links", "Button links"],
  ["html", "Custom HTML (advanced)"],
  ["cta", "Call-to-action banner"],
];
function sI(a, i, k, v, ph, rows) {
  var at = 'data-sec="' + i + '" data-f="' + k + '"';
  return rows
    ? "<label>" +
        ph +
        '<textarea rows="' +
        rows +
        '" ' +
        at +
        ">" +
        esc(v) +
        "</textarea></label>"
    : '<input placeholder="' + ph + '" ' + at + ' value="' + esc(v) + '">';
}
function rteBar() {
  var o =
    '<option value="">Link to a page...</option>' +
    S.pages
      .filter(function (p) {
        return p.slug !== "";
      })
      .map(function (p) {
        return '<option value="' + esc(p.slug) + '">' + esc(p.t) + "</option>";
      })
      .join("") +
    S.posts
      .map(function (p) {
        return (
          '<option value="blog/' +
          esc(p.slug || slug(p.t)) +
          '">Blog: ' +
          esc(p.t) +
          "</option>"
        );
      })
      .join("");
  return (
    '<div class="rbar"><button type="button" data-cmd="bold"><b>B</b></button><button type="button" data-cmd="italic"><i>I</i></button><button type="button" data-cmd="underline"><u>U</u></button><button type="button" data-blk="h2">Heading</button><button type="button" data-blk="h3">Sub-heading</button><button type="button" data-blk="p">Normal</button><button type="button" data-cmd="insertUnorderedList">&bull; List</button><button type="button" data-cmd="insertOrderedList">1. List</button><button type="button" data-blk="blockquote">Quote</button><button type="button" data-link="1">Link</button><button type="button" data-cmd="unlink">Unlink</button><select data-font><option value="">Font</option>' +
    FONTS.map(function (f) {
      return '<option value="' + f + '">' + f + "</option>";
    }).join("") +
    '</select><select data-size><option value="">Size</option><option value="2">Small</option><option value="3">Normal</option><option value="5">Large</option><option value="6">Big</option><option value="7">Huge</option></select><input type="color" data-color value="#d4af37" title="Text colour" aria-label="Text colour"><button type="button" data-cmd="removeFormat">Clear</button><select class="plk">' +
    o +
    "</select></div>"
  );
}
function rteBox(key, html) {
  return (
    rteBar() +
    '<div class="rte" contenteditable="true" data-rk="' +
    key +
    '">' +
    richHtml(html) +
    "</div>"
  );
}
function treeUI(nodes, i, path) {
  return nodes
    .map(function (nd, k) {
      var p = path.concat(k).join("."),
        id = i + ":" + p,
        kids = nd.children || [],
        isData = /^data:/.test(nd.link || "");
      return (
        '<div class="tn"><input placeholder="Name (e.g. UG, B.A. Hons, 2025)" data-tf="' +
        id +
        '" data-f="n" value="' +
        esc(nd.n) +
        '">' +
        (kids.length
          ? ""
          : '<input placeholder="PDF link (Google Drive share link) - for the last level only" data-tf="' +
            id +
            '" data-f="link" value="' +
            (isData ? "" : esc(nd.link)) +
            '">' +
            (isData
              ? '<small style="color:var(--brand)">PDF chosen, publish par upload hogi</small>'
              : "")) +
        '<div class="row"><label class="btn ghost sm" style="cursor:pointer">Upload PDF<input type="file" accept="application/pdf" hidden data-tup="' +
        id +
        '"></label><button class="btn ghost sm" data-tm="' +
        id +
        '" data-d="-1">&uarr;</button><button class="btn ghost sm" data-tm="' +
        id +
        '" data-d="1">&darr;</button><button class="btn sm" data-ta="' +
        id +
        '">+ Inside</button><button class="btn sm" data-tam="' +
        id +
        '">+ Many</button><button class="btn red sm" data-tdl="' +
        id +
        '">Delete</button></div>' +
        (kids.length
          ? '<div class="tkids">' + treeUI(kids, i, path.concat(k)) + "</div>"
          : "") +
        "</div>"
      );
    })
    .join("");
}
function secUI(s, i) {
  var t = s.type,
    h =
      '<div class="item"><div class="row" style="justify-content:space-between;align-items:center"><b>' +
      (i + 1) +
      ". " +
      esc(
        (TYPES.filter(function (x) {
          return x[0] === t;
        })[0] || [0, t])[1]
      ) +
      '</b><span><button class="btn ghost sm" data-mv="' +
      i +
      '" data-d="-1">&uarr;</button> <button class="btn ghost sm" data-mv="' +
      i +
      '" data-d="1">&darr;</button> <button class="btn red sm" data-ds="' +
      i +
      '">Delete</button></span></div>';
  h +=
    sI(0, i, "t", s.t, "Small title (above heading)") +
    sI(0, i, "h", s.h, "Heading (use *word* to highlight in colour)") +
    sI(0, i, "d", s.d, "Description", 3);
  if (t === "text" || t === "split")
    h +=
      '<b style="font-size:14px">Text (select words to make bold, heading or link)</b>' +
      rteBox("sec." + i + ".b", s.b);
  if (t === "html")
    h += sI(0, i, "b", s.b, "Custom HTML code (embed, iframe, form...)", 8);
  if (t === "video")
    h +=
      sI(0, i, "url", s.url, "YouTube video link") +
      '<select data-sec="' +
      i +
      '" data-f="ap"><option value="">Play when visitor taps</option><option value="y"' +
      (s.ap === "y" ? " selected" : "") +
      ">Autoplay (muted, loops)</option></select>";
  if (t === "split")
    h +=
      '<select data-sec="' +
      i +
      '" data-f="side"><option value="right"' +
      (s.side !== "left" ? " selected" : "") +
      '>Image on right</option><option value="left"' +
      (s.side === "left" ? " selected" : "") +
      ">Image on left</option></select>";
  if (t === "image" || t === "split")
    h +=
      (s.img ? '<img class="cover" src="' + esc(im(s.img)) + '">' : "") +
      '<label class="btn ghost sm" style="cursor:pointer">Choose image<input type="file" accept="image/*" hidden data-sph="' +
      i +
      '"></label>';
  if (t === "courses" || t === "posts")
    h += sI(
      0,
      i,
      "limit",
      s.limit || "",
      "How many to show (empty or 0 = all)"
    );
  if (t === "toppers")
    h +=
      '<select data-sec="' +
      i +
      '" data-f="mode"><option value="marquee"' +
      (s.mode !== "grid" ? " selected" : "") +
      '>Sliding strip</option><option value="grid"' +
      (s.mode === "grid" ? " selected" : "") +
      ">Grid</option></select>";
  if (t === "hero")
    h += sI(0, i, "tags", s.tags, "Tags, comma separated (JMI, AMU, CUET)");
  if (t !== "links" && t !== "pyq" && t !== "html" && t !== "stats")
    h +=
      sI(
        0,
        i,
        "link",
        s.link,
        "Redirect link (page name like courses, #enquire, or full link)"
      ) + sI(0, i, "linkText", s.linkText, "Button text");
  if (t === "hero")
    h +=
      sI(0, i, "link2", s.link2, "Second button link") +
      sI(0, i, "linkText2", s.linkText2, "Second button text");
  if (t === "pyq")
    h +=
      '<b style="font-size:14px">Folders and PDFs (UG &rarr; Course &rarr; Year &rarr; PDF)</b><button class="btn sm" data-ta="' +
      i +
      ':">+ Add folder</button><button class="btn sm" data-tam="' +
      i +
      ':">+ Add many</button>' +
      treeUI(s.tree || [], i, []);
  if (t === "cards" || t === "hero" || t === "links" || t === "stats") {
    h +=
      '<b style="font-size:14px">' +
      (t === "hero"
        ? "Side card lines (left text, right text)"
        : t === "links"
        ? "Buttons"
        : t === "stats"
        ? "Numbers (big text + label)"
        : "Cards") +
      '</b><button class="btn sm" data-ai="' +
      i +
      '">+ Add</button>';
    (s.items || []).forEach(function (x, j) {
      var at = 'data-sec="' + i + '" data-it="' + j + '"';
      h +=
        '<div class="item">' +
        (t === "cards"
          ? (x.img ? '<img class="cover" src="' + esc(im(x.img)) + '">' : "") +
            '<label class="btn ghost sm" style="cursor:pointer">Card photo<input type="file" accept="image/*" hidden data-iph="' +
            i +
            ":" +
            j +
            '"></label>' +
            (x.img
              ? '<button class="btn ghost sm" data-iphd="' +
                i +
                ":" +
                j +
                '">Remove photo</button>'
              : "")
          : "") +
        '<input placeholder="' +
        (t === "links"
          ? "Button text"
          : t === "stats"
          ? "Number, e.g. 500+"
          : "Heading") +
        '" ' +
        at +
        ' data-f="h" value="' +
        esc(x.h) +
        '">' +
        (t === "links"
          ? ""
          : '<textarea rows="2" placeholder="Description" ' +
            at +
            ' data-f="d">' +
            esc(x.d) +
            "</textarea>") +
        (t === "cards" || t === "links"
          ? '<input placeholder="Redirect link" ' +
            at +
            ' data-f="link" value="' +
            esc(x.link) +
            '">'
          : "") +
        (t === "cards"
          ? '<input placeholder="Button text" ' +
            at +
            ' data-f="linkText" value="' +
            esc(x.linkText) +
            '">'
          : "") +
        '<button class="btn red sm" data-di="' +
        i +
        '" data-j="' +
        j +
        '">Remove</button></div>';
    });
  }
  h +=
    '<b style="font-size:14px">Style</b><label>Background colour<input type="color" data-sec="' +
    i +
    '" data-f="bg" value="' +
    (okc(s.bg) ? s.bg : "#ffffff") +
    '"></label><label>Heading colour<input type="color" data-sec="' +
    i +
    '" data-f="hc" value="' +
    (okc(s.hc) ? s.hc : "#ffffff") +
    '"></label><label>Heading font<select data-sec="' +
    i +
    '" data-f="hf">' +
    fontOpts(s.hf) +
    '</select></label><select data-sec="' +
    i +
    '" data-f="al"><option value="">Align left</option><option value="c"' +
    (s.al === "c" ? " selected" : "") +
    '>Align centre</option></select><label class="btn ghost sm" style="cursor:pointer">Background image<input type="file" accept="image/*" hidden data-sbg="' +
    i +
    '"></label>' +
    (s.bgimg
      ? '<button class="btn ghost sm" data-sbgd="' +
        i +
        '">Remove background image</button>'
      : "") +
    '<button class="btn ghost sm" data-clr="' +
    i +
    '">Reset style</button>';
  return h + "</div>";
}
function panel(reset) {
  var pb0 = document.querySelector("#sheet .body"),
    sy = pb0 && !reset ? pb0.scrollTop : 0,
    b = "",
    g = S.pages[pi] || S.pages[0];
  if (tab === "basic")
    b =
      [
        ["banner", "Top banner"],
        ["phone1", "Phone 1"],
        ["phone2", "Phone 2"],
        ["wa", "WhatsApp number (91XXXXXXXXXX)"],
        ["email", "Email"],
        ["address", "Address"],
        ["loginUrl", "Student login link"],
        ["contactT", "Contact section: small title"],
        ["contactH", "Contact section: heading"],
        ["footer", "Footer text"],
        [
          "sheetUrl",
          "Google Sheet link for enquiries (Apps Script web app URL)",
        ],
        ["navM", "Menu items shown on phone before More (e.g. 4)"],
        ["navD", "Menu items shown on desktop before More (e.g. 6)"],
        ["playUrl", "Play Store app link (empty = hide button)"],
        ["playText", "App button text (e.g. Download our app)"],
      ]
        .map(function (x) {
          return F(x[0], x[1], S[x[0]]);
        })
        .join("") +
      F("contactD", "Contact section: description", S.contactD, 2) +
      '<div class="item"><b>OTP login (Firebase) and publish server</b><label>Firebase config (paste what Firebase shows)<textarea rows="6" id="fbcfg">' +
      esc(S.fb ? JSON.stringify(S.fb, null, 1) : "") +
      "</textarea></label>" +
      F(
        "workerUrl",
        "Publish server link (Cloudflare Worker URL)",
        S.workerUrl
      ) +
      '<small style="color:var(--mute)">Jab ye bhar doge, admin login OTP se hoga aur writers ka login chalu hoga. Emergency mein purana passcode: ?admin=passcode</small></div>' +
      '<label>After a form is submitted<select data-k="waAfter"><option value="y"' +
      (S.waAfter !== "n" ? " selected" : "") +
      '>Save to sheet and open WhatsApp</option><option value="n"' +
      (S.waAfter === "n" ? " selected" : "") +
      ">Only save to sheet (show thank-you)</option></select></label>" +
      '<div class="item"><b>Admin passcode</b><button class="btn ghost sm" id="cpw">Change passcode</button></div>' +
      '<div class="item"><b>Logo</b>' +
      (S.logo
        ? '<img style="height:60px;width:auto;object-fit:contain;align-self:start" src="' +
          esc(im(S.logo)) +
          '">'
        : '<p style="margin:0;color:var(--mute);font-size:14px">No logo yet.</p>') +
      '<label class="btn ghost sm" style="cursor:pointer">Choose logo<input type="file" accept="image/*" hidden id="lgo"></label>' +
      (S.logo
        ? '<button class="btn red sm" id="lgd">Remove logo</button>'
        : "") +
      "</div>";
  else if (tab === "pages") {
    b =
      '<select id="ps">' +
      S.pages
        .map(function (p, i) {
          return (
            '<option value="' +
            i +
            '"' +
            (i === pi ? " selected" : "") +
            ">" +
            esc(p.t) +
            "</option>"
          );
        })
        .join("") +
      '</select><div class="row"><button class="btn sm" id="np">+ New page</button>' +
      (S.pages.some(function (p) {
        return p.slug === "pyqs";
      })
        ? ""
        : '<button class="btn sm" id="npq">+ PYQs page (ready)</button>') +
      (g.slug !== ""
        ? '<button class="btn red sm" id="dp">Delete this page</button>'
        : "") +
      "</div>" +
      '<div class="item"><b>Page settings</b><input placeholder="Menu name" data-pg="t" value="' +
      esc(g.t) +
      '">' +
      (g.slug !== ""
        ? '<input placeholder="Page address (slug)" data-pg="slug" value="' +
          esc(g.slug) +
          '">'
        : "") +
      '<select data-pg="nav"><option value="y"' +
      (g.nav !== "n" ? " selected" : "") +
      '>Show in menu</option><option value="n"' +
      (g.nav === "n" ? " selected" : "") +
      '>Hide from menu</option></select><input placeholder="SEO title" data-pg="st" value="' +
      esc(g.st) +
      '"><textarea rows="2" placeholder="SEO description" data-pg="sd">' +
      esc(g.sd) +
      "</textarea></div>" +
      g.sections
        .map(function (s, i) {
          return secUI(s, i);
        })
        .join("") +
      '<div class="item"><select id="ty">' +
      TYPES.map(function (x) {
        return '<option value="' + x[0] + '">' + x[1] + "</option>";
      }).join("") +
      '</select><button class="btn" id="as">+ Add section</button></div>';
  } else if (tab === "design") {
    var th = (S.theme = S.theme || {}),
      pc = PRE[th.preset || "royal"];
    b =
      '<div class="item"><b>Colour theme</b><div class="row">' +
      [
        ["royal", "Royal Navy &amp; Gold"],
        ["ivory", "Ivory &amp; Maroon"],
        ["ocean", "Ocean Blue"],
        ["charcoal", "Charcoal &amp; Orange"],
      ]
        .map(function (x) {
          return (
            '<button class="btn sm' +
            ((th.preset || "royal") === x[0] ? "" : " ghost") +
            '" data-preset="' +
            x[0] +
            '">' +
            x[1] +
            "</button>"
          );
        })
        .join("") +
      '</div></div><div class="item"><b>Custom colours (optional)</b>' +
      [
        ["brand", "Main colour (buttons, links)"],
        ["bg", "Background"],
        ["text", "Text"],
      ]
        .map(function (x) {
          return (
            "<label>" +
            x[1] +
            '<input type="color" data-th="' +
            x[0] +
            '" value="' +
            (okc(th[x[0]]) ? th[x[0]] : pc[x[0]]) +
            '"></label>'
          );
        })
        .join("") +
      '<button class="btn ghost sm" id="thr">Reset custom colours</button></div><div class="item"><b>Fonts</b><label>Heading font<select data-th="hf">' +
      fontOpts(th.hf) +
      '</select></label><label>Body font<select data-th="bf">' +
      fontOpts(th.bf) +
      "</select></label></div>";
  } else if (tab === "popups") {
    var pu = popupCfg(),
      pr = promoCfg(),
      O = function (o, f, l, v, r) {
        return r === "sel"
          ? ""
          : "<label>" +
              l +
              '<input data-ob="' +
              o +
              '" data-f="' +
              f +
              '" value="' +
              esc(v) +
              '"></label>';
      },
      SEL = function (o, f, v, opts) {
        return (
          '<select data-ob="' +
          o +
          '" data-f="' +
          f +
          '">' +
          opts
            .map(function (x) {
              return (
                '<option value="' +
                x[0] +
                '"' +
                (v === x[0] ? " selected" : "") +
                ">" +
                x[1] +
                "</option>"
              );
            })
            .join("") +
          "</select>"
        );
      },
      FR = [
        ["session", "Once per visit"],
        ["daily", "Once a day"],
        ["always", "Every time"],
      ];
    b =
      '<div class="item"><b>Counselling popup (opens when a visitor enters)</b>' +
      SEL("popup", "on", pu.on, [
        ["y", "Show"],
        ["n", "Hide"],
      ]) +
      O("popup", "title", "Heading", pu.title) +
      '<label>Description<textarea rows="3" data-ob="popup" data-f="text">' +
      esc(pu.text) +
      "</textarea></label>" +
      O("popup", "button", "Button text", pu.button) +
      '<label>Exam options in the dropdown (one per line)<textarea rows="5" data-ob="popup" data-f="opts">' +
      esc(pu.opts) +
      "</textarea></label>" +
      O("popup", "delay", "Show after (seconds)", pu.delay) +
      SEL("popup", "freq", pu.freq, FR) +
      '</div><div class="item"><b>Bottom slide-up poster</b>' +
      SEL("promo", "on", pr.on, [
        ["n", "Hide"],
        ["y", "Show"],
      ]) +
      (pr.img ? '<img class="cover" src="' + esc(im(pr.img)) + '">' : "") +
      '<label class="btn ghost sm" style="cursor:pointer">Choose poster image<input type="file" accept="image/*" hidden id="pst"></label>' +
      (pr.img
        ? '<button class="btn red sm" id="pstd">Remove poster</button>'
        : "") +
      O("promo", "title", "Heading (optional)", pr.title) +
      '<label>Text (optional)<textarea rows="2" data-ob="promo" data-f="text">' +
      esc(pr.text) +
      "</textarea></label>" +
      O(
        "promo",
        "link",
        "Poster / button link (page name, #enquire or full link, e.g. Play Store)",
        pr.link
      ) +
      O("promo", "button", "Button text", pr.button) +
      O("promo", "delay", "Show after (seconds)", pr.delay) +
      SEL("promo", "freq", pr.freq, FR) +
      '<small style="color:var(--mute)">Visitors can close it with the cross button. The app button shows if you set a Play Store link in Basic.</small></div>';
  } else if (tab === "footer") {
    if (!S.footerCols) S.footerCols = footerDefaults();
    S.legal = S.legal || [];
    b =
      F(
        "footerAbout",
        "Short line about your institute (footer)",
        S.footerAbout || FA0,
        2
      ) +
      '<div class="item"><b>Legal links (bottom row)</b>' +
      (S.pages.some(function (p) {
        return p.slug === "privacy-policy";
      })
        ? ""
        : '<button class="btn" id="polp">+ Add Privacy, Refund &amp; Terms pages</button>') +
      S.legal
        .map(function (x, j) {
          return (
            '<div class="item"><input placeholder="Link text" data-lg="' +
            j +
            '" data-f="t" value="' +
            esc(x.t) +
            '"><input placeholder="Link (page name or full link)" data-lg="' +
            j +
            '" data-f="l" value="' +
            esc(x.l) +
            '"><button class="btn red sm" data-lgd="' +
            j +
            '">Remove</button></div>'
          );
        })
        .join("") +
      '<button class="btn sm" id="lga">+ Add legal link</button></div>' +
      '<button class="btn" data-fa="1">+ Add column</button>' +
      S.footerCols
        .map(function (c, i) {
          return (
            '<div class="item"><input placeholder="Column title" data-fc="' +
            i +
            '" data-f="h" value="' +
            esc(c.h) +
            '"><div class="row"><button class="btn ghost sm" data-fcm="' +
            i +
            '" data-d="-1">&uarr;</button><button class="btn ghost sm" data-fcm="' +
            i +
            '" data-d="1">&darr;</button><button class="btn red sm" data-fcd="' +
            i +
            '">Delete column</button></div>' +
            (c.links || [])
              .map(function (x, j) {
                var id = i + ":" + j;
                return (
                  '<div class="item"><input placeholder="Link text" data-fl="' +
                  id +
                  '" data-f="t" value="' +
                  esc(x.t) +
                  '"><input placeholder="Link (page name, #enquire or full link)" data-fl="' +
                  id +
                  '" data-f="l" value="' +
                  esc(x.l) +
                  '"><button class="btn red sm" data-fld="' +
                  id +
                  '">Remove link</button></div>'
                );
              })
              .join("") +
            '<button class="btn sm" data-fla="' +
            i +
            '">+ Add link</button></div>'
          );
        })
        .join("") +
      '<p style="color:var(--mute);font-size:14px">Contact column (address, phone, email) is filled from the Basic tab.</p>';
  } else if (tab === "subs")
    b =
      '<button class="btn ghost sm" data-act="subs">Refresh</button><div id="sbox"><p>Loading...</p></div>';
  else if (tab === "writers") b = '<div id="wbox"><p>Loading...</p></div>';
  else if (tab === "admins") b = '<div id="abox"><p>Loading...</p></div>';
  else if (tab === "seo") {
    b =
      F("domain", "Website address (no slash at end)", S.domain) +
      F("siteTitle", "Default title", S.siteTitle) +
      F("siteDesc", "Default description", S.siteDesc, 3) +
      '<div class="item"><b>Share image (WhatsApp / Facebook preview)</b>' +
      (S.ogImage
        ? '<img class="cover" src="' + esc(im(S.ogImage)) + '">'
        : "") +
      '<label class="btn ghost sm" style="cursor:pointer">Choose image<input type="file" accept="image/*" hidden id="og"></label></div><p style="color:var(--mute);font-size:14px">Title up to 60 letters, description up to 155. Each page has its own SEO fields in Pages tab.</p>';
  } else if (tab === "github")
    b =
      '<div class="item"><b>GitHub connection</b><input id="rp" placeholder="Repository, e.g. jamiaentranceadda/jamiaentranceadda" value="' +
      esc(localStorage.jea_repo || "") +
      '"><input id="tk" type="password" placeholder="GitHub token" value="' +
      esc(localStorage.jea_tok || "") +
      '"><button class="btn sm" id="sv">Save connection</button><p style="color:var(--mute);font-size:14px;margin:0">Token sirf is phone ke browser mein save hota hai. Kisi ko mat dena.</p></div>';
  else b = listUI(tab);
  var T = [
    ["pages", "Pages"],
    ["banners", "Banners"],
    ["popups", "Popups"],
    ["design", "Design"],
    ["posts", "Blog"],
    ["toppers", "Achievers"],
    ["team", "Team"],
    ["courses", "Courses"],
    ["faq", "FAQ"],
    ["social", "Social"],
    ["footer", "Footer"],
    ["seo", "SEO"],
    ["redirects", "Redirects"],
    ["basic", "Basic"],
    ["github", "GitHub"],
  ];
  if (fbOn() && adm)
    T.splice(
      1,
      0,
      ["subs", "Articles"],
      ["writers", "Writers"],
      ["admins", "Admins"]
    );
  $("sheet").innerHTML =
    '<div class="pan"><div class="ph1"><b>Edit site</b><button class="btn ghost sm" id="cl">Close</button></div><div class="tabs">' +
    T.map(function (t) {
      return (
        '<button class="btn sm' +
        (tab === t[0] ? "" : " ghost") +
        '" data-t="' +
        t[0] +
        '">' +
        t[1] +
        "</button>"
      );
    }).join("") +
    '</div><div class="body">' +
    b +
    '</div><div class="foot"><button class="btn" id="pub">Save and publish</button></div></div>';
  var P = $("sheet"),
    on = function (sel, fn) {
      P.querySelectorAll(sel).forEach(fn);
    };
  $("cl").onclick = function () {
    P.className = "";
    site(true);
  };
  var nb = P.querySelector(".body");
  if (nb) nb.scrollTop = sy;
  on("[data-t]", function (x) {
    x.onclick = function () {
      tab = x.dataset.t;
      panel(true);
    };
  });
  on("[data-k]", function (x) {
    x.oninput = function () {
      S[x.dataset.k] = x.value;
    };
  });
  on("[data-a]", function (x) {
    x.oninput = function () {
      S[x.dataset.a][x.dataset.i][x.dataset.f] = x.value;
    };
  });
  on("[data-pg]", function (x) {
    x.oninput = x.onchange = function () {
      g[x.dataset.pg] = x.value;
    };
  });
  on("[data-sec]", function (x) {
    x.oninput = x.onchange = function () {
      var s = g.sections[x.dataset.sec];
      if (x.dataset.it != null) s.items[x.dataset.it][x.dataset.f] = x.value;
      else s[x.dataset.f] = x.value;
    };
  });
  on("[data-del]", function (x) {
    x.onclick = function () {
      if (confirm("Delete this item?")) {
        S[x.dataset.del].splice(+x.dataset.i, 1);
        panel();
      }
    };
  });
  on("[data-add]", function (x) {
    x.onclick = function () {
      var n = LISTS[x.dataset.add].nw;
      S[x.dataset.add].unshift(
        typeof n === "function" ? n() : JSON.parse(JSON.stringify(n))
      );
      panel();
    };
  });
  on("[data-ph]", function (x) {
    x.onchange = function () {
      var f = x.files[0],
        Q = LISTS[x.dataset.ph];
      if (!f) return;
      shrink(f, Q.ph[0], Q.ph[1], function (u) {
        S[x.dataset.ph][+x.dataset.i][Q.pk || "p"] = u;
        panel();
      });
    };
  });
  on("[data-mv]", function (x) {
    x.onclick = function () {
      var i = +x.dataset.mv,
        j = i + +x.dataset.d,
        a = g.sections;
      if (j < 0 || j >= a.length) return;
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
      panel();
    };
  });
  on("[data-preset]", function (x) {
    x.onclick = function () {
      S.theme.preset = x.dataset.preset;
      S.theme.brand = S.theme.bg = S.theme.text = "";
      applyTheme();
      panel();
    };
  });
  on("[data-th]", function (x) {
    x.oninput = x.onchange = function () {
      S.theme[x.dataset.th] = x.value;
      applyTheme();
    };
  });
  if ($("thr"))
    $("thr").onclick = function () {
      S.theme.brand = S.theme.bg = S.theme.text = "";
      applyTheme();
      panel();
    };
  on("[data-ob]", function (x) {
    x.oninput = x.onchange = function () {
      var o = x.dataset.ob;
      S[o] = S[o] || {};
      S[o][x.dataset.f] = x.value;
    };
  });
  if ($("pst"))
    $("pst").onchange = function () {
      var f = this.files[0];
      if (f)
        shrinkFit(f, 1000, function (u) {
          S.promo = S.promo || {};
          S.promo.img = u;
          panel();
        });
    };
  if ($("pstd"))
    $("pstd").onclick = function () {
      S.promo.img = "";
      panel();
    };
  on("[data-iph]", function (x) {
    x.onchange = function () {
      var a = x.dataset.iph.split(":"),
        f = x.files[0];
      if (f)
        shrink(f, 800, 450, function (u) {
          g.sections[+a[0]].items[+a[1]].img = u;
          panel();
        });
    };
  });
  on("[data-iphd]", function (x) {
    x.onclick = function () {
      var a = x.dataset.iphd.split(":");
      g.sections[+a[0]].items[+a[1]].img = "";
      panel();
    };
  });
  on("[data-sbg]", function (x) {
    x.onchange = function () {
      var f = x.files[0];
      if (f)
        shrink(f, 1600, 900, function (u) {
          g.sections[+x.dataset.sbg].bgimg = u;
          panel();
        });
    };
  });
  on("[data-sbgd]", function (x) {
    x.onclick = function () {
      g.sections[+x.dataset.sbgd].bgimg = "";
      panel();
    };
  });
  on("[data-lg]", function (x) {
    x.oninput = function () {
      S.legal[+x.dataset.lg][x.dataset.f] = x.value;
    };
  });
  on("[data-lgd]", function (x) {
    x.onclick = function () {
      S.legal.splice(+x.dataset.lgd, 1);
      panel();
    };
  });
  if ($("lga"))
    $("lga").onclick = function () {
      S.legal.push({ t: "New link", l: "" });
      panel();
    };
  if ($("polp"))
    $("polp").onclick = function () {
      [
        ["privacy-policy", "Privacy Policy"],
        ["refund-policy", "Refund Policy"],
        ["terms-and-conditions", "Terms & Conditions"],
      ].forEach(function (x) {
        if (
          !S.pages.some(function (p) {
            return p.slug === x[0];
          })
        )
          S.pages.push({
            slug: x[0],
            t: x[1],
            nav: "n",
            st: x[1],
            sd: "",
            sections: [
              {
                type: "text",
                t: "Policy",
                h: x[1],
                d: "",
                b: "<p>This page will be updated soon.</p>",
                link: "",
                linkText: "",
                items: [],
              },
            ],
          });
        if (
          !S.legal.some(function (l) {
            return l.l === x[0];
          })
        )
          S.legal.push({ t: x[1], l: x[0] });
      });
      panel();
    };
  on("[data-fc]", function (x) {
    x.oninput = function () {
      S.footerCols[+x.dataset.fc][x.dataset.f] = x.value;
    };
  });
  on("[data-fl]", function (x) {
    x.oninput = function () {
      var a = x.dataset.fl.split(":");
      S.footerCols[+a[0]].links[+a[1]][x.dataset.f] = x.value;
    };
  });
  on("[data-fa]", function (x) {
    x.onclick = function () {
      S.footerCols.push({ h: "New column", links: [{ t: "Link", l: "" }] });
      panel();
    };
  });
  on("[data-fcd]", function (x) {
    x.onclick = function () {
      if (confirm("Delete this column?")) {
        S.footerCols.splice(+x.dataset.fcd, 1);
        panel();
      }
    };
  });
  on("[data-fcm]", function (x) {
    x.onclick = function () {
      var i = +x.dataset.fcm,
        j = i + +x.dataset.d,
        a = S.footerCols;
      if (j < 0 || j >= a.length) return;
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
      panel();
    };
  });
  on("[data-fla]", function (x) {
    x.onclick = function () {
      var c = S.footerCols[+x.dataset.fla];
      (c.links = c.links || []).push({ t: "Link", l: "" });
      panel();
    };
  });
  on("[data-fld]", function (x) {
    x.onclick = function () {
      var a = x.dataset.fld.split(":");
      S.footerCols[+a[0]].links.splice(+a[1], 1);
      panel();
    };
  });
  on("[data-ph2]", function (x) {
    x.onchange = function () {
      var f = x.files[0];
      if (f)
        shrink(f, 200, 200, function (u) {
          S.posts[+x.dataset.ph2].aup = u;
          panel();
        });
    };
  });
  on("[data-clr]", function (x) {
    x.onclick = function () {
      var s = g.sections[+x.dataset.clr];
      s.bg = s.hc = s.hf = s.al = "";
      panel();
    };
  });
  on("[data-ds]", function (x) {
    x.onclick = function () {
      if (confirm("Delete this section?")) {
        g.sections.splice(+x.dataset.ds, 1);
        panel();
      }
    };
  });
  on("[data-ai]", function (x) {
    x.onclick = function () {
      var s = g.sections[+x.dataset.ai];
      (s.items = s.items || []).push({ h: "", d: "", link: "", linkText: "" });
      panel();
    };
  });
  on("[data-di]", function (x) {
    x.onclick = function () {
      g.sections[+x.dataset.di].items.splice(+x.dataset.j, 1);
      panel();
    };
  });
  if ($("ps"))
    $("ps").onchange = function () {
      pi = +this.value;
      panel();
    };
  if ($("np"))
    $("np").onclick = function () {
      S.pages.push({
        slug: "new-page",
        t: "New page",
        nav: "y",
        st: "",
        sd: "",
        sections: [
          {
            type: "text",
            t: "",
            h: "New page",
            d: "",
            b: "",
            link: "",
            linkText: "",
          },
        ],
      });
      pi = S.pages.length - 1;
      panel();
    };
  if ($("npq"))
    $("npq").onclick = function () {
      var d = {
          type: "text",
          t: "Practice",
          h: "Previous year question papers",
          d: "Choose your level, course and year to open the paper.",
          b: "<p>Solve previous year papers to understand the exam pattern.</p>",
          link: "",
          linkText: "",
          items: [],
        },
        y = function (n) {
          return { n: n, link: "", children: [] };
        };
      S.pages.push({
        slug: "pyqs",
        t: "PYQs",
        nav: "y",
        st: "JMI, AMU, CUET Previous Year Question Papers (PYQ) PDF",
        sd: "Previous year question papers for JMI, AMU and CUET, course-wise and year-wise.",
        sections: [
          d,
          {
            type: "pyq",
            t: "PYQs",
            h: "PYQ library",
            d: "UG, then course, then year.",
            b: "",
            link: "",
            linkText: "",
            items: [],
            tree: [
              {
                n: "UG",
                link: "",
                children: [
                  {
                    n: "B.A. Hons Political Science",
                    link: "",
                    children: [y("2025"), y("2024"), y("2023")],
                  },
                ],
              },
              { n: "PG", link: "", children: [] },
            ],
          },
        ],
      });
      pi = S.pages.length - 1;
      panel(true);
    };
  if ($("dp"))
    $("dp").onclick = function () {
      if (confirm("Delete this page?")) {
        S.pages.splice(pi, 1);
        pi = 0;
        panel();
      }
    };
  if ($("as"))
    $("as").onclick = function () {
      g.sections.push({
        type: $("ty").value,
        t: "",
        h: "New heading",
        d: "",
        b: "",
        link: "",
        linkText: "",
        items: [],
      });
      panel();
    };
  if ($("cpw"))
    $("cpw").onclick = function () {
      P.className = "";
      site(true);
      gate(true);
    };
  if ($("lgo"))
    $("lgo").onchange = function () {
      var f = this.files[0];
      if (f)
        shrinkLogo(f, function (u) {
          S.logo = u;
          panel();
        });
    };
  if ($("lgd"))
    $("lgd").onclick = function () {
      S.logo = "";
      panel();
    };
  if ($("og"))
    $("og").onchange = function () {
      var f = this.files[0];
      if (f)
        shrink(f, 1200, 630, function (u) {
          S.ogImage = u;
          panel();
        });
    };
  if ($("sv"))
    $("sv").onclick = function () {
      localStorage.jea_repo = $("rp").value.trim();
      localStorage.jea_tok = $("tk").value.trim();
      toast("Saved");
    };

  function setRk(key, html) {
    var p = key.split(".");
    if (p[0] === "sec") S.pages[pi].sections[+p[1]][p[2]] = html;
    else S[p[0]][+p[1]][p[2]] = html;
  }
  function tList(i, p) {
    var l = (S.pages[pi].sections[i].tree = S.pages[pi].sections[i].tree || []);
    if (p !== "")
      p.split(".").forEach(function (ix) {
        var n = l[+ix];
        l = n.children = n.children || [];
      });
    return l;
  }
  function tNode(i, p) {
    var a = p.split("."),
      k = +a.pop();
    return { l: tList(i, a.join(".")), k: k, n: tList(i, a.join("."))[k] };
  }
  P.querySelectorAll(".rte").forEach(function (ed) {
    ed.oninput = function () {
      setRk(ed.dataset.rk, ed.innerHTML);
    };
    ["keyup", "mouseup", "touchend", "blur"].forEach(function (ev) {
      ed.addEventListener(ev, function () {
        var s = getSelection();
        if (s.rangeCount && ed.contains(s.anchorNode))
          saved = s.getRangeAt(0).cloneRange();
      });
    });
  });
  P.querySelectorAll(".rbar").forEach(function (bar) {
    var ed = bar.nextElementSibling;
    function run(fn) {
      var ok = saved && ed.contains(saved.commonAncestorContainer);
      ed.focus();
      if (ok) {
        var s = getSelection();
        s.removeAllRanges();
        s.addRange(saved);
      }
      try {
        document.execCommand("styleWithCSS", false, false);
      } catch (e) {}
      fn();
      setRk(ed.dataset.rk, ed.innerHTML);
    }
    bar.querySelectorAll("button").forEach(function (b) {
      b.onpointerdown = b.onmousedown = function (e) {
        e.preventDefault();
      };
      b.onclick = function () {
        if (b.dataset.cmd)
          run(function () {
            document.execCommand(b.dataset.cmd);
          });
        else if (b.dataset.blk)
          run(function () {
            document.execCommand("formatBlock", false, b.dataset.blk);
          });
        else if (b.dataset.link) {
          var u = prompt(
            "Link likho: poora link (https://...) ya site ka page jaise courses, pyqs, blog/post-address"
          );
          if (u) {
            u = u.trim();
            if (!/^(https?:|mailto:|tel:)/i.test(u))
              u = "https://internal.link/" + u.replace(/^\/+/, "");
            run(function () {
              document.execCommand("createLink", false, u);
            });
          }
        }
      };
    });
    var fs = bar.querySelector("[data-font]");
    fs.onchange = function () {
      if (fs.value) {
        var v = fs.value;
        run(function () {
          document.execCommand("fontName", false, v);
        });
        fs.value = "";
      }
    };
    var zs = bar.querySelector("[data-size]");
    zs.onchange = function () {
      if (zs.value) {
        var v = zs.value;
        run(function () {
          document.execCommand("fontSize", false, v);
        });
        zs.value = "";
      }
    };
    var ci = bar.querySelector("[data-color]");
    ci.oninput = function () {
      var v = ci.value;
      run(function () {
        document.execCommand("foreColor", false, v);
      });
    };
    var sl = bar.querySelector(".plk");
    sl.onchange = function () {
      if (sl.value) {
        var v = sl.value;
        run(function () {
          document.execCommand(
            "createLink",
            false,
            "https://internal.link/" + v
          );
        });
        sl.value = "";
      }
    };
  });
  on("[data-tf]", function (x) {
    x.oninput = function () {
      var a = x.dataset.tf.split(":");
      tNode(+a[0], a[1]).n[x.dataset.f] = x.value;
    };
  });
  on("[data-ta]", function (x) {
    x.onclick = function () {
      var a = x.dataset.ta.split(":"),
        l =
          a[1] === ""
            ? tList(+a[0], "")
            : (tNode(+a[0], a[1]).n.children =
                tNode(+a[0], a[1]).n.children || []);
      l.push({ n: "New", link: "", children: [] });
      panel();
    };
  });
  on("[data-tam]", function (x) {
    x.onclick = function () {
      var a = x.dataset.tam.split(":"),
        v = prompt("Names likho, comma se alag (jaise 2025, 2024, 2023)");
      if (!v) return;
      var l =
        a[1] === ""
          ? tList(+a[0], "")
          : (tNode(+a[0], a[1]).n.children =
              tNode(+a[0], a[1]).n.children || []);
      v.split(",").forEach(function (n) {
        n = n.trim();
        if (n) l.push({ n: n, link: "", children: [] });
      });
      panel();
    };
  });
  on("[data-tdl]", function (x) {
    x.onclick = function () {
      if (confirm("Delete this and everything inside it?")) {
        var a = x.dataset.tdl.split(":"),
          r = tNode(+a[0], a[1]);
        r.l.splice(r.k, 1);
        panel();
      }
    };
  });
  on("[data-tm]", function (x) {
    x.onclick = function () {
      var a = x.dataset.tm.split(":"),
        r = tNode(+a[0], a[1]),
        j = r.k + +x.dataset.d;
      if (j < 0 || j >= r.l.length) return;
      var t = r.l[r.k];
      r.l[r.k] = r.l[j];
      r.l[j] = t;
      panel();
    };
  });
  on("[data-tup]", function (x) {
    x.onchange = function () {
      var f = x.files[0];
      if (!f) return;
      if (f.size > 25 * 1024 * 1024) {
        toast("PDF 25 MB se choti rakho");
        return;
      }
      var r = new FileReader();
      r.onload = function () {
        var a = x.dataset.tup.split(":");
        tNode(+a[0], a[1]).n.link = r.result;
        panel();
      };
      r.readAsDataURL(f);
    };
  });
  on("[data-sph]", function (x) {
    x.onchange = function () {
      var f = x.files[0];
      if (f)
        shrink(f, 1200, 675, function (u) {
          g.sections[+x.dataset.sph].img = u;
          panel();
        });
    };
  });
  if ($("fbcfg"))
    $("fbcfg").oninput = function () {
      var o = parseFb(this.value);
      if (o.apiKey && o.projectId) {
        S.fb = o;
        fbP = null;
      } else if (!this.value.trim()) {
        S.fb = null;
      }
    };
  on("[data-act]", function (x) {
    x.onclick = function () {
      if (tab === "subs") loadSubs();
    };
  });
  if (tab === "subs") loadSubs();
  if (tab === "writers") loadWriters();
  if (tab === "admins") loadAdmins();
  $("pub").onclick = publish;
}
function shrinkLogo(file, cb) {
  var img = new Image(),
    r = new FileReader();
  r.onload = function () {
    img.onload = function () {
      var H = Math.min(120, img.height),
        W = Math.round((img.width * H) / img.height),
        c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      c.getContext("2d").drawImage(img, 0, 0, W, H);
      cb(c.toDataURL("image/png"));
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}
function shrinkFit(file, maxW, cb) {
  var img = new Image(),
    r = new FileReader();
  r.onload = function () {
    img.onload = function () {
      var W = Math.min(maxW, img.width),
        H = Math.round((img.height * W) / img.width),
        c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      c.getContext("2d").drawImage(img, 0, 0, W, H);
      cb(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}
function shrink(file, W, H, cb) {
  var img = new Image(),
    r = new FileReader();
  r.onload = function () {
    img.onload = function () {
      var c = document.createElement("canvas");
      c.width = W;
      c.height = H;
      var s = Math.max(W / img.width, H / img.height),
        w = img.width * s,
        h = img.height * s;
      c.getContext("2d").drawImage(img, (W - w) / 2, (H - h) / 3, w, h);
      cb(c.toDataURL("image/jpeg", 0.82));
    };
    img.src = r.result;
  };
  r.readAsDataURL(file);
}
function docHtml(r) {
  var adm = r === "admin",
    rr = adm ? "" : r || "",
    m = metaFor(rr),
    can = S.domain.replace(/\/+$/, "") + "/" + (rr ? rr + "/" : ""),
    h =
      '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>' +
      esc(m.t) +
      '</title>\n<meta name="description" content="' +
      esc(m.d) +
      '">\n';
  h +=
    adm || r === null || r === "write"
      ? '<meta name="robots" content="noindex">\n'
      : '<link rel="canonical" href="' +
        esc(can) +
        '">\n<meta property="og:type" content="' +
        m.type +
        '">\n<meta property="og:title" content="' +
        esc(m.t) +
        '">\n<meta property="og:description" content="' +
        esc(m.d) +
        '">\n<meta property="og:url" content="' +
        esc(can) +
        '">\n' +
        (m.og
          ? '<meta property="og:image" content="' + esc(abs(m.og)) + '">\n'
          : "") +
        '<meta name="twitter:card" content="summary_large_image">\n' +
        (m.ld
          ? '<script type="application/ld+json">' +
            JSON.stringify(m.ld).replace(/</g, "\\u003c") +
            "</script>\n"
          : "");
  return (
    h +
    (S.logo ? '<link rel="icon" href="' + esc(im(S.logo)) + '">\n' : "") +
    '<link id="gf" rel="stylesheet" href="' +
    fontsHref() +
    '">\n<link rel="stylesheet" href="' +
    BASE +
    'style.css">\n<style id="theme">' +
    themeCss() +
    '</style>\n</head>\n<body>\n<div id="root">' +
    shell(r === null ? "404x" : rr) +
    '</div>\n<div id="toast" role="status"></div>\n<script type="application/json" id="state">' +
    JSON.stringify(S).replace(/</g, "\\u003c") +
    "</script>\n" +
    (r === null
      ? ""
      : "<script>window.ROUTE=" + JSON.stringify(r) + "</script>\n") +
    '<script src="' +
    BASE +
    'app.js"></script>\n</body>\n</html>'
  );
}
function walk(o, bl) {
  for (var k in o) {
    var v = o[k];
    if (typeof v === "string" && v.indexOf("data:image/") === 0) {
      var p =
        "img/" +
        Date.now().toString(36) +
        bl.length +
        (v.indexOf("image/png") > 0 ? ".png" : ".jpg");
      bl.push({ path: p, b64: v.split(",")[1] });
      o[k] = p;
    } else if (
      typeof v === "string" &&
      v.indexOf("data:application/pdf") === 0
    ) {
      var p2 = "pdf/" + Date.now().toString(36) + bl.length + ".pdf";
      bl.push({ path: p2, b64: v.split(",")[1] });
      o[k] = p2;
    } else if (v && typeof v === "object") walk(v, bl);
  }
}
async function src(id, url) {
  var e = $(id);
  if (e) return e.textContent;
  return (await fetch(BASE + url + "?" + Date.now())).text();
}
async function publish() {
  var btn = $("pub");
  btn.disabled = true;
  btn.textContent = "Publishing...";
  try {
    var REPO = localStorage.jea_repo,
      TOK = localStorage.jea_tok;
    var viaW = !!(adm && S.workerUrl && fbOn());
    if (!viaW && (!REPO || !TOK)) {
      tab = "github";
      panel();
      toast("Pehle GitHub tab mein repo aur token daalo");
      return;
    }
    var H = {
      Authorization: "Bearer " + TOK,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };
    async function gh(p, method, body) {
      var r = await fetch("https://api.github.com/repos/" + REPO + p, {
        method: method || "GET",
        headers: H,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!r.ok)
        throw new Error(r.status + " " + (await r.text()).slice(0, 140));
      return r.json();
    }
    var ps = {};
    S.pages.forEach(function (p, i) {
      if (i === 0 || p.slug === "") {
        p.slug = "";
        return;
      }
      var b = slug(p.slug || p.t) || "page",
        s = b,
        k = 2;
      while (ps[s] || (s === "blog" && false) || s === "admin")
        s = b + "-" + k++;
      ps[s] = 1;
      p.slug = s;
    });
    var seen = {};
    S.posts.forEach(function (p) {
      var b = slug(p.slug || p.t) || "post",
        s = b,
        i = 2;
      while (seen[s]) s = b + "-" + i++;
      seen[s] = 1;
      p.slug = s;
    });
    var bl = [],
      C = JSON.parse(JSON.stringify(S));
    walk(C, bl);
    var old = S;
    S = C;
    var js = await src("app-script", "app.js"),
      css = await src("app-style", "style.css");
    pq = {};
    var routes = S.pages
        .map(function (p) {
          return p.slug;
        })
        .concat(
          S.posts.map(function (p) {
            return "blog/" + p.slug;
          })
        ),
      files = [];
    routes.forEach(function (r) {
      files.push({
        path: r ? r + "/index.html" : "index.html",
        text: docHtml(r),
      });
    });
    files.push(
      { path: "admin/index.html", text: docHtml("admin") },
      { path: "write/index.html", text: docHtml("write") },
      { path: "404.html", text: docHtml(null) },
      { path: "app.js", text: js },
      { path: "style.css", text: css }
    );
    S.redirects.forEach(function (x) {
      var f = String(x.from || "")
        .toLowerCase()
        .replace(/^https?:\/\/[^\/]+/, "")
        .split("/")
        .map(slug)
        .filter(Boolean)
        .join("/");
      if (!f || routes.indexOf(f) > -1 || f === "admin" || !x.to) return;
      var to = String(x.to).trim(),
        a = /^http/.test(to)
          ? to
          : S.domain.replace(/\/+$/, "") +
            "/" +
            to.replace(/^\/+|\/+$/g, "") +
            (to.replace(/^\/+|\/+$/g, "") ? "/" : "");
      files.push({
        path: f + "/index.html",
        text:
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirecting</title><meta name="robots" content="noindex"><link rel="canonical" href="' +
          esc(a) +
          '"><meta http-equiv="refresh" content="0;url=' +
          esc(a) +
          '"></head><body><a href="' +
          esc(a) +
          '">Click here</a><script>location.replace(' +
          JSON.stringify(a) +
          ")</script></body></html>",
      });
    });
    var d = new Date().toISOString().slice(0, 10);
    files.push(
      {
        path: "sitemap.xml",
        text:
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          routes
            .map(function (r) {
              return (
                "<url><loc>" +
                esc(S.domain.replace(/\/+$/, "") + "/" + (r ? r + "/" : "")) +
                "</loc><lastmod>" +
                d +
                "</lastmod></url>"
              );
            })
            .join("\n") +
          "\n</urlset>",
      },
      {
        path: "robots.txt",
        text:
          "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /write/\nSitemap: " +
          S.domain.replace(/\/+$/, "") +
          "/sitemap.xml\n",
      }
    );
    if (viaW) {
      var fbw = await loadFb(),
        cu = fbw.auth().currentUser;
      if (!cu) throw new Error("Pehle Admin login (OTP) karo");
      var idt = await cu.getIdToken(true),
        rsp = await fetch(S.workerUrl.replace(/\/+$/, "") + "/publish", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + idt,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Update site from admin",
            files: files
              .map(function (f) {
                return { path: f.path, text: f.text };
              })
              .concat(
                bl.map(function (b) {
                  return { path: b.path, b64: b.b64 };
                })
              ),
          }),
        }),
        rj = {};
      try {
        rj = await rsp.json();
      } catch (x) {}
      if (!rsp.ok) throw new Error(rj.error || "Server " + rsp.status);
      toast("Published! Site 1-2 minute mein update hogi");
      btn.textContent = "Save and publish";
      btn.disabled = false;
      return;
    }
    var info = await gh("");
    var br = info.default_branch,
      ref = await gh("/git/ref/heads/" + br),
      cm = await gh("/git/commits/" + ref.object.sha),
      all = files
        .map(function (f) {
          return { path: f.path, body: { content: f.text, encoding: "utf-8" } };
        })
        .concat(
          bl.map(function (b) {
            return {
              path: b.path,
              body: { content: b.b64, encoding: "base64" },
            };
          })
        ),
      tree = [];
    for (var i = 0; i < all.length; i += 6) {
      await Promise.all(
        all.slice(i, i + 6).map(async function (a) {
          var r = await gh("/git/blobs", "POST", a.body);
          tree.push({ path: a.path, mode: "100644", type: "blob", sha: r.sha });
        })
      );
    }
    var t = await gh("/git/trees", "POST", {
        base_tree: cm.tree.sha,
        tree: tree,
      }),
      c = await gh("/git/commits", "POST", {
        message: "Update site from admin",
        tree: t.sha,
        parents: [ref.object.sha],
      });
    await gh("/git/refs/heads/" + br, "PATCH", { sha: c.sha });
    toast("Published! Site 1-2 minute mein update hogi");
    btn.textContent = "Save and publish";
    btn.disabled = false;
  } catch (e) {
    if (typeof old !== "undefined") S = old;
    toast("Publish nahi hua: " + e.message);
    btn.textContent = "Save and publish";
    btn.disabled = false;
  }
}

async function hsh(s) {
  var b = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("jea|" + s)
  );
  return Array.prototype.map
    .call(new Uint8Array(b), function (x) {
      return ("0" + x.toString(16)).slice(-2);
    })
    .join("");
}
function gate(setNew) {
  if (!setNew && fbOn() && !/[?&]admin=passcode/.test(location.search)) {
    adminOtp();
    return;
  }
  var first = setNew || !S.adminHash,
    o = document.createElement("div");
  o.className = "modal on";
  o.id = "gt";
  o.innerHTML =
    '<div class="mbox"><h2 style="font-size:24px;margin:0 0 8px">Admin</h2><p class="sub" style="margin:0 0 12px">' +
    (first
      ? "Set a secret passcode (minimum 8 characters). Only you should know it."
      : "Enter your admin passcode.") +
    '</p><div style="display:grid;gap:10px"><input id="g1" type="password" placeholder="Passcode" autocomplete="off">' +
    (first
      ? '<input id="g2" type="password" placeholder="Confirm passcode" autocomplete="off">'
      : "") +
    '<button class="btn" id="gb">Continue</button><button class="btn ghost" id="gc">Cancel</button></div></div>';
  document.body.appendChild(o);
  document.getElementById("gc").onclick = function () {
    o.remove();
  };
  document.getElementById("gb").onclick = async function () {
    var a = $("g1").value;
    if (first) {
      if (a.length < 8) {
        toast("Passcode kam se kam 8 akshar ka rakho");
        return;
      }
      if (a !== $("g2").value) {
        toast("Dono passcode alag hain");
        return;
      }
      S.adminHash = await hsh(a);
      toast("Passcode set. Save and publish karne par ye save hoga.");
    } else if ((await hsh(a)) !== S.adminHash) {
      toast("Galat passcode");
      return;
    }
    try {
      sessionStorage.jea_ok = "1";
    } catch (e) {}
    owner = true;
    o.remove();
    site(true);
  };
}

/* ================= Firebase: writers + admin OTP ================= */
var FBV = "9.23.0",
  fbP = null,
  adm = null,
  wp = { user: null, prof: null, list: [], art: null, unsub: null };
function fbOn() {
  return !!(S.fb && S.fb.apiKey && S.fb.projectId);
}
function parseFb(t) {
  t = String(t || "").trim();
  var o = {};
  try {
    var j = JSON.parse(t);
    if (j && j.apiKey) return j;
  } catch (e) {}
  [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ].forEach(function (k) {
    var m = t.match(new RegExp(k + "\\s*[:=]\\s*[\"']([^\"']+)[\"']"));
    if (m) o[k] = m[1];
  });
  return o;
}
function loadFb() {
  if (fbP) return fbP;
  fbP = new Promise(function (res, rej) {
    if (!fbOn()) {
      fbP = null;
      rej(new Error("Firebase config nahi mila"));
      return;
    }
    var b = "https://www.gstatic.com/firebasejs/" + FBV + "/firebase-",
      L2 = ["app", "auth", "firestore"];
    function ld(i) {
      if (i >= L2.length) {
        try {
          if (!firebase.apps.length) firebase.initializeApp(S.fb);
          res(firebase);
        } catch (e) {
          fbP = null;
          rej(e);
        }
        return;
      }
      var s = document.createElement("script");
      s.src = b + L2[i] + "-compat.js";
      s.onload = function () {
        ld(i + 1);
      };
      s.onerror = function () {
        fbP = null;
        rej(new Error("Firebase load nahi hua (internet check karo)"));
      };
      document.head.appendChild(s);
    }
    ld(0);
  });
  return fbP;
}
function errTxt(e) {
  var c = (e && e.code) || "",
    m = {
      "auth/invalid-phone-number": "Mobile number sahi nahi hai",
      "auth/missing-phone-number": "Mobile number daalo",
      "auth/too-many-requests":
        "Bahut zyada koshish ho gayi. Thodi der baad try karo",
      "auth/invalid-verification-code": "OTP galat hai",
      "auth/code-expired": "OTP expire ho gaya, dobara bhejo",
      "auth/captcha-check-failed": "Security check fail hua, page refresh karo",
      "auth/quota-exceeded": "Aaj ki limit poori ho gayi, kal try karo",
      "auth/invalid-action-code":
        "Ye link purana ya galat hai. Naya link mangao",
      "auth/expired-action-code": "Link expire ho gaya. Naya link mangao",
      "auth/invalid-email": "Email sahi nahi hai",
      "auth/missing-email": "Email daalo",
      "auth/billing-not-enabled":
        "SMS ke liye Firebase billing on karni padegi",
      "auth/operation-not-allowed":
        "Ye login Firebase mein on nahi hai (Email/Password on karo)",
      "auth/wrong-password": "Number ya password galat hai",
      "auth/user-not-found": "Number ya password galat hai",
      "auth/invalid-credential": "Number ya password galat hai",
      "auth/invalid-login-credentials": "Number ya password galat hai",
      "auth/email-already-in-use":
        "Ye number pehle se registered hai. Login karo, ya password bhool gaye to humse reset karwao",
      "auth/weak-password": "Password kam se kam 8 akshar ka rakho",
      "auth/unauthorized-domain":
        "Ye website Firebase ke Authorized domains mein nahi hai",
      "auth/network-request-failed": "Internet nahi chal raha",
      "permission-denied": "Permission nahi mili (Firestore rules check karo)",
    };
  return m[c] || (e && e.message) || "Kuch galat hua";
}
function otpUI(box, o) {
  loadFb()
    .then(function (fb) {
      var rv = null,
        conf = null;
      box.innerHTML =
        '<div class="otp"><h3>' +
        esc(o.title) +
        '</h3><p class="sub" style="margin:0 0 14px">' +
        esc(o.note) +
        '</p><div id="o1" class="otps"><label>Mobile number<div class="ph10"><span>+91</span><input id="ophone" inputmode="numeric" maxlength="10" placeholder="10-digit number" autocomplete="tel-national"></div></label><button class="btn" id="osend" type="button">Send OTP</button></div><div id="o2" class="otps" style="display:none"><label>6-digit OTP<input id="ocode" inputmode="numeric" maxlength="6" placeholder="------" autocomplete="one-time-code"></label><button class="btn" id="over" type="button">Verify and login</button><button class="btn ghost sm" id="ochg" type="button">Change number</button></div><p id="omsg" class="omsg" role="status"></p><div id="rcap"></div><p class="rcn">This site is protected by reCAPTCHA. The Google Privacy Policy and Terms of Service apply.</p></div>';
      function msg(t) {
        var m = $("omsg");
        if (m) m.textContent = t;
      }
      function mk() {
        try {
          if (rv) rv.clear();
        } catch (e) {}
        var o = $("rcap");
        if (o && o.parentNode) {
          var n = document.createElement("div");
          n.id = "rcap";
          o.parentNode.replaceChild(n, o);
        }
        rv = new fb.auth.RecaptchaVerifier("rcap", { size: "invisible" });
      }
      mk();
      $("osend").onclick = async function () {
        var ph = $("ophone").value.replace(/\D/g, "");
        if (ph.length !== 10) {
          msg("10 digit ka mobile number daalo");
          return;
        }
        var bt = $("osend");
        bt.disabled = true;
        msg("OTP bhej rahe hain...");
        try {
          await fb
            .auth()
            .setPersistence(
              o.session
                ? fb.auth.Auth.Persistence.SESSION
                : fb.auth.Auth.Persistence.LOCAL
            );
          conf = await fb.auth().signInWithPhoneNumber("+91" + ph, rv);
          $("o1").style.display = "none";
          $("o2").style.display = "grid";
          msg("OTP +91" + ph + " par bheja gaya hai.");
          $("ocode").focus();
        } catch (e) {
          msg(errTxt(e));
          mk();
        }
        bt.disabled = false;
      };
      $("over").onclick = async function () {
        var c = $("ocode").value.replace(/\D/g, "");
        if (c.length !== 6) {
          msg("6 digit ka OTP daalo");
          return;
        }
        $("over").disabled = true;
        msg("Check kar rahe hain...");
        try {
          var r = await conf.confirm(c);
          o.done(r.user);
        } catch (e) {
          msg(errTxt(e));
          $("over").disabled = false;
        }
      };
      $("ochg").onclick = function () {
        $("o2").style.display = "none";
        $("o1").style.display = "grid";
        msg("");
        mk();
      };
    })
    .catch(function (e) {
      box.innerHTML = '<div class="card"><p>' + esc(e.message) + "</p></div>";
    });
}
function wireRte(root, setFn) {
  root.querySelectorAll(".rte").forEach(function (ed) {
    ed.oninput = function () {
      setFn(ed.dataset.rk, ed.innerHTML);
    };
    ["keyup", "mouseup", "touchend", "blur"].forEach(function (ev) {
      ed.addEventListener(ev, function () {
        var s = getSelection();
        if (s.rangeCount && ed.contains(s.anchorNode))
          saved = s.getRangeAt(0).cloneRange();
      });
    });
  });
  root.querySelectorAll(".rbar").forEach(function (bar) {
    var ed = bar.nextElementSibling;
    function run(fn) {
      var ok = saved && ed.contains(saved.commonAncestorContainer);
      ed.focus();
      if (ok) {
        var s = getSelection();
        s.removeAllRanges();
        s.addRange(saved);
      }
      try {
        document.execCommand("styleWithCSS", false, false);
      } catch (e) {}
      fn();
      setFn(ed.dataset.rk, ed.innerHTML);
    }
    bar.querySelectorAll("button").forEach(function (b) {
      b.onpointerdown = b.onmousedown = function (e) {
        e.preventDefault();
      };
      b.onclick = function () {
        if (b.dataset.cmd)
          run(function () {
            document.execCommand(b.dataset.cmd);
          });
        else if (b.dataset.blk)
          run(function () {
            document.execCommand("formatBlock", false, b.dataset.blk);
          });
        else if (b.dataset.link) {
          var u = prompt("Link likho: poora link (https://...)");
          if (u) {
            u = u.trim();
            if (!/^(https?:|mailto:|tel:)/i.test(u))
              u = "https://internal.link/" + u.replace(/^\/+/, "");
            run(function () {
              document.execCommand("createLink", false, u);
            });
          }
        }
      };
    });
    var fs = bar.querySelector("[data-font]");
    if (fs)
      fs.onchange = function () {
        if (fs.value) {
          var v = fs.value;
          run(function () {
            document.execCommand("fontName", false, v);
          });
          fs.value = "";
        }
      };
    var zs = bar.querySelector("[data-size]");
    if (zs)
      zs.onchange = function () {
        if (zs.value) {
          var v = zs.value;
          run(function () {
            document.execCommand("fontSize", false, v);
          });
          zs.value = "";
        }
      };
    var ci = bar.querySelector("[data-color]");
    if (ci)
      ci.oninput = function () {
        var v = ci.value;
        run(function () {
          document.execCommand("foreColor", false, v);
        });
      };
    var sl = bar.querySelector(".plk");
    if (sl)
      sl.onchange = function () {
        if (sl.value) {
          var v = sl.value;
          run(function () {
            document.execCommand(
              "createLink",
              false,
              "https://internal.link/" + v
            );
          });
          sl.value = "";
        }
      };
  });
}
/* ----- admin OTP login ----- */
function adminOtp() {
  var o = document.createElement("div");
  o.className = "modal on";
  o.id = "gt";
  o.innerHTML =
    '<div class="mbox"><button class="x" id="gx" aria-label="Close">&times;</button><div id="gbox"><p>Loading...</p></div></div>';
  document.body.appendChild(o);
  $("gx").onclick = function () {
    o.remove();
  };
  loadFb()
    .then(function (fb) {
      fb.auth()
        .signOut()
        .catch(function () {});
      otpUI($("gbox"), {
        title: "Admin login",
        note: "Apna admin mobile number daalo. OTP aayega.",
        session: true,
        done: async function (u) {
          try {
            var d = await fb
              .firestore()
              .doc("admins/" + u.phoneNumber)
              .get();
            if (d.exists) {
              adm = { phone: u.phoneNumber, name: (d.data() || {}).name || "" };
              owner = true;
              o.remove();
              toast("Welcome " + (adm.name || ""));
              site(true);
            } else {
              await fb.auth().signOut();
              var m = $("omsg");
              if (m) m.textContent = "Ye number admin list mein nahi hai.";
            }
          } catch (e) {
            var m2 = $("omsg");
            if (m2) m2.textContent = errTxt(e);
          }
        },
      });
    })
    .catch(function (e) {
      var g = $("gbox");
      if (g) g.innerHTML = "<p>" + esc(e.message) + "</p>";
    });
}
/* ----- admin: articles + admins ----- */
async function approveArt(fb, a) {
  var d = new Date(),
    base = slug(a.title) || "post",
    s = base,
    k = 2;
  while (
    S.posts.some(function (p) {
      return p.slug === s;
    })
  )
    s = base + "-" + k++;
  S.posts.unshift({
    id: "p" + Date.now(),
    au: a.authorName || "",
    ab: a.authorBio || "",
    aup: "",
    time: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    slug: s,
    t: a.title,
    cat: a.cat || "Updates",
    date: d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    cover: "",
    body: clean(a.body),
    st: "",
    sd: "",
  });
  await fb
    .firestore()
    .collection("articles")
    .doc(a.id)
    .update({ status: "published", slug: s, note: "" });
}
async function loadSubs() {
  var box = $("sbox");
  if (!box) return;
  try {
    var fb = await loadFb(),
      q = await fb
        .firestore()
        .collection("articles")
        .where("status", "==", "pending")
        .get(),
      arr = [];
    q.forEach(function (d) {
      var x = d.data();
      x.id = d.id;
      arr.push(x);
    });
    box.innerHTML = arr.length
      ? arr
          .map(function (a, i) {
            return (
              '<div class="item"><b>' +
              esc(a.title) +
              "</b><small>By " +
              esc(a.authorName) +
              " (" +
              esc(a.authorPhone) +
              ") | " +
              esc(a.cat) +
              '</small><details><summary>Read article</summary><div class="prose" style="margin-top:10px">' +
              clean(a.body) +
              '</div></details><div class="row"><button class="btn sm" data-sa="' +
              i +
              '">Approve</button><button class="btn ghost sm" data-sr="' +
              i +
              '">Ask changes</button><button class="btn red sm" data-sx="' +
              i +
              '">Delete</button></div></div>'
            );
          })
          .join("")
      : "<p>Koi pending article nahi.</p>";
    box.querySelectorAll("[data-sa]").forEach(function (x) {
      x.onclick = async function () {
        x.disabled = true;
        try {
          await approveArt(fb, arr[+x.dataset.sa]);
          toast("Blog mein add ho gaya. Ab Save and publish dabao.");
          loadSubs();
        } catch (e) {
          toast(errTxt(e));
          x.disabled = false;
        }
      };
    });
    box.querySelectorAll("[data-sr]").forEach(function (x) {
      x.onclick = async function () {
        var n = prompt("Author ko kya badlav batana hai?");
        if (n === null) return;
        try {
          await fb
            .firestore()
            .collection("articles")
            .doc(arr[+x.dataset.sr].id)
            .update({ status: "rejected", note: n });
          loadSubs();
        } catch (e) {
          toast(errTxt(e));
        }
      };
    });
    box.querySelectorAll("[data-sx]").forEach(function (x) {
      x.onclick = async function () {
        if (!confirm("Ye article delete karna hai?")) return;
        try {
          await fb
            .firestore()
            .collection("articles")
            .doc(arr[+x.dataset.sx].id)
            .delete();
          loadSubs();
        } catch (e) {
          toast(errTxt(e));
        }
      };
    });
  } catch (e) {
    box.innerHTML = "<p>" + esc(errTxt(e)) + "</p>";
  }
}
async function writerAct(fb, a, act) {
  var db = fb.firestore(),
    ph = String(a.phone || "")
      .replace(/\D/g, "")
      .slice(-10);
  if (act === "approve")
    await db.doc("authors/" + a.id).update({ approved: true });
  else if (act === "block")
    await db.doc("authors/" + a.id).update({ approved: false });
  else if (act === "reset") {
    if (ph.length !== 10) throw new Error("Is writer ka number nahi mila");
    var d = await db.doc("wv/" + ph).get(),
      v = d.exists && d.data().v ? d.data().v : 1;
    await db.doc("wv/" + ph).set({ v: v + 1 });
    await db.doc("authors/" + a.id).update({ approved: false });
  }
}
async function loadWriters() {
  var box = $("wbox");
  if (!box) return;
  try {
    var fb = await loadFb(),
      q = await fb.firestore().collection("authors").get(),
      arr = [];
    q.forEach(function (d) {
      var x = d.data();
      x.id = d.id;
      arr.push(x);
    });
    arr.sort(function (a, b) {
      return (a.approved ? 1 : 0) - (b.approved ? 1 : 0);
    });
    box.innerHTML = arr.length
      ? arr
          .map(function (a, i) {
            var ph = String(a.phone || "")
              .replace(/\D/g, "")
              .slice(-10);
            return (
              '<div class="item"><b>' +
              esc(a.name || "(no name)") +
              "</b><small>" +
              esc(a.phone || a.email || "") +
              (a.email && a.phone ? " | " + esc(a.email) : "") +
              (a.approved ? " | Verified" : " | Waiting for your check") +
              '</small><div class="row">' +
              (ph
                ? '<a class="btn ghost sm" href="tel:+91' + ph + '">Call</a>'
                : "") +
              (a.approved
                ? '<button class="btn red sm" data-wb="' +
                  i +
                  '">Block</button>'
                : '<button class="btn sm" data-wa="' +
                  i +
                  '">Approve</button>') +
              (a.kind === "email" || !ph
                ? ""
                : '<button class="btn ghost sm" data-wr="' +
                  i +
                  '">Reset password</button>') +
              "</div></div>"
            );
          })
          .join("")
      : "<p>Abhi koi writer account nahi.</p>";
    function bind(sel, act, ask, done) {
      box.querySelectorAll(sel).forEach(function (x) {
        x.onclick = async function () {
          if (ask && !confirm(ask)) return;
          try {
            await writerAct(
              fb,
              arr[+x.dataset[Object.keys(x.dataset)[0]]],
              act
            );
            toast(done);
            loadWriters();
          } catch (e) {
            toast(errTxt(e));
          }
        };
      });
    }
    bind("[data-wa]", "approve", "", "Writer verify ho gaya");
    bind(
      "[data-wb]",
      "block",
      "Is writer ko block karna hai?",
      "Writer block ho gaya"
    );
    bind(
      "[data-wr]",
      "reset",
      "Password reset karna hai? Writer ko naya account banana padega aur purane draft nahi milenge.",
      "Reset ho gaya. Writer ko bolo Create account kare."
    );
  } catch (e) {
    box.innerHTML = "<p>" + esc(errTxt(e)) + "</p>";
  }
}
async function loadAdmins() {
  var box = $("abox");
  if (!box) return;
  try {
    var fb = await loadFb(),
      q = await fb.firestore().collection("admins").get(),
      arr = [];
    q.forEach(function (d) {
      var x = d.data();
      x.id = d.id;
      arr.push(x);
    });
    box.innerHTML =
      '<div class="item"><b>Add an admin</b><input id="an" placeholder="Name"><div class="ph10"><span>+91</span><input id="aph" inputmode="numeric" maxlength="10" placeholder="10-digit number"></div><button class="btn sm" id="aadd">Add admin</button><small style="color:var(--mute)">Ye person apne number par OTP se admin login kar payega.</small></div>' +
      arr
        .map(function (a, i) {
          return (
            '<div class="item"><b>' +
            esc(a.name || "Admin") +
            "</b><small>" +
            esc(a.id) +
            "</small>" +
            (adm && a.id === adm.phone
              ? "<small>(you)</small>"
              : '<button class="btn red sm" data-ar="' +
                i +
                '">Remove admin</button>') +
            "</div>"
          );
        })
        .join("");
    $("aadd").onclick = async function () {
      var ph = $("aph").value.replace(/\D/g, ""),
        n = $("an").value.trim();
      if (ph.length !== 10) {
        toast("10 digit ka number daalo");
        return;
      }
      try {
        await fb
          .firestore()
          .doc("admins/+91" + ph)
          .set({
            name: n || "Admin",
            addedBy: adm ? adm.phone : "",
            createdAt: fb.firestore.FieldValue.serverTimestamp(),
          });
        toast("Admin add ho gaya");
        loadAdmins();
      } catch (e) {
        toast(errTxt(e));
      }
    };
    box.querySelectorAll("[data-ar]").forEach(function (x) {
      x.onclick = async function () {
        if (!confirm("Is admin ko hata dein?")) return;
        try {
          await fb
            .firestore()
            .doc("admins/" + arr[+x.dataset.ar].id)
            .delete();
          loadAdmins();
        } catch (e) {
          toast(errTxt(e));
        }
      };
    });
  } catch (e) {
    box.innerHTML = "<p>" + esc(errTxt(e)) + "</p>";
  }
}
/* ----- writer portal ----- */
function wpBox(h) {
  var b = $("wp");
  if (b) {
    b.innerHTML = h;
    b.querySelectorAll("[data-r]").forEach(function (a) {
      a.onclick = function (e) {
        e.preventDefault();
        go(a.dataset.r);
      };
    });
  }
  return b;
}
function wpMsg(t) {
  wpBox(
    '<div class="card cd"><div class="cb"><p>' + esc(t) + "</p></div></div>"
  );
}
function initPortal() {
  var box = $("wp");
  if (!box) return;
  if (!fbOn()) {
    wpMsg("Writer login jaldi shuru hoga.");
    return;
  }
  wpMsg("Loading...");
  loadFb()
    .then(async function (fb) {
      await wpEmailLink(fb);
      if (wp.unsub) wp.unsub();
      wp.unsub = fb.auth().onAuthStateChanged(async function (u) {
        if (!$("wp")) return;
        wp.user = u;
        if (wp.signing) return;
        if (!u) {
          wpLogin(fb);
          return;
        }
        try {
          await wpProfile(fb);
        } catch (e) {
          wpMsg(errTxt(e));
        }
      });
    })
    .catch(function (e) {
      wpMsg(e.message);
    });
}
function wemail(ph, v) {
  return "w" + ph + (v > 1 ? "v" + v : "") + "@writers.jamiaentranceadda.in";
}
async function wver(fb, ph) {
  try {
    var d = await fb
      .firestore()
      .doc("wv/" + ph)
      .get();
    return d.exists && d.data().v > 1 ? d.data().v : 1;
  } catch (e) {
    return 1;
  }
}
function wpEmailLink(fb) {
  return (async function () {
    if (
      !(
        fb.auth().isSignInWithEmailLink &&
        fb.auth().isSignInWithEmailLink(location.href)
      )
    )
      return;
    try {
      var em = "";
      try {
        em = localStorage.jea_wemail || "";
      } catch (e) {}
      if (!em)
        em = (prompt("Apna Gmail likho (jis par link aaya tha)") || "").trim();
      if (!em) return;
      await fb.auth().setPersistence(fb.auth.Auth.Persistence.LOCAL);
      await fb.auth().signInWithEmailLink(em, location.href);
      try {
        localStorage.removeItem("jea_wemail");
      } catch (e) {}
      try {
        history.replaceState(null, "", U("write"));
      } catch (e) {}
    } catch (e) {
      wp.err = errTxt(e);
    }
  })();
}
function wpLogin(fb, mode) {
  mode = mode || "link";
  var su = mode === "signup",
    lk2 = mode === "link";
  var tabs =
    '<div class="row" style="margin-bottom:14px"><button class="btn sm' +
    (lk2 ? "" : " ghost") +
    '" id="wtk" type="button">Gmail link</button><button class="btn sm' +
    (mode === "login" ? "" : " ghost") +
    '" id="wtl" type="button">Login</button><button class="btn sm' +
    (su ? "" : " ghost") +
    '" id="wts" type="button">Create account</button></div>';
  var body = lk2
    ? '<label>Your Gmail<input id="wem" type="email" inputmode="email" autocomplete="email" placeholder="yourname@gmail.com"></label><button class="btn" id="wsend" type="button">Send login link</button><p id="wmsg" class="omsg" role="status"></p><p class="sub" style="margin:0;font-size:14px">Aapko Gmail par ek link milega. Link dabate hi login ho jayega, password nahi chahiye. Mail na dikhe to <b>Spam</b> folder dekho. Pehli baar login par hamari team verify karegi, tab tak aap draft likh sakte ho.</p>'
    : (su
        ? '<label>Your name<input id="wn" autocomplete="name" placeholder="Full name"></label>'
        : "") +
      '<label>Mobile number<div class="ph10"><span>+91</span><input id="wph" inputmode="numeric" maxlength="10" autocomplete="tel-national" placeholder="10-digit number"></div></label><label>Password<input id="wpw" type="password" autocomplete="' +
      (su ? "new-password" : "current-password") +
      '" placeholder="' +
      (su ? "Create a password (8+ characters)" : "Your password") +
      '"></label>' +
      (su
        ? '<label>Confirm password<input id="wpw2" type="password" autocomplete="new-password" placeholder="Type the password again"></label>'
        : "") +
      '<button class="btn" id="wgo" type="button">' +
      (su ? "Create account" : "Login") +
      '</button><p id="wmsg" class="omsg" role="status"></p><p class="sub" style="margin:0;font-size:14px">' +
      (su
        ? "Account banne ke baad hamari team aapko call karke verify karegi. Verify hone ke baad hi aapka article submit ho payega. Tab tak aap draft likh sakte ho."
        : "Password bhool gaye? Humein WhatsApp karo, hum reset kar denge.") +
      "</p>";
  wpBox(
    '<div class="card cd"><div class="cb">' +
      tabs +
      '<div class="otps">' +
      body +
      "</div></div></div>"
  );
  $("wtk").onclick = function () {
    wpLogin(fb, "link");
  };
  $("wtl").onclick = function () {
    wpLogin(fb, "login");
  };
  $("wts").onclick = function () {
    wpLogin(fb, "signup");
  };
  function msg(t) {
    var m = $("wmsg");
    if (m) m.textContent = t;
  }
  if (wp.err) {
    msg(wp.err);
    wp.err = "";
  }
  if (lk2) {
    $("wsend").onclick = async function () {
      var em = $("wem").value.trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) {
        msg("Sahi Gmail likho");
        return;
      }
      var bt = $("wsend");
      bt.disabled = true;
      msg("Link bhej rahe hain...");
      try {
        await fb
          .auth()
          .sendSignInLinkToEmail(em, {
            url: location.origin + U("write"),
            handleCodeInApp: true,
          });
        try {
          localStorage.jea_wemail = em;
        } catch (e) {}
        msg(
          "Link " +
            em +
            " par bhej diya. Gmail inbox (ya Spam) kholkar link dabao."
        );
      } catch (e) {
        msg(errTxt(e));
      }
      bt.disabled = false;
    };
    return;
  }
  $("wgo").onclick = async function () {
    var ph = $("wph").value.replace(/\D/g, ""),
      pw = $("wpw").value,
      nm = su ? $("wn").value.trim() : "";
    if (ph.length !== 10) {
      msg("10 digit ka mobile number daalo");
      return;
    }
    if (su) {
      if (!nm) {
        msg("Apna naam likho");
        return;
      }
      if (pw.length < 8) {
        msg("Password kam se kam 8 akshar ka rakho");
        return;
      }
      if (pw !== $("wpw2").value) {
        msg("Dono password alag hain");
        return;
      }
    } else if (!pw) {
      msg("Password daalo");
      return;
    }
    var bt = $("wgo");
    bt.disabled = true;
    msg("Ek minute...");
    try {
      await fb.auth().setPersistence(fb.auth.Auth.Persistence.LOCAL);
      var v = await wver(fb, ph),
        em = wemail(ph, v);
      if (su) {
        wp.signing = true;
        var cr;
        try {
          cr = await fb.auth().createUserWithEmailAndPassword(em, pw);
        } catch (e1) {
          wp.signing = false;
          throw e1;
        }
        try {
          await fb
            .firestore()
            .doc("authors/" + cr.user.uid)
            .set({
              name: nm,
              phone: "+91" + ph,
              bio: "",
              kind: "pw",
              approved: false,
              createdAt: fb.firestore.FieldValue.serverTimestamp(),
            });
        } catch (e2) {
          wp.signing = false;
          await cr.user.delete().catch(function () {});
          throw e2;
        }
        wp.signing = false;
        wp.user = cr.user;
        await wpProfile(fb);
      } else {
        await fb.auth().signInWithEmailAndPassword(em, pw);
      }
    } catch (e) {
      msg(errTxt(e));
      bt.disabled = false;
    }
  };
}
async function wpProfile(fb) {
  var d = await fb
    .firestore()
    .doc("authors/" + wp.user.uid)
    .get();
  wp.prof = d.exists ? d.data() : null;
  if (!wp.prof || !wp.prof.name) {
    wpProfForm(fb);
    return;
  }
  await wpList(fb);
}
function wpProfForm(fb) {
  var p = wp.prof || {};
  wpBox(
    '<div class="card cd"><div class="cb"><h3>Your profile</h3><p class="sub" style="margin:0 0 12px">Ye naam aur line aapke article ke saath dikhegi.</p><div class="otps"><label>Your name<input id="pn" value="' +
      esc(p.name || "") +
      '"></label><label>One line about you (e.g. B.A. student, JMI)<input id="pb" value="' +
      esc(p.bio || "") +
      '"></label>' +
      (p.phone
        ? ""
        : '<label>Mobile number (optional, hum call karke verify karenge)<div class="ph10"><span>+91</span><input id="pph" inputmode="numeric" maxlength="10" placeholder="10-digit number"></div></label>') +
      '<button class="btn" id="ps2">Save profile</button></div></div></div>'
  );
  $("ps2").onclick = async function () {
    var n = $("pn").value.trim();
    if (!n) {
      toast("Naam likho");
      return;
    }
    var d = Object.assign({}, wp.prof || {}, {
      name: n,
      bio: $("pb").value.trim(),
    });
    if (!d.phone) {
      var q = $("pph") ? $("pph").value.replace(/\D/g, "") : "";
      d.phone = q.length === 10 ? "+91" + q : "";
    }
    var em = wp.user && wp.user.email;
    if (em && !/@writers\.jamiaentranceadda\.in$/.test(em)) d.email = em;
    if (!d.kind) d.kind = d.email ? "email" : "pw";
    if (d.approved === undefined) d.approved = false;
    wp.prof = d;
    try {
      await fb
        .firestore()
        .doc("authors/" + wp.user.uid)
        .set(d);
      await wpList(fb);
    } catch (e) {
      toast(errTxt(e));
    }
  };
}
async function wpList(fb) {
  var q = await fb
      .firestore()
      .collection("articles")
      .where("authorUid", "==", wp.user.uid)
      .get(),
    arr = [];
  q.forEach(function (d) {
    var x = d.data();
    x.id = d.id;
    arr.push(x);
  });
  arr.sort(function (a, b) {
    return (
      ((b.updatedAt && b.updatedAt.seconds) || 0) -
      ((a.updatedAt && a.updatedAt.seconds) || 0)
    );
  });
  wp.list = arr;
  var ST = {
    draft: "Draft",
    pending: "Waiting for approval",
    published: "Published",
    rejected: "Needs changes",
  };
  wpBox(
    '<div class="wpbar"><div><b>' +
      esc(wp.prof.name) +
      "</b><small>" +
      esc(wp.prof.phone || wp.prof.email || "") +
      (wp.prof.approved ? " | Verified" : " | Waiting for verification") +
      '</small></div><div class="row"><button class="btn sm" id="wnew">+ New article</button><button class="btn ghost sm" id="wprof">Edit profile</button><button class="btn ghost sm" id="wout">Logout</button></div></div>' +
      (arr.length
        ? arr
            .map(function (a, i) {
              return (
                '<div class="card cd"><div class="cb"><span class="bd' +
                (a.status === "rejected" ? " hot" : "") +
                '">' +
                (ST[a.status] || esc(a.status)) +
                '</span><h3 style="margin-top:8px">' +
                esc(a.title) +
                "</h3>" +
                (a.note
                  ? "<p><b>Admin note:</b> " + esc(a.note) + "</p>"
                  : "") +
                '<div class="row" style="margin-top:12px">' +
                (a.status === "draft" || a.status === "rejected"
                  ? '<button class="btn sm" data-we="' + i + '">Edit</button>'
                  : "") +
                (a.status === "draft"
                  ? '<button class="btn red sm" data-wd="' +
                    i +
                    '">Delete</button>'
                  : "") +
                (a.status === "published" && a.slug
                  ? lk("blog/" + a.slug, "View live", "btn ghost sm")
                  : "") +
                "</div></div></div>"
              );
            })
            .join("")
        : '<p class="sub">Abhi koi article nahi. "New article" dabao.</p>')
  );
  var b = $("wp");
  $("wnew").onclick = function () {
    wpEdit(fb, { title: "", cat: "Exam Tips", body: "", status: "draft" });
  };
  $("wprof").onclick = function () {
    wpProfForm(fb);
  };
  $("wout").onclick = function () {
    fb.auth().signOut();
  };
  b.querySelectorAll("[data-we]").forEach(function (x) {
    x.onclick = function () {
      wpEdit(fb, wp.list[+x.dataset.we]);
    };
  });
  b.querySelectorAll("[data-wd]").forEach(function (x) {
    x.onclick = async function () {
      if (!confirm("Draft delete karna hai?")) return;
      try {
        await fb
          .firestore()
          .collection("articles")
          .doc(wp.list[+x.dataset.wd].id)
          .delete();
        await wpList(fb);
      } catch (e) {
        toast(errTxt(e));
      }
    };
  });
}
function wpEdit(fb, art) {
  wp.art = art;
  var cats = [
    "Exam Tips",
    "Current Affairs",
    "JMI",
    "AMU",
    "CUET",
    "Law",
    "Study Material",
    "Updates",
  ];
  wpBox(
    '<div class="wpbar"><b>' +
      (art.id ? "Edit article" : "New article") +
      '</b><button class="btn ghost sm" id="wback">Back</button></div><div class="otps"><label>Title<input id="wtitle" value="' +
      esc(art.title) +
      '"></label><label>Category<select id="wcat">' +
      cats
        .map(function (c) {
          return (
            "<option" +
            ((art.cat || "Exam Tips") === c ? " selected" : "") +
            ">" +
            c +
            "</option>"
          );
        })
        .join("") +
      '</select></label><b style="font-size:14px">Article (select words for bold, heading or link)</b>' +
      rteBox("wp", art.body) +
      '<div class="row"><button class="btn" id="wsub">Submit for approval</button><button class="btn ghost" id="wsave">Save draft</button></div><p class="sub" style="margin:0">Submit karne ke baad article admin ke paas jayega. Approve hone par aapke naam ke saath publish hoga.</p></div>'
  );
  wireRte($("wp"), function (k, h) {
    wp.art.body = h;
  });
  $("wback").onclick = function () {
    wpList(fb);
  };
  $("wsave").onclick = function () {
    wpSave(fb, false);
  };
  $("wsub").onclick = function () {
    wpSave(fb, true);
  };
}
async function wpSave(fb, submit) {
  var a = wp.art,
    body = clean(a.body || ""),
    t = $("wtitle").value.trim(),
    wc = body
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
  if (!t) {
    toast("Title likho");
    return;
  }
  if (submit && !wp.prof.approved) {
    toast(
      "Aapka account abhi verify nahi hua. Hamari call ka intezar karo. Tab tak draft save kar sakte ho."
    );
    return;
  }
  if (submit && wc < 50) {
    toast("Article bahut chhota hai (kam se kam 50 shabd)");
    return;
  }
  if (body.length > 55000) {
    toast("Article bahut lamba hai, usse chhota karo");
    return;
  }
  var db = fb.firestore(),
    now = fb.firestore.FieldValue.serverTimestamp(),
    data = {
      authorUid: wp.user.uid,
      authorPhone: wp.prof.phone || wp.prof.email || "",
      authorName: wp.prof.name,
      authorBio: wp.prof.bio || "",
      title: t,
      cat: $("wcat").value,
      body: body,
      status: submit ? "pending" : "draft",
      updatedAt: now,
      note: "",
    };
  try {
    if (a.id) {
      await db.collection("articles").doc(a.id).update(data);
    } else {
      data.createdAt = now;
      var r = await db.collection("articles").add(data);
      a.id = r.id;
    }
    toast(
      submit
        ? "Submit ho gaya. Approval ke baad publish hoga."
        : "Draft save ho gaya"
    );
    await wpList(fb);
  } catch (e) {
    toast(errTxt(e));
  }
}
rt = getRoute();
site();
if (wantAdmin && !owner && !fbOn()) {
  var ok = false;
  try {
    ok = sessionStorage.jea_ok === "1" && !!S.adminHash;
  } catch (e) {}
  if (ok) {
    owner = true;
    site(true);
  }
}

window.onpopstate = function () {
  rt = getRoute();
  site();
};
