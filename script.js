// ================= STATE & LOCAL STORAGE =================
let stories = JSON.parse(localStorage.getItem("maurya_stories_data")) || INITIAL_STORIES;
let favorites = JSON.parse(localStorage.getItem("maurya_favorites")) || [];
let currentTab = "home";

// Audio Player State
const audio = document.getElementById("mainAudio");
let activeStoryId = null;
let activeEpIndex = 0;

// Website khulte hi sabhi sections aur pichli ruki hui story load karein
window.addEventListener("DOMContentLoaded", () => {
    renderHomeCategories();
    renderDiscover("All");
    renderLibrary();
    renderRanking();
    restoreLastPlaybackSession(); // Jahan user ne chhoda tha wahi se load karega
    checkSavedUser();
});

function saveStoriesData() {
    localStorage.setItem("maurya_stories_data", JSON.stringify(stories));
}

// ================= 1. HOME TAB RENDER =================
function renderHomeCategories() {
    const container = document.getElementById("homeCategoriesContainer");
    container.innerHTML = "";

    CATEGORIES.forEach(category => {
        const catStories = stories.filter(s => s.category.toLowerCase() === category.toLowerCase());
        if (catStories.length === 0) return;

        const block = document.createElement("div");
        block.className = "category-block";
        block.innerHTML = `
            <div class="category-title">
                <span>${category}</span>
            </div>
            <div class="horizontal-scroll">
                ${catStories.map(story => createStoryCardHTML(story)).join("")}
            </div>
        `;
        container.appendChild(block);
    });
}

function createStoryCardHTML(story) {
    const isFav = favorites.includes(story.id);
    return `
        <div class="story-card" onclick="openStoryProfile('${story.id}')">
            <span class="play-badge">🎧 ${formatNumber(story.plays)}</span>
            <button class="fav-heart-btn" onclick="toggleFavorite(event, '${story.id}')">
                ${isFav ? "❤️" : "🤍"}
            </button>
            <img src="${story.cover}" alt="${story.title}">
            <div class="story-card-body">
                <div class="story-card-title">${story.title}</div>
                <div class="story-card-cat">${story.category} • ${story.episodes.length} Eps</div>
            </div>
        </div>
    `;
}

// ================= 2. DISCOVER TAB =================
function renderDiscover(selectedGenre) {
    const chipsBox = document.getElementById("discoverChips");
    const allGenres = ["All", ...CATEGORIES];
    chipsBox.innerHTML = allGenres.map(g => `
        <button class="chip ${g === selectedGenre ? 'active' : ''}" onclick="renderDiscover('${g}')">${g}</button>
    `).join("");

    const filtered = selectedGenre === "All"
        ? stories
        : stories.filter(s => s.category === selectedGenre);

    document.getElementById("discoverGrid").innerHTML = filtered.map(s => createStoryCardHTML(s)).join("");
}

// ================= 3. MY LIBRARY (FAVORITES) =================
function toggleFavorite(event, storyId) {
    event.stopPropagation();
    if (favorites.includes(storyId)) {
        favorites = favorites.filter(id => id !== storyId);
    } else {
        favorites.push(storyId);
    }
    localStorage.setItem("maurya_favorites", JSON.stringify(favorites));
    renderHomeCategories();
    renderDiscover("All");
    renderLibrary();
    if (activeStoryId === storyId || !document.getElementById("storyProfileView").classList.contains("hidden")) {
        openStoryProfile(storyId);
    }
}

function renderLibrary() {
    const libGrid = document.getElementById("libraryGrid");
    const favStories = stories.filter(s => favorites.includes(s.id));

    if (favStories.length === 0) {
        libGrid.innerHTML = `<p style="color:#9e9ea9; grid-column:1/-1;">Abhi tak koi favorite story add nahi ki gayi hai. Kisi bhi story ke 🤍 button par click karke yahan jodein!</p>`;
        return;
    }
    libGrid.innerHTML = favStories.map(s => createStoryCardHTML(s)).join("");
}

// ================= 4. TOP 100 RANKING (Sorted by Plays) =================
function renderRanking() {
    const rankContainer = document.getElementById("rankingList");
    const sorted = [...stories].sort((a, b) => b.plays - a.plays).slice(0, 100);

    rankContainer.innerHTML = sorted.map((story, idx) => {
        const rank = idx + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : "";
        return `
            <div class="ranking-item" onclick="openStoryProfile('${story.id}')">
                <div class="rank-number ${rankClass}">#${rank}</div>
                <img src="${story.cover}" alt="${story.title}">
                <div class="ranking-info">
                    <h4>${story.title}</h4>
                    <p style="font-size:0.8rem; color:#9e9ea9;">${story.category} • ${story.episodes.length} Episodes</p>
                    <div class="ranking-plays">🔥 ${story.plays.toLocaleString()} Logon ne suna</div>
                </div>
            </div>
        `;
    }).join("");
}

// ================= 5. STORY PROFILE & EPISODES =================
function openStoryProfile(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    const profileView = document.getElementById("storyProfileView");
    profileView.classList.remove("hidden");

    const isFav = favorites.includes(story.id);

    document.getElementById("storyProfileContent").innerHTML = `
        <div class="profile-header">
            <img src="${story.cover}" alt="${story.title}">
            <div class="profile-meta">
                <h2>${story.title}</h2>
                <span class="chip active" style="font-size:0.75rem;">${story.category}</span>
                <div class="profile-stats">🎧 ${story.plays.toLocaleString()} Total Plays</div>
                <p class="profile-desc">${story.description}</p>
                <button class="fav-action-btn" onclick="toggleFavorite(event, '${story.id}')">
                    ${isFav ? "❤️ Library mein Added" : "🤍 Add to My Library"}
                </button>
            </div>
        </div>
        <h3 style="margin-bottom:10px;">📋 All Episodes (${story.episodes.length})</h3>
        <div>
            ${story.episodes.map((ep, index) => {
                const isCurrent = (activeStoryId === story.id && activeEpIndex === index);
                return `
                    <div class="episode-row ${isCurrent ? 'playing-ep' : ''}" onclick="startEpisode('${story.id}', ${index})">
                        <div>
                            <h4>${ep.title}</h4>
                            <small style="color:#9e9ea9;">⏱ ${ep.duration}</small>
                        </div>
                        <button class="icon-btn">${isCurrent && !audio.paused ? "⏸" : "▶️"}</button>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function goBackFromProfile() {
    switchTab(currentTab);
}

// ================= 6. AUDIO PLAYER, MINI-PLAYER & AUTO RESUME =================
function startEpisode(storyId, epIndex) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    const ep = story.episodes[epIndex];
    if (!ep) return;

    const isSameEpisode = (activeStoryId === storyId && activeEpIndex === epIndex);

    if (!isSameEpisode) {
        activeStoryId = storyId;
        activeEpIndex = epIndex;
        audio.src = ep.audioUrl;
        audio.currentTime = 0;

        // Play count +1 badhayein aur Ranking update karein
        story.plays += 1;
        saveStoriesData();
        renderHomeCategories();
        renderRanking();
    }

    updatePlayerUI(story, ep);
    openFullPlayer();
    audio.play().catch(() => {});
    updatePlayPauseIcons();
}

function updatePlayerUI(story, ep) {
    // Full Player UI
    document.getElementById("fpCover").src = story.cover;
    document.getElementById("fpStoryTitle").innerText = story.title;
    document.getElementById("fpEpisodeTitle").innerText = ep.title;
    document.getElementById("fpPlayCount").innerText = `🎧 ${story.plays.toLocaleString()} Plays`;

    // Sticky Mini-Player UI (Hamesha niche dikhega)
    document.getElementById("miniPlayer").classList.remove("hidden");
    document.getElementById("mpCover").src = story.cover;
    document.getElementById("mpStoryTitle").innerText = story.title;
    document.getElementById("mpEpTitle").innerHTML = `${ep.title} • <span id="mpTime">${formatTime(audio.currentTime)}</span>`;

    // Render Suggestions below player
    const suggestions = stories.filter(s => s.id !== story.id);
    document.getElementById("playerSuggestionList").innerHTML = suggestions
        .map(s => createStoryCardHTML(s))
        .join("");
}

// Play / Pause: Jahan rokenge wahi rukega, band ya reset nahi hoga
function togglePlayPause() {
    if (!activeStoryId) return;
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayPauseIcons();
    savePlaybackProgress();
}

function updatePlayPauseIcons() {
    const icon = audio.paused ? "▶️" : "⏸";
    document.getElementById("fpPlayPauseBtn").innerText = icon;
    document.getElementById("mpPlayPauseBtn").innerText = icon;
}

// Back button on Full Player: Full player band hoga par niche Mini-Player chalta rahega!
function minimizePlayer() {
    document.getElementById("fullPlayerView").classList.add("hidden");
    document.getElementById("miniPlayer").classList.remove("hidden");
}

function openFullPlayer() {
    if (!activeStoryId) return;
    document.getElementById("fullPlayerView").classList.remove("hidden");
}

function skipSeconds(sec) {
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + sec));
}

function prevEpisode() {
    if (activeEpIndex > 0) {
        startEpisode(activeStoryId, activeEpIndex - 1);
    }
}

function nextEpisode() {
    const story = stories.find(s => s.id === activeStoryId);
    if (story && activeEpIndex < story.episodes.length - 1) {
        startEpisode(activeStoryId, activeEpIndex + 1);
    }
}

function seekAudio() {
    const bar = document.getElementById("seekBar");
    if (audio.duration) {
        audio.currentTime = (bar.value / 100) * audio.duration;
    }
}

// Har second progress save karein taaki website band karke kholne par wahi se chale
audio.addEventListener("timeupdate", () => {
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;

    document.getElementById("currentTimeText").innerText = formatTime(cur);
    document.getElementById("totalTimeText").innerText = formatTime(dur);

    const mpTimeEl = document.getElementById("mpTime");
    if (mpTimeEl) mpTimeEl.innerText = formatTime(cur);

    if (dur > 0) {
        document.getElementById("seekBar").value = (cur / dur) * 100;
    }

    savePlaybackProgress();
});

audio.addEventListener("play", updatePlayPauseIcons);
audio.addEventListener("pause", updatePlayPauseIcons);
audio.addEventListener("ended", nextEpisode);

function savePlaybackProgress() {
    if (!activeStoryId) return;
    const state = {
        storyId: activeStoryId,
        epIndex: activeEpIndex,
        currentTime: audio.currentTime
    };
    localStorage.setItem("maurya_playback_state", JSON.stringify(state));
}

// Jab user dobara website khole toh pichli story usi second par set ho jaye
function restoreLastPlaybackSession() {
    const saved = JSON.parse(localStorage.getItem("maurya_playback_state"));
    if (!saved) return;

    const story = stories.find(s => s.id === saved.storyId);
    if (!story || !story.episodes[saved.epIndex]) return;

    activeStoryId = saved.storyId;
    activeEpIndex = saved.epIndex;
    const ep = story.episodes[activeEpIndex];

    audio.src = ep.audioUrl;
    audio.addEventListener("loadedmetadata", function setTimeOnce() {
        if (saved.currentTime && saved.currentTime < audio.duration) {
            audio.currentTime = saved.currentTime;
        }
        audio.removeEventListener("loadedmetadata", setTimeOnce);
    });

    updatePlayerUI(story, ep);
    updatePlayPauseIcons();
}

// ================= 7. NAVIGATION & SEARCH =================
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));

    document.getElementById(`${tabName}Tab`).classList.remove("hidden");
    document.getElementById(`nav-${tabName}`).classList.add("active");
}

function openSearch() {
    document.getElementById("searchView").classList.remove("hidden");
    document.getElementById("searchInput").focus();
    handleSearch();
}

// Note 1: Search se back karne par wapas first tab (Home) par aa jaye
function closeSearchAndGoHome() {
    document.getElementById("searchView").classList.add("hidden");
    switchTab("home");
}

function clearSearchInput() {
    document.getElementById("searchInput").value = "";
    handleSearch();
}

function handleSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const box = document.getElementById("searchSuggestions");

    const matched = stories.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
        box.innerHTML = `<p style="color:#9e9ea9; padding:10px;">Koi milti-julti story nahi mili.</p>`;
        return;
    }

    box.innerHTML = matched.map(s => `
        <div class="search-item" onclick="selectSearchResult('${s.id}')">
            <img src="${s.cover}" alt="${s.title}">
            <div>
                <h4>${s.title}</h4>
                <small style="color:#9e9ea9;">${s.category} • 🎧 ${s.plays.toLocaleString()} Plays</small>
            </div>
        </div>
    `).join("");
}

function selectSearchResult(storyId) {
    document.getElementById("searchView").classList.add("hidden");
    openStoryProfile(storyId);
}

// ================= 8. LOGIN & SAVE TO LOGIN_INFO FILE =================
function openLoginModal() {
    document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
    document.getElementById("loginModal").classList.add("hidden");
}

async function submitLogin(e) {
    e.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const contact = document.getElementById("loginContact").value.trim();
    const password = document.getElementById("loginPass").value.trim();
    const time = new Date().toLocaleString();

    const userEntry = { name, contact, password, time };
    localStorage.setItem("maurya_current_user", JSON.stringify(userEntry));

    // Python server (server.py) chal raha hai toh seedha login_info.txt mein save karega
    try {
        await fetch("/save-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userEntry)
        });
    } catch (err) {
        // Agar bina Python server ke direct HTML khola hai toh login_info.txt download kar dega
        const textLine = `Name: ${name} | Contact: ${contact} | Password: ${password} | Time: ${time}\n`;
        const blob = new Blob([textLine], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "login_info.txt";
        a.click();
    }

    document.getElementById("loginStatusMsg").innerText = "✅ Login safal raha! Details save ho gayi hain.";
    checkSavedUser();
    setTimeout(closeLoginModal, 1200);
}

function checkSavedUser() {
    const user = JSON.parse(localStorage.getItem("maurya_current_user"));
    if (user && user.name) {
        document.getElementById("userAvatar").innerText = user.name.charAt(0).toUpperCase();
    }
}

// Helpers
function formatTime(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}

function formatNumber(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + "K" : num;
}
