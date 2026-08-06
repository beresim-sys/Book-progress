// app.js

// Initial Data Structure representing the exact state in the screenshots
const INITIAL_CHAPTERS = [
  "פרולוג",
  "שרה",
  "רפאל",
  "סלווטור",
  "סוזט",
  "מלכה",
  "מאיר",
  "ניסים",
  "אפילוג",
  "נספח קהילת סלוניקי",
  "נספח גורל הדמויות"
];

const COLUMNS = [
  { id: "comments", label: "הכנסת הערות" },
  { id: "mindmap", label: "מפת חשיבה" },
  { id: "agents", label: "סוכן עריכה" },
  { id: "evil-editor", label: "העורך המרושע" },
  { id: "contradictions", label: "סתירות" },
  { id: "ai-writing", label: "כתיבת AI" },
  { id: "rewrite-engine", label: "מנוע שכתוב" }
];

// Screenshot 1 status mapping: Row index -> column id -> boolean status
const INITIAL_CHAPTER_STATUS = {
  0: { comments: true, mindmap: false, agents: true, "evil-editor": true, contradictions: true, "ai-writing": false, "rewrite-engine": false }, // פרולוג
  1: { comments: true, mindmap: true, agents: true, "evil-editor": true, contradictions: true, "ai-writing": false, "rewrite-engine": true },  // שרה
  2: { comments: true, mindmap: true, agents: true, "evil-editor": true, contradictions: true, "ai-writing": false, "rewrite-engine": true },  // רפאל
  3: { comments: true, mindmap: true, agents: true, "evil-editor": true, contradictions: true, "ai-writing": false, "rewrite-engine": false }, // סלווטור
  4: { comments: true, mindmap: true, agents: true, "evil-editor": true, contradictions: true, "ai-writing": false, "rewrite-engine": false }, // סוזט
  5: { comments: true, mindmap: true, agents: true, "evil-editor": true, contradictions: true, "ai-writing": true, "rewrite-engine": false },  // מלכה
  6: { comments: false, mindmap: false, agents: false, "evil-editor": false, contradictions: false, "ai-writing": false, "rewrite-engine": false }, // מאיר
  7: { comments: false, mindmap: false, agents: false, "evil-editor": false, contradictions: false, "ai-writing": false, "rewrite-engine": false }, // ניסים
  8: { comments: true, mindmap: false, agents: true, "evil-editor": false, contradictions: false, "ai-writing": false, "rewrite-engine": false }, // אפילוג
  9: { comments: true, mindmap: false, agents: true, "evil-editor": false, contradictions: false, "ai-writing": false, "rewrite-engine": false }, // נספח סלוניקי
  10: { comments: true, mindmap: false, agents: true, "evil-editor": false, contradictions: false, "ai-writing": false, "rewrite-engine": false } // נספח דמויות
};

// Screenshot 2 tasks mapping
const INITIAL_GENERAL_TASKS = [
  { id: "gt-1", title: "מפת חשיבה (ניתוח ספרותי)", desc: "ניתוח ספרותי מלא של הספר...", completed: false },
  { id: "gt-2", title: "סתירות כלליות", desc: "לחפש סתירות ואי התאמות בין הפרקים", completed: false },
  { id: "gt-3", title: "זרימה וחיבור", desc: "האם הספר מרגיש כסיפור אחד, עלילה מסודרת, או חלקים חלקים שלא מתחברים. בעיקר בחיבורים בין הפרקים.", completed: false }
];

// Screenshot 3 readers mapping
const INITIAL_READERS = [
  { name: "י", progress: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "שירה", progress: { 0: true, 1: true, 2: true, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "נטליה", progress: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "שרון הררי", progress: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "אמא", progress: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "סוזי", progress: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "דפנה", progress: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } },
  { name: "יהודית", progress: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 10: false } }
];

// App State
let state = {
  chapters: [],
  chapterStatus: {},
  generalTasks: [],
  readers: []
};

// SVG templates for icons
const SVG_CHECK_MARK = `
  <svg viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
`;

// Initialize Application
function initApp() {
  loadState();
  initTabs();
  initModal();
  renderAll();
  
  // Register click handlers for form actions
  document.getElementById("add-task-btn").addEventListener("click", handleAddGeneralTask);
  document.getElementById("add-reader-btn").addEventListener("click", handleAddReader);
  document.getElementById("new-reader-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAddReader();
  });
  document.getElementById("new-task-title").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAddGeneralTask();
  });
  document.getElementById("new-task-desc").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAddGeneralTask();
  });
}

// Load State from LocalStorage or use defaults
function loadState() {
  const savedState = localStorage.getItem("chayei_sarah_state");
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      // Backwards compatibility / data integrity checks
      if (!state.chapters || state.chapters.length === 0) {
        resetToDefault();
      }
    } catch (e) {
      console.error("Error parsing saved state, resetting...", e);
      resetToDefault();
    }
  } else {
    resetToDefault();
  }
}

// Reset data to screenshots default
function resetToDefault() {
  state.chapters = [...INITIAL_CHAPTERS];
  state.chapterStatus = JSON.parse(JSON.stringify(INITIAL_CHAPTER_STATUS));
  state.generalTasks = JSON.parse(JSON.stringify(INITIAL_GENERAL_TASKS));
  state.readers = JSON.parse(JSON.stringify(INITIAL_READERS));
  saveState();
}

// Save State to LocalStorage
function saveState() {
  localStorage.setItem("chayei_sarah_state", JSON.stringify(state));
}

// Dynamic Tab Switching
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active from all tabs & contents
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      // Add active to current tab and its section
      tab.classList.add("active");
      const activeSectionId = tab.getAttribute("data-tab");
      document.getElementById(activeSectionId).classList.add("active");
    });
  });
}

// Add Chapter Modal Logic
function initModal() {
  const modal = document.getElementById("chapter-modal");
  const openBtn = document.getElementById("add-chapter-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");
  const confirmBtn = document.getElementById("modal-confirm-btn");
  const input = document.getElementById("modal-chapter-name");

  openBtn.addEventListener("click", () => {
    input.value = "";
    modal.classList.add("active");
    input.focus();
  });

  const closeModal = () => modal.classList.remove("active");

  cancelBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  const confirmAdd = () => {
    const chapterName = input.value.trim();
    if (!chapterName) return;

    const newIndex = state.chapters.length;
    state.chapters.push(chapterName);
    
    // Initialize status columns to false for the new chapter
    state.chapterStatus[newIndex] = {};
    COLUMNS.forEach(col => {
      state.chapterStatus[newIndex][col.id] = false;
    });

    // Initialize reader status to false for this chapter
    state.readers.forEach(reader => {
      if (!reader.progress) reader.progress = {};
      reader.progress[newIndex] = false;
    });

    saveState();
    renderAll();
    closeModal();
  };

  confirmBtn.addEventListener("click", confirmAdd);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") confirmAdd();
  });
}

// Render All Parts of the Page
function renderAll() {
  renderOverviewTable();
  renderGeneralTasks();
  renderReaderTable();
  updateProgressWidget();
}

// Calculate Progress and update indicator widget
function updateProgressWidget() {
  let totalCells = 0;
  let checkedCells = 0;

  // Overview Table Completion
  state.chapters.forEach((_, chIndex) => {
    COLUMNS.forEach(col => {
      totalCells++;
      if (state.chapterStatus[chIndex] && state.chapterStatus[chIndex][col.id]) {
        checkedCells++;
      }
    });
  });

  const progressPercent = totalCells > 0 ? Math.round((checkedCells / totalCells) * 100) : 0;
  
  // Update Widget texts & bar width
  document.getElementById("overall-progress-text").textContent = `${progressPercent}%`;
  document.getElementById("overall-progress-bar").style.width = `${progressPercent}%`;
}

// Render Overview Table (Tab 1)
function renderOverviewTable() {
  const tbody = document.getElementById("chapters-table-body");
  tbody.innerHTML = "";

  state.chapters.forEach((chapterName, chIndex) => {
    const tr = document.createElement("tr");

    // Chapter Name Cell
    const tdName = document.createElement("td");
    tdName.textContent = chapterName;
    tr.appendChild(tdName);

    // Columns Checkboxes
    COLUMNS.forEach(col => {
      const tdCheck = document.createElement("td");
      tdCheck.className = "checkbox-cell";
      
      const isChecked = state.chapterStatus[chIndex] && state.chapterStatus[chIndex][col.id];
      
      const divCheck = document.createElement("div");
      divCheck.className = `circle-check checked-success ${isChecked ? "checked-success" : ""}`;
      if (isChecked) {
        divCheck.innerHTML = SVG_CHECK_MARK;
      } else {
        divCheck.classList.remove("checked-success");
      }

      tdCheck.appendChild(divCheck);
      
      // Toggle cell action
      tdCheck.addEventListener("click", () => {
        if (!state.chapterStatus[chIndex]) {
          state.chapterStatus[chIndex] = {};
        }
        state.chapterStatus[chIndex][col.id] = !isChecked;
        saveState();
        renderOverviewTable();
        updateProgressWidget();
      });

      tr.appendChild(tdCheck);
    });

    tbody.appendChild(tr);
  });
}

// Render General Book Tasks (Tab 2)
function renderGeneralTasks() {
  const listContainer = document.getElementById("general-tasks-list");
  listContainer.innerHTML = "";

  state.generalTasks.forEach(task => {
    const card = document.createElement("div");
    card.className = `task-card ${task.completed ? "completed" : ""}`;

    // Task details
    const contentDiv = document.createElement("div");
    contentDiv.className = "task-card-content";
    
    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;
    
    const desc = document.createElement("p");
    desc.className = "task-desc";
    desc.textContent = task.desc;

    contentDiv.appendChild(title);
    contentDiv.appendChild(desc);

    // Checkbox circular element (on the right)
    const checkDiv = document.createElement("div");
    checkDiv.className = `circle-check checked-info ${task.completed ? "checked-info" : ""}`;
    if (task.completed) {
      checkDiv.innerHTML = SVG_CHECK_MARK;
    } else {
      checkDiv.classList.remove("checked-info");
    }

    // Since it's RTL: content first, then checkbox (which renders on the left side of text physically, or vice versa depending on layout).
    // In style.css task-card is flex space-between, contentDiv (flex 1) will take space, checkDiv on the left/right. 
    // Let's append content and checkbox
    card.appendChild(contentDiv);
    card.appendChild(checkDiv);

    // Click handler to toggle
    card.addEventListener("click", () => {
      task.completed = !task.completed;
      saveState();
      renderGeneralTasks();
    });

    listContainer.appendChild(card);
  });
}

// Handle adding a new General Task
function handleAddGeneralTask() {
  const titleInput = document.getElementById("new-task-title");
  const descInput = document.getElementById("new-task-desc");
  
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();

  if (!title) return;

  const newTask = {
    id: `gt-${Date.now()}`,
    title: title,
    desc: desc || "אין תיאור למשימה זו",
    completed: false
  };

  state.generalTasks.push(newTask);
  saveState();
  renderGeneralTasks();

  // Clear inputs
  titleInput.value = "";
  descInput.value = "";
}

// Render Reader Tracking Table (Tab 3)
function renderReaderTable() {
  const theadRow = document.getElementById("reader-table-headers");
  const tbody = document.getElementById("reader-table-body");

  // Reset headers & body
  theadRow.innerHTML = "";
  tbody.innerHTML = "";

  // 1. Render Table Headers
  // First Header: Chapter / Reader (right-most)
  const thFirst = document.createElement("th");
  thFirst.textContent = "פרק \\ קוראת";
  theadRow.appendChild(thFirst);

  // Reader Name Headers
  state.readers.forEach((reader, rIndex) => {
    const thReader = document.createElement("th");
    
    const wrapper = document.createElement("div");
    wrapper.className = "reader-header-cell";

    // Delete (X) button
    const delBtn = document.createElement("button");
    delBtn.className = "delete-reader-btn";
    delBtn.innerHTML = "&times;";
    delBtn.title = "הסר קוראת";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (confirm(`האם למחוק את מעקב הקריאה של ${reader.name}?`)) {
        state.readers.splice(rIndex, 1);
        saveState();
        renderReaderTable();
      }
    });

    // Reader Name Span
    const nameSpan = document.createElement("span");
    nameSpan.textContent = reader.name;

    // RTL ordering: text then button
    wrapper.appendChild(delBtn);
    wrapper.appendChild(nameSpan);
    thReader.appendChild(wrapper);
    theadRow.appendChild(thReader);
  });

  // 2. Render Table Rows
  state.chapters.forEach((chapterName, chIndex) => {
    const tr = document.createElement("tr");

    // Chapter name cell
    const tdName = document.createElement("td");
    tdName.textContent = chapterName;
    tr.appendChild(tdName);

    // Reader status cells
    state.readers.forEach((reader) => {
      const tdCheck = document.createElement("td");
      tdCheck.className = "checkbox-cell";

      const isRead = reader.progress && reader.progress[chIndex];

      const divCheck = document.createElement("div");
      divCheck.className = `circle-check checked-info ${isRead ? "checked-info" : ""}`;
      if (isRead) {
        divCheck.innerHTML = SVG_CHECK_MARK;
      } else {
        divCheck.classList.remove("checked-info");
      }

      tdCheck.appendChild(divCheck);

      // Toggle action
      tdCheck.addEventListener("click", () => {
        if (!reader.progress) reader.progress = {};
        reader.progress[chIndex] = !isRead;
        saveState();
        renderReaderTable();
      });

      tr.appendChild(tdCheck);
    });

    tbody.appendChild(tr);
  });
}

// Handle adding a new Reader
function handleAddReader() {
  const input = document.getElementById("new-reader-name");
  const name = input.value.trim();

  if (!name) return;

  // Verify unique name
  if (state.readers.some(r => r.name.toLowerCase() === name.toLowerCase())) {
    alert("קוראת בשם זה כבר קיימת!");
    return;
  }

  // Set all chapters to false initially
  const initialProgress = {};
  state.chapters.forEach((_, index) => {
    initialProgress[index] = false;
  });

  const newReader = {
    name: name,
    progress: initialProgress
  };

  state.readers.push(newReader);
  saveState();
  renderReaderTable();

  // Clear and focus
  input.value = "";
  input.focus();
}

// Add state reset option to console or a button if needed (e.g. for testing)
window.resetBookDashboard = function() {
  if (confirm("האם לאפס את כל לוח הבקרה למצב המקורי של צילומי המסך?")) {
    resetToDefault();
    renderAll();
  }
};

// Start application on DOM Load
document.addEventListener("DOMContentLoaded", initApp);
