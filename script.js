let capacity = 0;
let cache = new Map();
let lastAction = "";

function initCache() {
    capacity = parseInt(document.getElementById("capacity").value);
    cache.clear();
    lastAction = "";
    render();
    showMessage("Cache Initialized");
}

function put() {
    let key = document.getElementById("key").value;
    let value = document.getElementById("value").value;

    if (key === "" || value === "") return;

    if (cache.has(key)) {
        cache.delete(key);
        lastAction = "hit";
        showMessage("Cache HIT (Updated)", "hit");
    } else if (cache.size === capacity) {
        let lruKey = cache.keys().next().value;
        cache.delete(lruKey);
        lastAction = "evict";
        showMessage(`Evicted Key: ${lruKey}`, "evict");
    } else {
        lastAction = "miss";
        showMessage("Cache MISS (New Entry)", "miss");
    }

    cache.set(key, value);
    render();
}

function get() {
    let key = document.getElementById("key").value;

    if (!cache.has(key)) {
        lastAction = "miss";
        showMessage("Cache MISS", "miss");
        return;
    }

    let value = cache.get(key);
    cache.delete(key);
    cache.set(key, value);

    lastAction = "hit";
    showMessage(`Cache HIT → Value: ${value}`, "hit");
    render();
}

function render() {
    let container = document.getElementById("cache");
    container.innerHTML = "";

    let entries = Array.from(cache.entries());

    for (let i = 0; i < capacity; i++) {
        let block = document.createElement("div");
        block.className = "cache-block";

        if (entries[i]) {
            let item = document.createElement("div");
            item.className = "cache-item";

            if (lastAction === "hit") item.classList.add("hit");
            if (lastAction === "evict") item.classList.add("evict");

            item.innerHTML = `
                <div>Key: ${entries[i][0]}</div>
                <span>Val: ${entries[i][1]}</span>
            `;
            block.appendChild(item);
        }

        container.appendChild(block);
    }
}

function showMessage(text, type = "") {
    let msg = document.getElementById("message");
    msg.innerText = text;
    msg.className = type;
}
