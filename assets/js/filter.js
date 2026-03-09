(function () {
  "use strict";

  const ARRAY_FIELDS = ["categories", "use_cases", "modalities"];
  const STRING_FIELDS = ["pricing"];
  const BOOL_FIELDS = ["api", "self_hosted"];
  const ALL_FILTER_FIELDS = [...ARRAY_FIELDS, ...STRING_FIELDS, ...BOOL_FIELDS];
  const INITIAL_VISIBLE = 24;
  const BATCH_SIZE = 24;

  let allCards = [];
  let matchedCards = [];
  let revealedCount = INITIAL_VISIBLE;
  let searchBox, resultsCount, resultsHelper, sortSelect, clearFiltersBtn, showMoreToolsBtn, toolsReveal, toolsRevealSummary, toolsRevealSentinel;

  function init() {
    allCards = Array.from(document.querySelectorAll(".tool-card"));
    searchBox = document.getElementById("searchBox");
    resultsCount = document.getElementById("resultsCount");
    resultsHelper = document.getElementById("resultsHelper");
    sortSelect = document.getElementById("sortSelect");
    clearFiltersBtn = document.getElementById("clearFiltersBtn");
    showMoreToolsBtn = document.getElementById("showMoreToolsBtn");
    toolsReveal = document.getElementById("toolsReveal");
    toolsRevealSummary = document.getElementById("toolsRevealSummary");
    toolsRevealSentinel = document.getElementById("toolsRevealSentinel");

    document.querySelectorAll(".filter-section__header").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var section = btn.closest(".filter-section");
        section.classList.toggle("is-collapsed");
        btn.setAttribute("aria-expanded", section.classList.contains("is-collapsed") ? "false" : "true");
      });
    });

    if (!allCards.length) return;

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", onFilterChange);
    });

    if (searchBox) {
      searchBox.addEventListener("input", debounce(onFilterChange, 200));
    }

    if (sortSelect) {
      sortSelect.addEventListener("change", onFilterChange);
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", clearFilters);
    }

    if (showMoreToolsBtn) {
      showMoreToolsBtn.addEventListener("click", showNextBatch);
    }

    setupRevealObserver();
    restoreFromURL();
    applyFilters();
  }

  function getActiveFilters() {
    var filters = {};
    ALL_FILTER_FIELDS.forEach(function (field) {
      filters[field] = [];
    });

    document.querySelectorAll('.filter-sidebar input[type="checkbox"]:checked').forEach(function (cb) {
      var name = cb.name;
      var val = cb.value;
      if (filters[name] !== undefined) {
        filters[name].push(val);
      }
    });

    return filters;
  }

  function matchesFilters(card, filters, query) {
    if (query) {
      var name = (card.dataset.name || "").toLowerCase();
      var desc = (card.dataset.description || "").toLowerCase();
      if (name.indexOf(query) === -1 && desc.indexOf(query) === -1) {
        return false;
      }
    }

    for (var i = 0; i < ARRAY_FIELDS.length; i++) {
      var field = ARRAY_FIELDS[i];
      if (filters[field].length === 0) continue;

      var attr = field === "use_cases" ? "useCases" : field;
      var cardVals = (card.dataset[attr] || "").split(",").filter(Boolean);
      var hasMatch = false;
      for (var j = 0; j < filters[field].length; j++) {
        if (cardVals.indexOf(filters[field][j]) !== -1) {
          hasMatch = true;
          break;
        }
      }
      if (!hasMatch) return false;
    }

    for (var i = 0; i < STRING_FIELDS.length; i++) {
      var field = STRING_FIELDS[i];
      if (filters[field].length === 0) continue;
      var val = card.dataset[field] || "";
      if (filters[field].indexOf(val) === -1) return false;
    }

    for (var i = 0; i < BOOL_FIELDS.length; i++) {
      var field = BOOL_FIELDS[i];
      if (filters[field].length === 0) continue;
      var attr = field === "self_hosted" ? "selfHosted" : field;
      var val = card.dataset[attr];
      if (val !== "true") return false;
    }

    return true;
  }

  function applyFilters() {
    var filters = getActiveFilters();
    var query = searchBox ? searchBox.value.toLowerCase().trim() : "";
    matchedCards = allCards.filter(function (card) {
      return matchesFilters(card, filters, query);
    });

    sortMatchedCards();
    renderVisibleCards();

    if (resultsCount) {
      resultsCount.innerHTML = "Showing <strong>" + Math.min(revealedCount, matchedCards.length) + "</strong> of <strong>" + matchedCards.length + "</strong> matching tools";
    }

    var hasAnyFilter = Object.keys(filters).some(function (k) { return filters[k].length > 0; }) || (searchBox && searchBox.value.trim().length > 0);
    if (clearFiltersBtn) {
      clearFiltersBtn.style.display = hasAnyFilter ? "" : "none";
    }

    updateCounts(filters, query);
    updateURL(filters, query);
    toggleEmptyState(matchedCards.length);
    updateRevealUI(hasAnyFilter, query);
  }

  function updateCounts(currentFilters, query) {
    document.querySelectorAll("[data-count-for]").forEach(function (el) {
      var parts = el.dataset.countFor.split(":");
      var field = parts[0];
      var value = parts[1];
      var count = 0;

      var testFilters = {};
      ALL_FILTER_FIELDS.forEach(function (f) {
        testFilters[f] = f === field ? [value] : currentFilters[f].slice();
      });

      allCards.forEach(function (card) {
        if (matchesFilters(card, testFilters, query)) count++;
      });

      el.textContent = count;
    });
  }

  function sortMatchedCards() {
    if (!sortSelect) return;
    var grid = document.querySelector(".tools-grid");
    if (!grid) return;

    var order = sortSelect.value;

    matchedCards.sort(function (a, b) {
      if (order === "name-asc") {
        return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      }
      if (order === "name-desc") {
        return (b.dataset.name || "").localeCompare(a.dataset.name || "");
      }
      if (order === "newest") {
        return (b.dataset.added || "").localeCompare(a.dataset.added || "");
      }
      return 0;
    });

    matchedCards.forEach(function (card) { grid.appendChild(card); });
  }

  function renderVisibleCards() {
    var visibleLimit = Math.min(revealedCount, matchedCards.length);
    var visibleSet = new Set(matchedCards.slice(0, visibleLimit));

    allCards.forEach(function (card) {
      card.style.display = visibleSet.has(card) ? "" : "none";
    });
  }

  function updateRevealUI(hasAnyFilter, query) {
    var visibleCount = Math.min(revealedCount, matchedCards.length);
    var remaining = Math.max(matchedCards.length - visibleCount, 0);
    var hasMore = remaining > 0;

    if (resultsHelper) {
      if (!matchedCards.length) {
        resultsHelper.textContent = "Try a broader search or remove a few filters to see more tools.";
      } else if (hasMore) {
        resultsHelper.textContent = "Keep scrolling to reveal more tools, or refine the list with filters.";
      } else if (hasAnyFilter || query) {
        resultsHelper.textContent = "You are seeing every tool that matches the current filters.";
      } else {
        resultsHelper.textContent = "You are seeing every tool in the directory.";
      }
    }

    if (toolsReveal) {
      toolsReveal.style.display = hasMore ? "" : "none";
    }

    if (toolsRevealSummary) {
      if (hasMore) {
        toolsRevealSummary.textContent = remaining + " more tools are ready below this point.";
      } else {
        toolsRevealSummary.textContent = "";
      }
    }

    if (showMoreToolsBtn) {
      showMoreToolsBtn.style.display = hasMore ? "" : "none";
      if (hasMore) {
        showMoreToolsBtn.textContent = "Show " + Math.min(BATCH_SIZE, remaining) + " more tools";
      }
    }
  }

  function setupRevealObserver() {
    if (!("IntersectionObserver" in window) || !toolsRevealSentinel) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showNextBatch();
        }
      });
    }, {
      rootMargin: "200px 0px"
    });

    observer.observe(toolsRevealSentinel);
  }

  function resetRevealWindow() {
    revealedCount = INITIAL_VISIBLE;
  }

  function showNextBatch() {
    if (revealedCount >= matchedCards.length) return;

    revealedCount = Math.min(revealedCount + BATCH_SIZE, matchedCards.length);
    renderVisibleCards();
    updateRevealUI(hasActiveFilters(), searchBox ? searchBox.value.toLowerCase().trim() : "");

    if (resultsCount) {
      resultsCount.innerHTML = "Showing <strong>" + Math.min(revealedCount, matchedCards.length) + "</strong> of <strong>" + matchedCards.length + "</strong> matching tools";
    }
  }

  function hasActiveFilters() {
    var filters = getActiveFilters();
    return Object.keys(filters).some(function (k) { return filters[k].length > 0; }) || (searchBox && searchBox.value.trim().length > 0);
  }

  function updateURL(filters, query) {
    var params = new URLSearchParams();
    ALL_FILTER_FIELDS.forEach(function (field) {
      if (filters[field].length > 0) {
        params.set(field, filters[field].join(","));
      }
    });
    if (query) params.set("q", query);
    if (sortSelect && sortSelect.value) params.set("sort", sortSelect.value);

    var qs = params.toString();
    var url = window.location.pathname + (qs ? "?" + qs : "");
    history.replaceState(null, "", url);
  }

  function restoreFromURL() {
    var params = new URLSearchParams(window.location.search);

    ALL_FILTER_FIELDS.forEach(function (field) {
      var val = params.get(field);
      if (!val) return;
      var values = val.split(",");
      values.forEach(function (v) {
        var cb = document.querySelector(
          '.filter-sidebar input[name="' + field + '"][value="' + v + '"]'
        );
        if (cb) cb.checked = true;
      });
    });

    var q = params.get("q");
    if (q && searchBox) searchBox.value = q;

    var sort = params.get("sort");
    if (sort && sortSelect) sortSelect.value = sort;
  }

  function toggleEmptyState(visibleCount) {
    var empty = document.getElementById("emptyState");
    if (empty) {
      empty.style.display = visibleCount === 0 ? "" : "none";
    }
  }

  function onFilterChange() {
    resetRevealWindow();
    applyFilters();
  }

  function clearFilters() {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(function (cb) {
      cb.checked = false;
    });
    if (searchBox) searchBox.value = "";
    resetRevealWindow();
    applyFilters();
  }

  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  /* Mobile sidebar toggle */
  window.openSidebar = function () {
    document.getElementById("filterSidebar").classList.add("is-open");
    document.getElementById("filterOverlay").classList.add("is-open");
  };

  window.closeSidebar = function () {
    document.getElementById("filterSidebar").classList.remove("is-open");
    document.getElementById("filterOverlay").classList.remove("is-open");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
