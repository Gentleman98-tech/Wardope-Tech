
// ====== GRUND-ELEMENTE ======
const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const content = document.getElementById("content");

// ====== KATEGORIE-STRUKTUR (für Modal Dropdown) ======
const categoryStructure = [
  {
    group: "T-Shirts & Oberteile",
    items: [
      "T-Shirt Sport",
      "T-Shirt Casual",
      "Poloshirts",
      "Pullover",
      "Hoodies"
    ]
  },
  {
    group: "Indoorjacken",
    items: [
      "Strickjacken",
      "Polokragen-Jacken",
      "Trainingsjacken"
    ]
  },
  {
    group: "Hemden",
    items: [
      "Hemd Business",
      "Hemd Casual"
    ]
  },
  {
    group: "Hosen",
    items: [
      "Jeans",
      "Hosen Casual",
      "Hosen Business"
    ]
  },
  {
    group: "Outdoorjacken",
    items: [
      "Leicht",
      "Schwer"
    ]
  },
  {
    group: "Schuhe",
    items: [
      "Sneaker Business",
      "Sneaker Casual",
      "Boots Business",
      "Boots Casual"
    ]
  },
  {
    group: "Socken",
    items: []
  }
];

// Dropdown automatisch füllen
function fillCategorySelect(selectElement) {
  selectElement.innerHTML = "";

  categoryStructure.forEach(group => {
    const optGroup = document.createElement("optgroup");
    optGroup.label = group.group;

    if (group.items.length === 0) {
      const option = document.createElement("option");
      option.value = group.group;
      option.textContent = group.group;
      optGroup.appendChild(option);
    } else {
      group.items.forEach(item => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        optGroup.appendChild(option);
      });
    }

    selectElement.appendChild(optGroup);
  });
}

// ====== KATEGORIEN ======
const categories = ["Alle", "T-Shirts", "Hosen", "Schuhe", "Hoodies"];

// Merkt sich den zuletzt gewählten Filter
let currentClosetFilter = "Alle";

// ====== STORAGE ======
const STORAGE_KEY = "wardrobe_items_v1";

// Demo-Startbestand (wird nur genutzt, wenn localStorage leer ist)
const demoItems = [
  { id: "ts1", type: "T-Shirts", name: "T-Shirt Weiß", img: "images/closet.jpeg", season: "Sommer", occasion: "Casual" },
  { id: "ts2", type: "T-Shirts", name: "T-Shirt Schwarz", img: "images/closet.jpeg", season: "Ganzjahr", occasion: "Casual" },
  { id: "ho1", type: "Hosen", name: "Jeans Blau", img: "images/closet.jpeg", season: "Ganzjahr", occasion: "Casual" },
  { id: "ho2", type: "Hosen", name: "Chino Beige", img: "images/closet.jpeg", season: "Sommer", occasion: "Business" },
  { id: "sh1", type: "Schuhe", name: "Sneaker Weiß", img: "images/closet.jpeg", season: "Ganzjahr", occasion: "Casual" },
  { id: "sh2", type: "Schuhe", name: "Lederschuh Braun", img: "images/closet.jpeg", season: "Ganzjahr", occasion: "Business" },
  { id: "hd1", type: "Hoodies", name: "Hoodie Grau", img: "images/closet.jpeg", season: "Winter", occasion: "Casual" },
  { id: "hd2", type: "Hoodies", name: "Hoodie Schwarz", img: "images/closet.jpeg", season: "Winter", occasion: "Sport" },
];

let wardrobeItems = [];

// ====== HELPERS: LOAD/SAVE ======
function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    wardrobeItems = [...demoItems];
    saveItems();
    return;
  }
  try {
    wardrobeItems = JSON.parse(raw);
    if (!Array.isArray(wardrobeItems)) wardrobeItems = [...demoItems];
  } catch {
    wardrobeItems = [...demoItems];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wardrobeItems));
}

function uid() {
  return "id_" + Math.random().toString(16).slice(2) + "_" + Date.now();
}

// ====== MENU OPEN/CLOSE ======
menuBtn.addEventListener("click", () => {
  sideMenu.classList.toggle("open");
});

// ====== NAV CLICK ======
document.querySelectorAll("nav li").forEach(item => {
  item.addEventListener("click", () => {
    const page = item.getAttribute("data-page");
    sideMenu.classList.remove("open");
    renderPage(page);
  });
});

// ====== PAGES ======
function renderHome() {
  content.innerHTML = `
    <div class="glass-box">
      <h1>Hallo Timon</h1>
      <p>Willkommen in deinem digitalen Kleiderschrank</p>
    </div>
  `;
}
function renderOutfits() {
  content.innerHTML = `
    <div class="closet-panel">
      <div class="closet-topbar">
        <h1 class="closet-title">Outfits</h1>
      </div>

      <div class="thin-divider"></div>

      <div class="outfit-block">
        <div class="outfit-title">T-Shirt</div>

        <div class="carousel">
          <button class="arrow" id="leftArrow" type="button">◀</button>

          <div class="carousel-track">
            <div class="card preview-left" id="cardLeft"></div>
            <div class="card active" id="cardCenter"></div>
            <div class="card preview-right" id="cardRight"></div>
          </div>

          <button class="arrow" id="rightArrow" type="button">▶</button>
        </div>
      </div>
    </div>
  `;

setTimeout(initCarousel, 0); // <-- HIER REIN
}
let carouselIndex = 0;

const demoShirts = [
  "images/closet.jpeg",
  "images/closet.jpeg",
  "images/closet.jpeg"
];

function initCarousel() {
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  // Wenn die Elemente nicht da sind -> stimmt renderOutfits HTML nicht oder initCarousel wird zu früh aufgerufen
  if (!leftArrow || !rightArrow) {
    console.log("❌ Pfeile nicht gefunden. IDs prüfen: leftArrow/rightArrow");
    return;
  }

  leftArrow.addEventListener("click", () => {
    carouselIndex = (carouselIndex - 1 + demoShirts.length) % demoShirts.length;
    renderCarousel();
  });

  rightArrow.addEventListener("click", () => {
    carouselIndex = (carouselIndex + 1) % demoShirts.length;
    renderCarousel();
  });

  renderCarousel(); // erstes Rendern
}
function renderCarousel() {
  const left = document.getElementById("cardLeft");
  const center = document.getElementById("cardCenter");
  const right = document.getElementById("cardRight");

  if (!left || !center || !right) return;

  const total = demoShirts.length;

  const leftIndex = (carouselIndex - 1 + total) % total;
  const rightIndex = (carouselIndex + 1) % total;

  left.innerHTML = `<img src="${demoShirts[leftIndex]}">`;
  center.innerHTML = `<img src="${demoShirts[carouselIndex]}">`;
  right.innerHTML = `<img src="${demoShirts[rightIndex]}">`;
}
    
function buildOutfitRondell() {
  const container = document.getElementById("outfitContainer");

  // Kategorien die im Rondell erscheinen
  const outfitTypes = ["T-Shirts", "Hosen", "Socken", "Schuhe"];

  // Index merkt sich aktuelle Position je Kategorie
  const state = {};

  outfitTypes.forEach(type => {
    const items = wardrobeItems.filter(i => i.type === type);

    state[type] = 0;

    const section = document.createElement("div");
    section.className = "outfit-section";

    const title = document.createElement("div");
    title.className = "outfit-title";
    title.textContent = type;

    const row = document.createElement("div");
    row.className = "outfit-row";

    const left = document.createElement("button");
    left.className = "arrow-btn";
    left.textContent = "◀";

    const right = document.createElement("button");
    right.className = "arrow-btn";
    right.textContent = "▶";

    const center = document.createElement("div");
    center.className = "outfit-center";

    function renderCenter() {
      center.innerHTML = "";

      if (items.length === 0) {
        center.textContent = "Kein Item";
        return;
      }

      const item = items[state[type]];

      const card = document.createElement("div");
      card.className = "outfit-card";
      card.innerHTML = `
        <img src="${item.img}">
        <div>${item.name}</div>
        <div class="small">${item.color || ""}</div>
      `;

      center.appendChild(card);
    }

    left.onclick = () => {
      if (items.length === 0) return;
      state[type] = (state[type] - 1 + items.length) % items.length;
      renderCenter();
    };

    right.onclick = () => {
      if (items.length === 0) return;
      state[type] = (state[type] + 1) % items.length;
      renderCenter();
    };

    row.appendChild(left);
    row.appendChild(center);
    row.appendChild(right);

    section.appendChild(title);
    section.appendChild(row);

    container.appendChild(section);

    renderCenter();
  });
}

function renderInspiration() {
  content.innerHTML = `
    <div class="glass-box">
      <h1>Inspiration</h1>
      <p>Hier speichern wir später Looks/Bilder (z. B. aus dem Internet).</p>
    </div>
  `;
}

// ====== CLOSET ======
function renderCloset(initialFilter = "Alle") {
  content.innerHTML = `
    <div class="closet-panel">
      <div class="closet-topbar">
        <h1 class="closet-title">Mein Kleiderschrank</h1>
        <button class="add-btn" id="addItemBtn">+ Hinzufügen</button>
      </div>

      <div class="filter-strip">
        <div class="filter-bar" id="filterBar"></div>
      </div>

      <div class="thin-divider"></div>

      <div id="closetBody"></div>
    </div>
  `;

  const filterBar = document.getElementById("filterBar");
  const closetBody = document.getElementById("closetBody");

  // Buttons rendern
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat;

    if (cat === initialFilter) btn.classList.add("active");

    btn.addEventListener("click", () => {
      currentClosetFilter = cat; // Zustand merken
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderClosetBody(cat);
    });

    filterBar.appendChild(btn);
  });

  function renderCard(i) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <img src="${i.img}" alt="${i.name}">
      <div class="item-name">${i.name}</div>
      <div class="item-meta">
  ${i.type} • ${i.occasion} • ${i.season} • ${i.color || ""}
</div>
    `;
    return card;
  }

  function renderSectionTitle(label, count) {
    const t = document.createElement("div");
    t.className = "section-title";
    t.textContent = `${label} (${count})`;
    return t;
  }

  function renderThinDivider() {
    const d = document.createElement("div");
    d.className = "thin-divider";
    return d;
  }

  function renderRow(items) {
    const row = document.createElement("div");
    row.className = "item-row";
    items.forEach(i => row.appendChild(renderCard(i)));
    return row;
  }

  function renderClosetBody(filter) {
    closetBody.innerHTML = "";

    // FALL A: Alle -> kategorisiert untereinander (jede Kategorie ist eine ROW)
    if (filter === "Alle") {
      const types = categories.filter(c => c !== "Alle");

      types.forEach((type, idx) => {
        const items = wardrobeItems.filter(i => i.type === type);

        closetBody.appendChild(renderSectionTitle(type, items.length));
        closetBody.appendChild(renderRow(items));

        if (idx !== types.length - 1) {
          closetBody.appendChild(renderThinDivider());
        }
      });

      return;
    }

    // FALL B: Ein Filter -> eine Reihe (Row)
    const items = wardrobeItems.filter(i => i.type === filter);
    closetBody.appendChild(renderSectionTitle(filter, items.length));
    closetBody.appendChild(renderRow(items));
  }

  // erstes Rendern
  renderClosetBody(initialFilter);

  // + Hinzufügen
  const addBtn = document.getElementById("addItemBtn");
  addBtn.addEventListener("click", openAddModal);
}

// ====== ROUTING ======
function renderPage(page) {
  if (page === "home") renderHome();
  if (page === "closet") renderCloset(currentClosetFilter);
  if (page === "outfits") renderOutfits();
  if (page === "inspiration") renderInspiration();
}

// ====== MODAL: ADD ITEM ======
function openAddModal() {
  const modal = document.createElement("div");
  modal.id = "addModal";
  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-card">
      <h2>Teil hinzufügen</h2>

      <label>Foto</label>
      <input type="file" id="photoInput" accept="image/*">

      <label>Name</label>
      <input type="text" id="nameInput" placeholder="z.B. T-Shirt Schwarz">

    <label>Kategorie</label>
<select id="typeInput"></select>

<label>Farbe</label>
<select id="colorInput">
  <option>Weiß</option>
  <option>Schwarz</option>
  <option>Braun</option>
  <option>Beige</option>
  <option>Dunkelblau</option>
</select>

      <label>Anlass</label>
      <select id="occInput">
        <option>Casual</option>
        <option>Business</option>
        <option>Sport</option>
      </select>

      <label>Jahreszeit</label>
      <select id="seasonInput">
        <option>Ganzjahr</option>
        <option>Sommer</option>
        <option>Frühling</option>
        <option>Herbst</option>
        <option>Winter</option>
      </select>

      <div class="modal-actions">
        <button id="cancelBtn">Abbrechen</button>
        <button id="saveBtn">Speichern</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
// Kategorie Dropdown füllen
const categorySelect = document.getElementById("typeInput");
fillCategorySelect(categorySelect);

  // schließen
  modal.querySelector(".modal-backdrop").addEventListener("click", closeAddModal);
  document.getElementById("cancelBtn").addEventListener("click", closeAddModal);

  // speichern
  document.getElementById("saveBtn").addEventListener("click", saveNewItem);
}

function closeAddModal() {
  const modal = document.getElementById("addModal");
  if (modal) modal.remove();
}

// Bild als Base64 lesen
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Konnte Bild nicht lesen"));
    reader.readAsDataURL(file);
  });
}

async function saveNewItem() {
  const fileInput = document.getElementById("photoInput");
  const name = document.getElementById("nameInput").value.trim();
  const type = document.getElementById("typeInput").value;
  const occasion = document.getElementById("occInput").value;
  const season = document.getElementById("seasonInput").value;
const color = document.getElementById("colorInput").value;
  if (!name) {
    alert("Bitte einen Namen eingeben.");
    return;
  }

  let img = "images/closet.jpeg"; // Fallback
  const file = fileInput.files && fileInput.files[0];
  if (file) {
    try {
      img = await fileToBase64(file);
    } catch (e) {
      alert("Bild konnte nicht gespeichert werden. Ich nutze ein Standardbild.");
    }
  }

  const newItem = {
    id: uid(),
    type,
    name,
    img,
    occasion,
    season,
    color
  };

  wardrobeItems.push(newItem);
  saveItems();
  closeAddModal();

  // Nach Speichern: wieder auf Closet rendern mit aktuellem Filter
  renderCloset(currentClosetFilter);
}

// ====== INIT ======
loadItems();
renderHome();   